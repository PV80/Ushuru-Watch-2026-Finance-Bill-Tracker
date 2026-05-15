/* global React */
// Ushuru Watch v2 — bolder, simpler.

const { useState, useEffect, useRef, useMemo } = React;

const KES = (n) => {
  if (!Number.isFinite(n)) n = 0;
  return Math.round(n).toLocaleString("en-US");
};

// ── Tax model — same as v1 ────────────────────────────────
function calc(i) {
  const phone = i.phone ? Math.round((28000 * 0.15) / 24) : 0;
  const mitumba = Math.round(i.mitumba * 0.25 * 0.6);
  const rent = Math.round(i.rent * 0.05);
  const scrap = i.scrap ? 6500 : 0;
  return { phone, mitumba, rent, scrap, total: phone + mitumba + rent + scrap };
}

// ── Logo mark ─────────────────────────────────────────────
function KwMark({ size = 18, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 4h11l3 4v12H5z"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <g stroke={color} strokeLinecap="round" strokeWidth="1.5">
        <line x1="8" y1="10" x2="15" y2="10" />
        <line x1="8" y1="13" x2="13" y2="13" />
        <line x1="8" y1="16" x2="14" y2="16" />
      </g>
    </svg>
  );
}

// ── Big animated count-up number ──────────────────────────
function BigNumber({ value }) {
  const [shown, setShown] = useState(value);
  const raf = useRef(null);
  useEffect(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    const from = shown;
    const to = value;
    const dur = 380;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(from + (to - from) * e));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => raf.current && cancelAnimationFrame(raf.current);
    // eslint-disable-next-line
  }, [value]);
  return <span className="kw-result-num">{KES(shown)}</span>;
}

// ── Yes / No tile pair ────────────────────────────────────
function KwYesNo({ value, onChange, t, tone = "red" }) {
  return (
    <div className="kw-yn">
      <button
        type="button"
        className={"kw-yn-tile" + (value === false ? " on green" : "")}
        onClick={() => onChange(false)}
      >
        <span>{t.no}</span>
        <span className="kw-yn-cost">— KES 0/mo</span>
      </button>
      <button
        type="button"
        className={"kw-yn-tile" + (value === true ? " on " + tone : "")}
        onClick={() => onChange(true)}
      >
        <span>{t.yes}</span>
        <span className="kw-yn-cost">+ extra tax</span>
      </button>
    </div>
  );
}

// ── Slider ────────────────────────────────────────────────
function KwSlider({ value, onChange, min, max, step, marks }) {
  const ref = useRef(null);
  const pct = ((value - min) / (max - min)) * 100;
  const setFromClient = (clientX) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    let v = min + ((clientX - r.left) / r.width) * (max - min);
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
    <div className="kw-slider">
      <div className="kw-slider-readout">
        <span className="kw-slider-cur">KES</span>
        <span className="kw-slider-val">{KES(value)}</span>
        <span className="kw-slider-per">/ month</span>
      </div>
      <div
        ref={ref}
        className="kw-slider-track-wrap"
        onPointerDown={onPointerDown}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
      >
        <div className="kw-slider-track" />
        <div className="kw-slider-fill" style={{ width: pct + "%" }} />
        <div className="kw-slider-thumb" style={{ left: pct + "%" }} />
      </div>
      {marks && (
        <div className="kw-slider-marks">
          {marks.map((m) => (
            <span key={m.v}>{m.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Question card ─────────────────────────────────────────
function KwQ({ num, total, title, clause, active, children }) {
  return (
    <div className={"kw-qcard" + (active ? " active" : "")}>
      <div className="kw-qcard-num">
        Q{String(num).padStart(2, "0")} <span style={{ opacity: 0.4 }}> / {String(total).padStart(2, "0")}</span>
      </div>
      <div className="kw-qcard-title">{title}</div>
      {clause && <div className="kw-qcard-clause">FINANCE BILL 2026 · {clause}</div>}
      <div className="kw-qcard-body">{children}</div>
    </div>
  );
}

// ── Receipt ───────────────────────────────────────────────
function KwReceipt({ items, total, t }) {
  const today = new Date().toLocaleDateString("en-GB");
  const txn = "FB26-" + (1000 + Math.floor(total)).toString();
  const bars = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < txn.length; i++) seed = (seed * 31 + txn.charCodeAt(i)) >>> 0;
    const out = [];
    for (let i = 0; i < 52; i++) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      out.push((seed % 4) + 1);
    }
    return out;
  }, [txn]);

  return (
    <div className="kw-receipt-wrap">
      <Zigzag />
      <div className="kw-receipt">
        <div className="kw-r-head">
          <div className="kw-r-store">REPUBLIC OF KENYA</div>
          <div className="kw-r-addr">TREASURY · KRA-PIN A000000000Z</div>
          <div className="kw-r-cashier">CASHIER: FINANCE BILL 2026</div>
          <div className="kw-r-meta">
            <span>{today}</span>
            <span>{txn}</span>
          </div>
        </div>
        <div className="kw-r-rule" />
        {items.map((it) => (
          <div className={"kw-r-row" + (it.amt === 0 ? " muted" : "")} key={it.key}>
            <span className="kw-r-name">{it.label}</span>
            <span className="kw-r-amt">{KES(it.amt)}</span>
          </div>
        ))}
        <div className="kw-r-rule dashed" />
        <div className="kw-r-total">
          <span className="lbl">{t.dispLost || "Disposable income lost"}</span>
          <span className="val">KES {KES(total)}</span>
          <span className="yr">= KES {KES(total * 12)} per year</span>
        </div>
        <div className="kw-r-barcode">
          <div className="kw-barcode">
            {bars.map((w, i) => (
              <span key={i} className="kw-bar" style={{ width: w + "px" }} />
            ))}
          </div>
          <div className="kw-r-bnum">{txn}</div>
        </div>
        <div className="kw-r-rule" />
        <div className="kw-r-foot">THANK YOU FOR YOUR CONTRIBUTION</div>
        <div className="kw-r-foot dim">* NO REFUNDS · NO COMPLAINTS DESK *</div>
      </div>
      <Zigzag bottom />
    </div>
  );
}

function Zigzag({ bottom }) {
  const teeth = 26;
  const w = 100;
  const step = w / teeth;
  let d = "M 0 " + (bottom ? 0 : 10);
  for (let i = 0; i < teeth; i++) {
    const x1 = i * step + step / 2;
    const x2 = (i + 1) * step;
    if (bottom) d += ` L ${x1} 10 L ${x2} 0`;
    else d += ` L ${x1} 0 L ${x2} 10`;
  }
  if (bottom) d += " L 100 0 L 0 0 Z";
  else d += " L 100 10 L 100 0 L 0 0 Z";
  return (
    <svg className="kw-zigzag" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill="#FFFEF8" />
    </svg>
  );
}

// ── Chat (compact rewrite) ────────────────────────────────
function KwChat({ t }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "bot", text: t.chatGreeting }]);
  const [input, setInput] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [msgs, open]);
  useEffect(() => {
    setMsgs((m) => [{ role: "bot", text: t.chatGreeting }, ...m.slice(1)]);
  }, [t]);

  const send = (q) => {
    const text = (q ?? input).trim();
    if (!text) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      const a = mockAnswer(text);
      setMsgs((m) => [...m, { role: "bot", text: a.text, cite: a.cite }]);
    }, 420);
  };

  return (
    <>
      <button className={"kw-fab" + (open ? " open" : "")} onClick={() => setOpen((o) => !o)}>
        <span className="glyph">
          {open ? (
            <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2" fill="none"><path d="M3 3l6 6M9 3l-6 6"/></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><circle cx="3" cy="6" r="1.2"/><circle cx="6" cy="6" r="1.2"/><circle cx="9" cy="6" r="1.2"/></svg>
          )}
        </span>
        {!open && <span className="label">Ask the Bill</span>}
      </button>
      <div className={"kw-chat" + (open ? " open" : "")}>
        <div className="kw-chat-head">
          <div className="kw-chat-avatar"><KwMark size={18} /></div>
          <div>
            <div className="kw-chat-title">{t.chatTitle}</div>
            <div className="kw-chat-sub">{t.chatSubtitle}</div>
          </div>
          <button className="kw-chat-close" onClick={() => setOpen(false)} aria-label="close">
            <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2" fill="none"><path d="M3 3l6 6M9 3l-6 6"/></svg>
          </button>
        </div>
        <div className="kw-chat-body" ref={ref}>
          {msgs.map((m, i) => (
            <div key={i} className={"kw-msg " + m.role}>
              <div className="kw-bubble">
                {m.text}
                {m.cite && <div className="kw-cite">{m.cite}</div>}
              </div>
            </div>
          ))}
          {msgs.length <= 1 && (
            <div className="kw-suggest">
              {[t.chatSuggestQ1, t.chatSuggestQ2, t.chatSuggestQ3].map((q) => (
                <button key={q} className="kw-chip" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          )}
        </div>
        <form className="kw-chat-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.chatPlaceholder} />
          <button type="submit" aria-label="send">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8L14 2l-4 12-2-5-6-1z"/></svg>
          </button>
        </form>
      </div>
    </>
  );
}

function mockAnswer(q) {
  const s = q.toLowerCase();
  if (/boda|rider|moto/.test(s))
    return { text: "Riders take a 6% withholding cut on ride-hailing commissions. Net loss: ~KES 240/month at average earnings.", cite: "Finance Bill 2026 · §53(2)" };
  if (/fuel|petrol|diesel/.test(s))
    return { text: "Excise on petrol rises from KES 21.95 to KES 24.50 per litre. Expect ~KES 2.55/L at the pump.", cite: "Finance Bill 2026 · §18" };
  if (/bread|vat|food/.test(s))
    return { text: "Ordinary bread moves to 16% VAT. A 400g loaf could rise KES 8–10 on the shelf.", cite: "Finance Bill 2026 · §6 — VAT Act Schedule 1" };
  return { text: "Ask about any clause, sector or product — VAT, excise, withholding. I'll cite the section.", cite: null };
}

// ── Navbar ────────────────────────────────────────────────
function KwNavbar({ lang, setLang, t }) {
  const isEn = lang === "en";
  return (
    <header className="kw-nav">
      <div className="kw-nav-inner">
        <a className="kw-brand" href="#top">
          <div className="kw-brand-mark"><KwMark size={18} /></div>
          <div>
            <div className="kw-brand-name">{t.brand}</div>
            <div className="kw-brand-sub">{t.brandSub}</div>
          </div>
        </a>
        <div className="kw-nav-right">
          <button
            type="button"
            className="kw-lang"
            onClick={() => setLang(isEn ? "sw" : "en")}
            aria-label="Language"
          >
            <span className="kw-lang-thumb" style={{ transform: isEn ? "translateX(0)" : "translateX(44px)" }} />
            <span className={"kw-lang-opt" + (isEn ? " on" : "")}>EN</span>
            <span className={"kw-lang-opt" + (!isEn ? " on" : "")}>SW</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ── App ───────────────────────────────────────────────────
function UshuruAppV2({ initialLang = "en" }) {
  const [lang, setLang] = useState(initialLang);
  const t = window.I18N[lang];
  useEffect(() => { setLang(initialLang); }, [initialLang]);

  const [phone, setPhone] = useState(true);
  const [mitumba, setMitumba] = useState(2500);
  const [rent, setRent] = useState(22000);
  const [scrap, setScrap] = useState(false);

  const r = useMemo(() => calc({ phone, mitumba, rent, scrap }), [phone, mitumba, rent, scrap]);

  const items = [
    { key: "phone", label: "New smartphone (§14)", amt: r.phone },
    { key: "mitumba", label: "Mitumba duty (§22)", amt: r.mitumba },
    { key: "rent", label: "Rent withholding (§31)", amt: r.rent },
    { key: "scrap", label: "Scrap VAT (§47)", amt: r.scrap },
  ];

  // Auto-drafted memo
  const memo = useMemo(() => [
    "To the Clerk, Departmental Committee on Finance & National Planning",
    "Parliament Buildings, Nairobi",
    "",
    `Re: ${t.civicSubjectVal}`,
    "",
    "Honourable Members,",
    "",
    "I write under Article 118 of the Constitution to submit views on the",
    "Finance Bill, 2026. Based on the gazetted draft, my personal monthly",
    `tax burden will increase by KES ${KES(r.total)} — approximately`,
    `KES ${KES(r.total * 12)} per year.`,
    "",
    "I respectfully object to the following measures and urge the Committee",
    "to reject or substantially amend them:",
    "",
    ...items.filter((b) => b.amt > 0).map((b) => `  • ${b.label} — additional KES ${KES(b.amt)}/month.`),
    "",
    "These proposals will deepen the cost-of-living crisis and",
    "disproportionately affect low and middle-income earners.",
    "",
    "Yours sincerely,",
    "[Your name] · [Constituency]",
  ].join("\n"), [r.total, items, t]);

  const [memoText, setMemoText] = useState(memo);
  useEffect(() => setMemoText(memo), [memo]);

  const toEmail = "publicparticipation@parliament.go.ke";
  const subj = t.civicSubjectVal;

  return (
    <div className="kw" id="top">
      <div className="kw-flagline" />
      <KwNavbar lang={lang} setLang={setLang} t={t} />

      {/* ─── Hero ─── */}
      <section className="kw-hero">
        <div className="kw-hero-mega" aria-hidden="true">26</div>
        <div className="kw-hero-inner">
          <div className="kw-hero-tag">FINANCE BILL 2026 · LIVE TRACKER</div>
          <h1>
            What will the<br />Bill cost <em>you</em>?
          </h1>
          <p className="kw-hero-lead">
            Four questions. One honest number. The exact extra tax that lands in
            your pocket each month — if Parliament passes the Bill as drafted.
          </p>
          <a href="#calc" className="kw-hero-cta">
            <span>Start — 30 seconds</span>
            <span className="arr">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h8M7 2l4 4-4 4"/></svg>
            </span>
          </a>
          <div className="kw-hero-meta">
            <div className="kw-hero-meta-cell">
              <span className="kw-hero-meta-k">Stage</span>
              <span className="kw-hero-meta-v">Second Reading</span>
            </div>
            <div className="kw-hero-meta-cell">
              <span className="kw-hero-meta-k">Public participation closes</span>
              <span className="kw-hero-meta-v">28 May 2026</span>
            </div>
            <div className="kw-hero-meta-cell">
              <span className="kw-hero-meta-k">Calculated this week</span>
              <span className="kw-hero-meta-v">318,402 Kenyans</span>
            </div>
          </div>
        </div>
      </section>

      <div className="kw-flagline fat" />

      {/* ─── Calculator ─── */}
      <section className="kw-sec calc" id="calc">
        <div className="kw-sec-inner">
          <div className="kw-sec-head">
            <div className="kw-sec-tag">01 · Your situation</div>
            <h2 className="kw-sec-title">Tell us four things.</h2>
            <p className="kw-sec-lead">
              Nothing leaves your phone. Answers are anonymous and only used to
              calculate <em>your</em> number.
            </p>
          </div>

          <div className="kw-qgrid">
            <KwQ num={1} total={4} title="Buying a new smartphone this year?" clause="§14 — excise 10% → 25%" active={phone}>
              <KwYesNo value={phone} onChange={setPhone} t={t} tone="red" />
            </KwQ>

            <KwQ num={2} total={4} title="Monthly mitumba budget" clause="§22 — 25% import duty on used clothing" active={mitumba > 0}>
              <KwSlider
                value={mitumba}
                onChange={setMitumba}
                min={0} max={10000} step={100}
                marks={[{ v: 0, label: "0" }, { v: 5000, label: "5K" }, { v: 10000, label: "10K" }]}
              />
            </KwQ>

            <KwQ num={3} total={4} title="Monthly rent paid" clause="§31 — 5% rent withholding" active={rent > 0}>
              <KwSlider
                value={rent}
                onChange={setRent}
                min={0} max={150000} step={500}
                marks={[{ v: 0, label: "0" }, { v: 50000, label: "50K" }, { v: 100000, label: "100K" }, { v: 150000, label: "150K" }]}
              />
            </KwQ>

            <KwQ num={4} total={4} title="Trade in scrap metal?" clause="§47 — 16% VAT, no threshold" active={scrap}>
              <KwYesNo value={scrap} onChange={setScrap} t={t} tone="red" />
            </KwQ>
          </div>
        </div>
      </section>

      <div className="kw-flagline" />

      {/* ─── Result ─── */}
      <section className="kw-sec result" id="result">
        <div className="kw-sec-inner">
          <div className="kw-result-grid">
            <div>
              <div className="kw-result-tag">Total extra monthly tax</div>
              <div className="kw-result-amt">
                <span className="kw-result-cur">KES</span>
                <BigNumber value={r.total} />
              </div>
              <div className="kw-result-yearly">
                ≈ KES {KES(r.total * 12)} per year
              </div>
              <div className="kw-result-tail">
                Estimated from your inputs and the gazetted draft of 30 April 2026.
              </div>
            </div>
            <div className="kw-bkd">
              {items.map((it) => (
                <div key={it.key} className={"kw-bkd-row" + (it.amt === 0 ? " zero" : "")}>
                  <span className="kw-bkd-lbl">{it.label}</span>
                  <span className="kw-bkd-amt">+{KES(it.amt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Receipt ─── */}
      <section className="kw-sec receipt">
        <div className="kw-sec-inner">
          <div className="kw-receipt-stage">
            <div className="kw-receipt-copy">
              <div className="kw-sec-tag">02 · Receipt</div>
              <h2 className="kw-sec-title">Screenshot it.<br />Send it.</h2>
              <p className="kw-sec-lead" style={{ marginTop: 16 }}>
                A receipt of what the Bill takes from you each month. Built to share —
                copy, screenshot, or send straight to WhatsApp.
              </p>
              <div className="kw-receipt-share">
                <a
                  className="kw-btn kw-btn-wa"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `The Finance Bill 2026 will cost me KES ${KES(r.total)}/month (KES ${KES(r.total * 12)}/yr). What about you? ushuru.watch`
                  )}`}
                >
                  <WaIcon /> Share to WhatsApp
                </a>
                <button type="button" className="kw-btn kw-btn-ghost">
                  <DlIcon /> Download
                </button>
              </div>
            </div>
            <KwReceipt items={items} total={r.total} t={t} />
          </div>
        </div>
      </section>

      <div className="kw-flagline" />

      {/* ─── Action ─── */}
      <section className="kw-sec action" id="action">
        <div className="kw-sec-inner">
          <div className="kw-action-grid">
            <div className="kw-action-copy">
              <div className="kw-sec-tag" style={{ color: "rgba(255,255,255,0.6)" }}>03 · Civic action</div>
              <h2>Your move,<br />Mwananchi.</h2>
              <p>
                Under Article 118, every Kenyan can submit views directly to the
                Committee. We've drafted a memorandum with your numbers — review,
                edit, send.
              </p>
              <div className="kw-action-cta">
                <a
                  className="kw-btn kw-btn-cream"
                  href={`mailto:${toEmail}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(memoText)}`}
                >
                  <MailIcon /> Send via Email
                </a>
                <button
                  type="button"
                  className="kw-btn kw-btn-outline-w"
                  onClick={() => navigator.clipboard?.writeText(memoText).catch(() => {})}
                >
                  Copy memo
                </button>
              </div>
            </div>

            <div className="kw-action-panel">
              <div className="kw-action-tag">
                <span>MEMORANDUM · DRAFT</span>
                <span className="kw-action-tag-r">EDITABLE</span>
              </div>
              <div className="kw-action-fields">
                <div className="kw-action-field">
                  <span className="kw-action-field-l">To</span>
                  <span className="kw-action-field-v">{toEmail}</span>
                </div>
                <div className="kw-action-field">
                  <span className="kw-action-field-l">Subject</span>
                  <span className="kw-action-field-v">{subj}</span>
                </div>
              </div>
              <textarea
                className="kw-action-textarea"
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                spellCheck={false}
              />
              <div className="kw-action-foot">
                <span>{(memoText.trim().match(/\S+/g) || []).length} words · auto-saved</span>
                <button type="button" onClick={() => setMemoText(memo)}>Reset to draft</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="kw-flagline fat" />

      {/* ─── Footer ─── */}
      <footer className="kw-footer">
        <div className="kw-footer-inner">
          <div>
            <div className="kw-footer-brand">
              <div className="kw-brand-mark"><KwMark size={18} /></div>
              <div>
                <div className="kw-brand-name" style={{ color: "#fff" }}>Ushuru Watch</div>
                <div className="kw-brand-sub" style={{ marginTop: 4 }}>Finance Bill 2026</div>
              </div>
            </div>
            <p>
              Built by independent volunteers from the Kenyan tech community.
              Open-source. Not affiliated with KRA, the Treasury, or any
              political party. Calculations use the gazetted draft of
              30 April 2026.
            </p>
          </div>
          <div>
            <h4>Bill</h4>
            <ul>
              <li><a href="#">Read the Bill (PDF)</a></li>
              <li><a href="#">Section index</a></li>
              <li><a href="#">Methodology</a></li>
              <li><a href="#">Treasury memo</a></li>
            </ul>
          </div>
          <div>
            <h4>Project</h4>
            <ul>
              <li><a href="#">Source code</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Press kit</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="kw-footer-bottom">
          <span>© 2026 USHURU WATCH · HARAMBEE</span>
          <span>BUILT IN NAIROBI</span>
        </div>
      </footer>

      <KwChat t={t} />
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3.5" width="12" height="9" rx="1.2"/>
      <path d="M2.5 4.5l5.5 4.5 5.5-4.5"/>
    </svg>
  );
}
function WaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5 3.5A11 11 0 003 17l-1 5 5.2-1.4A11 11 0 1020.5 3.5zM12 20a8 8 0 01-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1112 20zm4.5-5.7c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.3-.7.8-.8 1-.1.1-.3.1-.5 0-.2-.1-1-.4-2-1.3-.7-.7-1.2-1.5-1.4-1.7-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.2.2-.4 0-.1 0-.3-.1-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.7 2.7 4.2 3.7.6.3 1 .4 1.4.5.6.2 1.1.2 1.6.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.1-.4-.2z"/>
    </svg>
  );
}
function DlIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v9M4.5 7.5L8 11l3.5-3.5M3 13.5h10"/>
    </svg>
  );
}

window.UshuruAppV2 = UshuruAppV2;
