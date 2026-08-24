import { NextRequest } from "next/server";
import { buildAriaSystem, fallbackAria } from "@/lib/aria-persona";
import { knowledgeBlock } from "@/lib/aria-knowledge";
import { getSettings } from "@/lib/site-settings";
import { withActions } from "@/lib/aria-actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type ChatMsg = { role: "user" | "assistant"; content: string };

const hits = new Map<string, { n: number; t: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now - row.t > 10 * 60 * 1000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  row.n += 1;
  return row.n > 40;
}

function ssePayload(text: string) {
  return `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\ndata: [DONE]\n\n`;
}

function textResponse(text: string) {
  return new Response(ssePayload(text), {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

function jsonError(message: string, status = 503) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  if (rateLimited(ip)) return jsonError("Aria needs a sip of water. Try again in a few minutes.", 429);

  const body = await req.json().catch(() => ({}));
  const locale = body.locale === "fr" ? "fr" : "en";
  const raw = (Array.isArray(body.messages) ? body.messages : []) as ChatMsg[];
  const messages = raw
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-16)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) }));
  const last = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  if (!last.trim()) return jsonError("Say something and I’ll take it from there.", 400);

  const settings = getSettings();
  if (!settings.chatEnabled) return jsonError("Aria is taking a short rest. Try again soon.");

  const retrieved = knowledgeBlock(last, locale);
  const system = buildAriaSystem(locale, retrieved);
  const key = process.env.XAI_API_KEY;
  if (!key) return textResponse(withActions(fallbackAria(last, locale), last, locale));

  const chatBody = {
    model: "grok-4.6",
    stream: true,
    temperature: 0.9,
    messages: [{ role: "system", content: system }, ...messages],
    tools: [{ type: "web_search" as const }],
  };

  try {
    const streamed = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(chatBody),
    });
    if (streamed.ok && streamed.body) {
      return new Response(relayXaiStream(streamed.body, last, locale), {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
        },
      });
    }

    const retry = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...chatBody, tools: undefined, stream: false }),
    });
    if (retry.ok) {
      const data = await retry.json();
      const text = data?.choices?.[0]?.message?.content || fallbackAria(last, locale);
      return textResponse(withActions(String(text), last, locale));
    }

    const responses = await fetch("https://api.x.ai/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "grok-4.6",
        instructions: system,
        input: messages.map((m) => ({ role: m.role, content: m.content })),
        tools: [{ type: "web_search" }],
        temperature: 0.7,
      }),
    });
    if (responses.ok) {
      const data = await responses.json();
      const text =
        data?.output_text ||
        data?.output?.find((o: { type?: string; content?: Array<{ text?: string }> }) => o.type === "message")
          ?.content?.map((c: { text?: string }) => c.text || "")
          .join("") ||
        fallbackAria(last, locale);
      return textResponse(withActions(String(text), last, locale));
    }
    return textResponse(withActions(fallbackAria(last, locale), last, locale));
  } catch {
    return textResponse(withActions(fallbackAria(last, locale), last, locale));
  }
}

function relayXaiStream(body: ReadableStream<Uint8Array>, last: string, locale: "en" | "fr") {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buf = "";
  let acc = "";
  return new ReadableStream({
    async start(controller) {
      const reader = body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const json = JSON.parse(data);
              const piece =
                json.choices?.[0]?.delta?.content ||
                json.choices?.[0]?.message?.content ||
                json.delta ||
                "";
              if (typeof piece === "string" && piece) {
                acc += piece;
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: piece } }] })}\n\n`)
                );
              }
            } catch {
              /* keep-alive / tool events */
            }
          }
        }
        const finished = withActions(acc || fallbackAria(last, locale), last, locale);
        const extra = acc ? finished.slice(acc.length) : finished;
        if (!acc) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: finished } }] })}\n\n`)
          );
        } else if (extra) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: extra } }] })}\n\n`)
          );
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch {
        const fb = withActions(fallbackAria(last, locale), last, locale);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: fb } }] })}\n\ndata: [DONE]\n\n`)
        );
        controller.close();
      }
    },
  });
}
