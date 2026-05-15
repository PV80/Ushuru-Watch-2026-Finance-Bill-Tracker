"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { KwMark } from "./primitives";
import type { I18NStrings } from "@/lib/i18n";

export default function KwChat({ t }: { t: I18NStrings }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const { messages, input, handleInputChange, handleSubmit, append, status, error } = useChat({
    api: "/api/chat",
  });

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, open, status]);

  const suggestions = [t.chatSuggestQ1, t.chatSuggestQ2, t.chatSuggestQ3];
  const sendSuggestion = (q: string) => append({ role: "user", content: q });

  return (
    <>
      <button className={"kw-fab" + (open ? " open" : "")} onClick={() => setOpen((o) => !o)}>
        <span className="glyph">
          {open ? (
            <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M3 3l6 6M9 3l-6 6" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <circle cx="3" cy="6" r="1.2" />
              <circle cx="6" cy="6" r="1.2" />
              <circle cx="9" cy="6" r="1.2" />
            </svg>
          )}
        </span>
        {!open && <span className="label">Ask the Bill</span>}
      </button>

      <div className={"kw-chat" + (open ? " open" : "")}>
        <div className="kw-chat-head">
          <div className="kw-chat-avatar">
            <KwMark size={18} />
          </div>
          <div>
            <div className="kw-chat-title">{t.chatTitle}</div>
            <div className="kw-chat-sub">{t.chatSubtitle}</div>
          </div>
          <button className="kw-chat-close" onClick={() => setOpen(false)} aria-label="close">
            <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M3 3l6 6M9 3l-6 6" />
            </svg>
          </button>
        </div>
        <div className="kw-chat-body" ref={bodyRef}>
          {messages.length === 0 && (
            <div className="kw-msg bot">
              <div className="kw-bubble">{t.chatGreeting}</div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={"kw-msg " + (m.role === "user" ? "user" : "bot")}>
              <div className="kw-bubble">{m.content}</div>
            </div>
          ))}
          {status === "streaming" && messages[messages.length - 1]?.role === "user" && (
            <div className="kw-msg bot">
              <div className="kw-bubble">…</div>
            </div>
          )}
          {error && (
            <div className="kw-msg bot">
              <div className="kw-bubble" style={{ background: "#3a1010", color: "#ffd1d1" }}>
                {t.chatError} {error.message}
              </div>
            </div>
          )}
          {messages.length === 0 && (
            <div className="kw-suggest">
              {suggestions.map((q) => (
                <button key={q} className="kw-chip" onClick={() => sendSuggestion(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
        <form className="kw-chat-input" onSubmit={handleSubmit}>
          <input value={input} onChange={handleInputChange} placeholder={t.chatPlaceholder} />
          <button type="submit" aria-label="send" disabled={status === "streaming"}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 8L14 2l-4 12-2-5-6-1z" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
