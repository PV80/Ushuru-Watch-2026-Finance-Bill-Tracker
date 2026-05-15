/* global React */
// ─────────────────────────────────────────────────────────────
// UshuruWatch — atomic components
// All components prefixed UW* and exported on window for cross-script use.
// ─────────────────────────────────────────────────────────────

const { useState, useEffect, useRef, useMemo } = React;

// ── Utilities ────────────────────────────────────────────────
const KES = (n) => {
  if (!Number.isFinite(n)) n = 0;
  const r = Math.round(n);
  return r.toLocaleString("en-US").replace(/,/g, ",");
};
const KESnice = (n) => "KES " + KES(n);

// ── Logo: original mark (shield + receipt-stripe motif) ─────
function UWLogo({ size = 32, mono = false, color = "#1B3A2F" }) {
  const c = color;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      {/* shield outline */}
      <path
        d="M20 2 L36 8 V20 C36 28 28 35 20 38 C12 35 4 28 4 20 V8 Z"
        fill={mono ? "none" : c}
        stroke={c}
        strokeWidth="2"
      />
      {/* horizontal receipt-stripe bars inside */}
      <g stroke={mono ? c : "#FAFAFA"} strokeLinecap="round" strokeWidth="1.6">
        <line x1="11" y1="14" x2="29" y2="14" />
        <line x1="11" y1="19" x2="25" y2="19" />
        <line x1="11" y1="24" x2="29" y2="24" />
        <line x1="11" y1="29" x2="22" y2="29" />
      </g>
      {/* red accent dot (Kenya flag) */}
      <circle cx="32" cy="29" r="3" fill="#C8102E" />
    </svg>
  );
}

// ── Navbar ───────────────────────────────────────────────────
function UWNavbar({ lang, setLang, t, compact }) {
  const isEn = lang === "en";
  return (
    <header className="uw-nav">
      <div className="uw-nav-inner">
        <a className="uw-brand" href="#top" aria-label={t.brand}>
          <UWLogo size={compact ? 26 : 30} />
          <div className="uw-brand-text">
            <div className="uw-brand-name">{t.brand}</div>
            {!compact && (
              <div className="uw-brand-sub">{t.brandSub}</div>
            )}
          </div>
        </a>

        <div className="uw-nav-right">
          <div className="uw-pulse" aria-hidden="true">
            <span className="uw-pulse-dot" />
            <span className="uw-pulse-text">LIVE · BILL TRACKER</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={!isEn}
            className="uw-lang"
            onClick={() => setLang(isEn ? "sw" : "en")}
            title="Switch language"
          >
            <span className={"uw-lang-opt" + (isEn ? " on" : "")}>ENG</span>
            <span className="uw-lang-divider" />
            <span className={"uw-lang-opt" + (!isEn ? " on" : "")}>SWA</span>
            <span
              className="uw-lang-thumb"
              style={{ transform: isEn ? "translateX(0)" : "translateX(38px)" }}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

// ── Toggle (Yes/No) ──────────────────────────────────────────
function UWToggle({ value, onChange, labels }) {
  return (
    <div className="uw-yn" role="radiogroup">
      <button
        type="button"
        role="radio"
        aria-checked={!value}
        className={"uw-yn-btn" + (!value ? " on" : "")}
        onClick={() => onChange(false)}
      >
        {labels?.no || "No"}
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={!!value}
        className={"uw-yn-btn red" + (value ? " on" : "")}
        onClick={() => onChange(true)}
      >
        {labels?.yes || "Yes"}
      </button>
    </div>
  );
}

// ── Custom range slider ──────────────────────────────────────
function UWSlider({ value, onChange, min = 0, max = 10000, step = 100, format, marks }) {
  const ref = useRef(null);
  const pct = ((value - min) / (max - min)) * 100;

  const setFromClient = (clientX) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const raw = (clientX - r.left) / r.width;
    let v = min + raw * (max - min);
    v = Math.round(v / step) * step;
    v = Math.max(min, Math.min(max, v));
    onChange(v);
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    setFromClient(e.clientX);
    const move = (ev) => setFromClient(ev.clientX);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div className="uw-slider-wrap">
      <div className="uw-slider-readout">
        <span className="uw-slider-val">{format ? format(value) : value}</span>
      </div>
      <div
        ref={ref}
        className="uw-slider"
        onPointerDown={onPointerDown}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onChange(Math.min(max, value + step));
          if (e.key === "ArrowLeft") onChange(Math.max(min, value - step));
        }}
      >
        <div className="uw-slider-track" />
        <div className="uw-slider-fill" style={{ width: pct + "%" }} />
        <div className="uw-slider-thumb" style={{ left: pct + "%" }}>
          <div className="uw-slider-thumb-inner" />
        </div>
        {marks && (
          <div className="uw-slider-marks">
            {marks.map((m, i) => (
              <span
                key={i}
                className="uw-slider-mark"
                style={{ left: (((m.v - min) / (max - min)) * 100) + "%" }}
              >
                {m.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Question row used by calculator ──────────────────────────
function UWQuestion({ idx, title, sub, children }) {
  return (
    <div className="uw-q">
      <div className="uw-q-head">
        <span className="uw-q-idx">{String(idx).padStart(2, "0")}</span>
        <div>
          <div className="uw-q-title">{title}</div>
          <div className="uw-q-sub">{sub}</div>
        </div>
      </div>
      <div className="uw-q-body">{children}</div>
    </div>
  );
}

// ── Impact bar (sticky bottom on mobile / top sidebar on desktop) ──
function UWImpact({ total, t, line, breakdown }) {
  const yearly = total * 12;
  return (
    <div className={"uw-impact" + (line ? " inline" : "")}>
      <div className="uw-impact-kicker">{t.impactKicker}</div>
      <div className="uw-impact-amt">
        <span className="uw-impact-cur">KES</span>
        <span className="uw-impact-num" key={total}>
          {KES(total)}
        </span>
      </div>
      <div className="uw-impact-meta">
        <span className="uw-impact-yr">
          ≈ {KESnice(yearly)} <em>{t.perYear}</em>
        </span>
      </div>
      <div className="uw-impact-bars">
        {breakdown.map((b) => (
          <div key={b.key} className="uw-impact-bar-row">
            <span className="uw-impact-bar-lbl">{b.label}</span>
            <div className="uw-impact-bar-track">
              <div
                className="uw-impact-bar-fill"
                style={{
                  width: (total > 0 ? (b.amt / total) * 100 : 0) + "%",
                }}
              />
            </div>
            <span className="uw-impact-bar-amt">{KES(b.amt)}</span>
          </div>
        ))}
      </div>
      <div className="uw-impact-foot">{t.impactSub}</div>
    </div>
  );
}

// ── Receipt component (zigzag perforated supermarket receipt) ──
function UWReceipt({ t, items, total, inputs }) {
  const today = new Date().toLocaleDateString("en-GB");
  const txn = "FB26-" + (1000 + Math.floor(total)).toString();
  return (
    <div className="uw-receipt-wrap">
      <ReceiptZigzag />
      <div className="uw-receipt">
        <div className="uw-receipt-head">
          <div className="uw-r-store">{t.receiptStore}</div>
          <div className="uw-r-addr">{t.receiptAddr}</div>
          <div className="uw-r-cashier">{t.receiptCashier}</div>
          <div className="uw-r-meta">
            <span>{t.receiptDate}: {today}</span>
            <span>{t.receiptTxn}: {txn}</span>
          </div>
        </div>
        <div className="uw-r-rule" />
        <div className="uw-r-row uw-r-th">
          <span>{t.item}</span>
          <span>{t.qty}</span>
          <span style={{ textAlign: "right" }}>{t.amt}</span>
        </div>
        <div className="uw-r-rule dashed" />
        {items.map((it) => (
          <div className="uw-r-row" key={it.key} style={{ opacity: it.amt > 0 ? 1 : 0.35 }}>
            <span className="uw-r-name">{it.label}</span>
            <span className="uw-r-qty">{it.qty}</span>
            <span className="uw-r-amt">{KES(it.amt)}</span>
          </div>
        ))}
        <div className="uw-r-rule dashed" />
        <div className="uw-r-row uw-r-sub">
          <span>{t.subTotal}</span>
          <span></span>
          <span className="uw-r-amt">{KES(total)}</span>
        </div>
        <div className="uw-r-rule" />
        <div className="uw-r-row uw-r-total">
          <span>{t.dispLost}</span>
          <span></span>
          <span className="uw-r-amt">{KESnice(total)}</span>
        </div>
        <div className="uw-r-row uw-r-annual">
          <span>{t.annualised}</span>
          <span>× 12</span>
          <span className="uw-r-amt">{KESnice(total * 12)}</span>
        </div>
        <div className="uw-r-barcode">
          <Barcode value={txn} />
          <div className="uw-r-barcode-num">{txn}</div>
        </div>
        <div className="uw-r-foot">
          <div>{t.receiptFoot}</div>
          <div className="uw-r-foot2">{t.receiptFoot2}</div>
        </div>
      </div>
      <ReceiptZigzag bottom />
    </div>
  );
}

// Zigzag torn-paper edge (top or bottom of receipt)
function ReceiptZigzag({ bottom }) {
  const teeth = 24;
  const w = 100;
  const step = w / teeth;
  let d = "M 0 " + (bottom ? 0 : 8);
  for (let i = 0; i < teeth; i++) {
    const x1 = i * step + step / 2;
    const x2 = (i + 1) * step;
    if (bottom) {
      d += ` L ${x1} 8 L ${x2} 0`;
    } else {
      d += ` L ${x1} 0 L ${x2} 8`;
    }
  }
  if (bottom) d += " L 100 0 L 0 0 Z";
  else d += " L 100 8 L 100 0 L 0 0 Z";
  return (
    <svg
      className={"uw-r-zigzag " + (bottom ? "bot" : "top")}
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
    >
      <path d={d} fill="#FFFEF8" />
    </svg>
  );
}

// Simple barcode visualization (random-looking but deterministic from value)
function Barcode({ value }) {
  const bars = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < value.length; i++) seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
    const out = [];
    for (let i = 0; i < 56; i++) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      out.push((seed % 4) + 1); // 1..4
    }
    return out;
  }, [value]);
  return (
    <div className="uw-barcode">
      {bars.map((w, i) => (
        <span key={i} className="uw-bar" style={{ width: w + "px" }} />
      ))}
    </div>
  );
}

// ── Civic Action panel ──────────────────────────────────────
function UWCivic({ t, total, breakdown }) {
  const memo = useMemo(() => {
    return [
      "To: The Clerk, Departmental Committee on Finance & National Planning",
      "Parliament Buildings, Nairobi",
      "",
      `Re: ${t.civicSubjectVal}`,
      "",
      "Honourable Members,",
      "",
      "I write under Article 118 of the Constitution to submit views on the",
      "Finance Bill, 2026. Based on the Bill as gazetted, my personal monthly",
      `tax burden will increase by KES ${KES(total)} — approximately`,
      `KES ${KES(total * 12)} per year.`,
      "",
      "I respectfully object to the following measures:",
      "",
      ...breakdown
        .filter((b) => b.amt > 0)
        .map((b) => `  • ${b.label} — additional KES ${KES(b.amt)}/month.`),
      "",
      "These proposals will reduce disposable income, deepen the cost-of-living",
      "crisis, and disproportionately affect low and middle-income earners.",
      "",
      "I urge the Committee to reject or substantially amend the above clauses",
      "in line with public input received during this participation period.",
      "",
      "Yours sincerely,",
      "[Your name]",
      "[Constituency]",
    ].join("\n");
  }, [total, breakdown, t]);

  const [text, setText] = useState(memo);
  useEffect(() => setText(memo), [memo]);

  const words = (text.trim().match(/\S+/g) || []).length;
  const subject = t.civicSubjectVal;
  const to = "publicparticipation@parliament.go.ke";

  return (
    <div className="uw-civic">
      <div className="uw-civic-head">
        <span className="uw-eyebrow">CIVIC ACTION · ARTICLE 118</span>
        <h3 className="uw-h3">{t.civicHead}</h3>
        <p className="uw-civic-sub">{t.civicSub}</p>
      </div>
      <div className="uw-civic-fields">
        <label className="uw-field">
          <span className="uw-field-lbl">{t.civicTo}</span>
          <span className="uw-field-val">{to}</span>
        </label>
        <label className="uw-field">
          <span className="uw-field-lbl">{t.civicSubject}</span>
          <span className="uw-field-val">{subject}</span>
        </label>
      </div>
      <textarea
        className="uw-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        rows={14}
      />
      <div className="uw-civic-foot">
        <span className="uw-wc">{words} {t.civicWordCount}</span>
        <div className="uw-civic-actions">
          <button
            type="button"
            className="uw-btn uw-btn-ghost"
            onClick={() => {
              navigator.clipboard?.writeText(text).catch(() => {});
            }}
          >
            <IconCopy /> {t.civicCopy}
          </button>
          <a
            className="uw-btn uw-btn-primary"
            href={`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`}
          >
            <IconMail /> {t.civicSendEmail}
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Chat Widget (FAB + expanded) ────────────────────────────
function UWChat({ t }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { role: "bot", text: t.chatGreeting },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    setMsgs((m) => [{ role: "bot", text: t.chatGreeting }, ...m.slice(1)]);
  }, [t]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, open]);

  const send = (q) => {
    const text = (q ?? input).trim();
    if (!text) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    // Mock cited answer
    setTimeout(() => {
      const answer = mockAnswer(text);
      setMsgs((m) => [...m, { role: "bot", text: answer.text, cite: answer.cite }]);
    }, 450);
  };

  return (
    <>
      <button
        className={"uw-fab" + (open ? " open" : "")}
        onClick={() => setOpen((o) => !o)}
        aria-label={t.chatTitle}
      >
        {open ? <IconClose /> : <IconChat />}
        {!open && <span className="uw-fab-label">{t.chatTitle}</span>}
      </button>
      <div className={"uw-chat" + (open ? " open" : "")}>
        <div className="uw-chat-head">
          <div className="uw-chat-avatar"><UWLogo size={22} mono /></div>
          <div>
            <div className="uw-chat-title">{t.chatTitle}</div>
            <div className="uw-chat-sub">{t.chatSubtitle}</div>
          </div>
          <button className="uw-chat-close" onClick={() => setOpen(false)} aria-label="close">
            <IconClose />
          </button>
        </div>
        <div className="uw-chat-body" ref={scrollRef}>
          {msgs.map((m, i) => (
            <div key={i} className={"uw-msg " + m.role}>
              <div className="uw-msg-bubble">
                {m.text}
                {m.cite && (
                  <div className="uw-cite">
                    <IconCite /> {m.cite}
                  </div>
                )}
              </div>
            </div>
          ))}
          {msgs.length <= 1 && (
            <div className="uw-suggest">
              {[t.chatSuggestQ1, t.chatSuggestQ2, t.chatSuggestQ3].map((q) => (
                <button key={q} onClick={() => send(q)} className="uw-chip">
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
        <form
          className="uw-chat-input"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chatPlaceholder}
          />
          <button type="submit" aria-label="send"><IconSend /></button>
        </form>
      </div>
    </>
  );
}

function mockAnswer(q) {
  const s = q.toLowerCase();
  if (/boda|rider|moto/.test(s))
    return {
      text:
        "The Bill introduces a flat KES 240/month digital-services-tax extension to ride-hailing platforms. Riders take a 6% withholding cut on commissions.",
      cite: "Finance Bill 2026 · §53(2) and Third Schedule",
    };
  if (/fuel|petrol|diesel/.test(s))
    return {
      text:
        "Excise on petrol rises from KES 21.95 to KES 24.50 per litre. Pump prices in Nairobi should move up ~KES 2.55/L from the gazette date.",
      cite: "Finance Bill 2026 · §18 amending Excise Duty Act",
    };
  if (/bread|vat|food/.test(s))
    return {
      text:
        "Ordinary bread loses its zero-rated status and moves to 16% VAT. Expect a KES 8–10 shelf-price increase per 400g loaf.",
      cite: "Finance Bill 2026 · §6 amending First Schedule of VAT Act",
    };
  return {
    text:
      "I can answer questions about specific clauses, sectors or product categories in the Finance Bill 2026. Try asking about VAT, excise, withholding, or a specific product.",
    cite: null,
  };
}

// ── Icons ────────────────────────────────────────────────────
const I = (props) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props} />;
const IconChat = () => <I><path d="M3 3h10v8H6l-3 3V3z"/></I>;
const IconClose = () => <I><path d="M4 4l8 8M12 4l-8 8"/></I>;
const IconSend = () => <I><path d="M2 8L14 2l-4 12-2-5-6-1z"/></I>;
const IconMail = () => <I><rect x="2" y="3.5" width="12" height="9" rx="1.2"/><path d="M2.5 4.5l5.5 4.5 5.5-4.5"/></I>;
const IconCopy = () => <I><rect x="5" y="5" width="8" height="8" rx="1"/><path d="M3 11V4a1 1 0 011-1h7"/></I>;
const IconWa = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11 11 0 003 17l-1 5 5.2-1.4A11 11 0 1020.5 3.5zM12 20a8 8 0 01-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1112 20zm4.5-5.7c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.3-.7.8-.8 1-.1.1-.3.1-.5 0-.2-.1-1-.4-2-1.3-.7-.7-1.2-1.5-1.4-1.7-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.2.2-.4 0-.1 0-.3-.1-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.7 2.7 4.2 3.7.6.3 1 .4 1.4.5.6.2 1.1.2 1.6.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.1-.4-.2z"/></svg>
);
const IconCite = () => <I><path d="M4 6h8M4 9h8M4 12h5"/></I>;
const IconArrow = () => <I><path d="M3 8h10M9 4l4 4-4 4"/></I>;

Object.assign(window, {
  UWLogo, UWNavbar, UWToggle, UWSlider, UWQuestion,
  UWImpact, UWReceipt, UWCivic, UWChat,
  IconWa, IconMail, IconCopy, IconArrow, IconChat,
  KES, KESnice,
});
