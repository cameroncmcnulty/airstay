"use client";

import { FormEvent, useEffect, useRef, useState, type ReactNode } from "react";
import { Send, X, Sparkles, RotateCcw } from "lucide-react";
import { useApp } from "@/context/AppContext";

type Msg = { role: "user" | "assistant"; content: string };

const STORE = "airstay.aria.v2";

export function AriaChat() {
  const { m, locale, settings } = useApp();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const enabled = settings?.chatEnabled !== false;

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length) setMsgs(parsed.slice(-40));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-40)));
    } catch {
      /* ignore */
    }
  }, [msgs, hydrated]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open, busy]);

  useEffect(() => {
    if (!open) return;
    if (msgs.length === 0) setMsgs([{ role: "assistant", content: m.aria.greeting }]);
    const t = setTimeout(() => inputRef.current?.focus(), 180);
    return () => clearTimeout(t);
  }, [open, m.aria.greeting, msgs.length]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!enabled) return null;

  async function send(text?: string) {
    const q = (text || input).trim();
    if (!q || busy) return;
    const history = [...msgs.filter((x) => x.content), { role: "user" as const, content: q }];
    setMsgs(history);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/aria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.filter((x) => x.content), locale }),
      });
      if (!res.ok || !res.body) throw new Error("aria");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMsgs([...history, { role: "assistant", content: "" }]);
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n");
        buf = parts.pop() || "";
        for (const line of parts) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const piece = json.choices?.[0]?.delta?.content || json.choices?.[0]?.message?.content || "";
            if (piece) {
              acc += piece;
              setMsgs([...history, { role: "assistant", content: acc }]);
            }
          } catch {
            /* keep-alives */
          }
        }
      }
      if (!acc) setMsgs([...history, { role: "assistant", content: m.aria.error }]);
    } catch {
      setMsgs([...history, { role: "assistant", content: m.aria.error }]);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setMsgs([{ role: "assistant", content: m.aria.greeting }]);
    try {
      sessionStorage.removeItem(STORE);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] sm:bottom-6 sm:right-6">
      {open && (
        <div className="aria-panel pointer-events-auto mb-3 flex h-[min(620px,78vh)] w-[min(420px,calc(100vw-1.75rem))] flex-col overflow-hidden rounded-[1.7rem] border border-sky-300/25 bg-[#071428] shadow-[0_28px_90px_-24px_rgba(4,16,48,.85)] sm:mb-4">
          <div className="relative overflow-hidden border-b border-white/10 px-4 py-3.5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(67,129,199,.35),transparent_55%),radial-gradient(90%_70%_at_100%_0%,rgba(125,186,232,.18),transparent_50%)]" />
            <div className="relative flex items-center gap-3">
              <span className="aria-orb grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-sky via-[#7bb3e1] to-navy text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black tracking-wide text-white">{m.aria.name}</p>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-200/85">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  {m.aria.title}
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                aria-label={m.aria.reset}
                title={m.aria.reset}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                aria-label={m.aria.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md bg-gradient-to-br from-sky to-[#2f6cb3] text-white"
                      : "rounded-bl-md bg-white/[0.07] text-sky-50 ring-1 ring-white/10"
                  }`}
                >
                  {msg.role === "assistant" ? <AriaMarkdown text={msg.content} /> : msg.content}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 pl-1 text-sky-200/80">
                <span className="aria-dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">{m.aria.thinking}</span>
              </div>
            )}
            {msgs.length <= 1 && !busy && (
              <div className="flex flex-wrap gap-2 pt-1">
                {m.aria.chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => send(chip)}
                    className="rounded-full border border-sky-300/30 bg-white/5 px-3 py-1.5 text-xs font-semibold text-sky-100 transition hover:border-sky-200/60 hover:bg-white/10"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="border-t border-white/10 p-3"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              send();
            }}
          >
            <div className="flex items-center gap-2 rounded-full bg-white/8 ring-1 ring-white/15 focus-within:ring-2 focus-within:ring-sky/60">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={m.aria.placeholder}
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/35"
                maxLength={2000}
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="mr-1 grid h-9 w-9 place-items-center rounded-full bg-sky text-white transition hover:bg-sky-600 disabled:opacity-40"
                aria-label={m.aria.send}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="aria-launcher pointer-events-auto relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-sky via-[#5aa0e0] to-navy text-white sm:h-[4.25rem] sm:w-[4.25rem]"
        aria-label={open ? m.aria.close : m.aria.open}
      >
        <span className="aria-pulse" />
        <span className="aria-pulse aria-pulse-delay" />
        <span className="aria-ring" />
        {open ? <X className="relative z-[1] h-5 w-5 sm:h-6 sm:w-6" /> : <Sparkles className="relative z-[1] h-5 w-5 sm:h-6 sm:w-6" />}
      </button>
    </div>
  );
}

function AriaMarkdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-2">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const list = lines.every((l) => /^\s*([-*]|\d+\.)\s+/.test(l));
        if (list) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-4">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*([-*]|\d+\.)\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function inline(s: string): ReactNode[] {
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      out.push(
        <strong key={k++} className="font-bold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`")) {
      out.push(
        <code key={k++} className="rounded bg-black/30 px-1 font-mono text-[0.85em]">
          {token.slice(1, -1)}
        </code>
      );
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const href = safeHref(link[2]);
        if (href) {
          out.push(
            <a
              key={k++}
              href={href}
              className="font-semibold text-sky-200 underline decoration-sky-400/60 underline-offset-2 hover:text-white"
              {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {link[1]}
            </a>
          );
        } else out.push(link[1]);
      }
    }
    last = m.index + token.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

function safeHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  try {
    const u = new URL(href);
    if (u.protocol === "https:" || u.protocol === "http:") return u.toString();
  } catch {
    return "";
  }
  return "";
}
