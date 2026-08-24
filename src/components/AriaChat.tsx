"use client";

import { FormEvent, useEffect, useRef, useState, type ReactNode } from "react";
import { Send, X, Sparkles, RotateCcw, ArrowUpRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { parseFence, type AriaAction } from "@/lib/aria-actions";

type Msg = { role: "user" | "assistant"; content: string };

const STORE = "airstay.aria.v4";

export function AriaChat() {
  const { m, locale, settings } = useApp();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!enabled) return null;

  async function send(text?: string) {
    const q = (text || input).trim();
    if (!q || busy) return;
    const history = [...msgs.filter((x) => x.content), { role: "user" as const, content: q }];
    setMsgs(history);
    setInput("");
    setBusy(true);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const res = await fetch("/api/aria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ac.signal,
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
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") return;
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
        <div className="pointer-events-auto mb-3 flex h-[min(560px,74vh)] w-[min(400px,calc(100vw-1.75rem))] flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-card ring-1 ring-navy/10 sm:mb-4">
          <div className="flex items-center gap-3 bg-mist px-4 py-3">
            <span className="aria-orb grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sky to-navy text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-navy">{m.aria.name}</p>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-navy/55">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {m.aria.title}
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="grid h-8 w-8 place-items-center rounded-full text-navy/45 hover:bg-white hover:text-navy"
              aria-label={m.aria.reset}
              title={m.aria.reset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full text-navy/45 hover:bg-white hover:text-navy"
              aria-label={m.aria.close}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-white px-4 py-4">
            {msgs.map((msg, i) => {
              if (msg.role === "user") {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[88%] rounded-2xl rounded-br-md bg-sky px-3.5 py-2.5 text-sm leading-relaxed text-white">
                      {msg.content}
                    </div>
                  </div>
                );
              }
              const parsed = parseFence(msg.content);
              return (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[92%] space-y-2">
                    {parsed.text && (
                      <div className="rounded-2xl rounded-bl-md bg-mist px-3.5 py-2.5 text-sm leading-relaxed text-navy">
                        <AriaMarkdown text={parsed.text} />
                      </div>
                    )}
                    {parsed.actions.length > 0 && <AriaActions actions={parsed.actions} />}
                  </div>
                </div>
              );
            })}
            {busy && (
              <div className="flex items-center gap-2 pl-1 text-navy/45">
                <span className="aria-dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="text-[11px] font-semibold">{m.aria.thinking}</span>
              </div>
            )}
            {msgs.length <= 1 && !busy && (
              <div className="flex flex-wrap gap-2 pt-1">
                {m.aria.chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => send(chip)}
                    className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-navy transition hover:bg-sky-100"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="bg-white px-3 pb-3 pt-1"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              send();
            }}
          >
            <div className="flex items-center gap-2 rounded-full bg-mist px-2 py-1.5 focus-within:bg-sky-50">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={m.aria.placeholder}
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-navy outline-none placeholder:text-navy/35"
                maxLength={2000}
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky text-white transition hover:bg-sky-600 disabled:bg-navy/15 disabled:text-navy/30"
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
        className="aria-launcher pointer-events-auto relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-sky via-[#5aa0e0] to-navy text-white sm:h-16 sm:w-16"
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

function AriaActions({ actions }: { actions: AriaAction[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {actions.map((a) => (
        <a
          key={a.href}
          href={a.href}
          className="inline-flex items-center justify-between gap-2 rounded-full bg-navy px-3.5 py-2 text-xs font-bold text-white transition hover:bg-sky"
        >
          <span>{a.label}</span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
        </a>
      ))}
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
  let match: RegExpExecArray | null;
  let k = 0;
  while ((match = re.exec(s))) {
    if (match.index > last) out.push(s.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      out.push(
        <strong key={k++} className="font-bold text-navy">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`")) {
      out.push(
        <code key={k++} className="rounded bg-white px-1 font-mono text-[0.85em] text-navy">
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
              className="font-semibold text-sky-700 underline decoration-sky/40 underline-offset-2 hover:text-navy"
              {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {link[1]}
            </a>
          );
        } else out.push(link[1]);
      }
    }
    last = match.index + token.length;
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
