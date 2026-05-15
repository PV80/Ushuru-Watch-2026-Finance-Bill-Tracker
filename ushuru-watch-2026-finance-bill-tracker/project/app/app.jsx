/* global React, UWLogo, UWNavbar, UWToggle, UWSlider, UWQuestion,
  UWImpact, UWReceipt, UWCivic, UWChat, IconWa, IconArrow, KES, KESnice */

const { useState, useMemo } = React;

// ── Tax model (illustrative; flagged as estimate in UI) ────
// Reasonable, defensible orderings; not legal advice.
function calc(inputs) {
  // Smartphone: §14 raises excise from 10% → 25% on imported handsets.
  // Assume avg phone ~KES 28,000, amortised over 24 months ownership.
  // Extra burden = 15% × 28,000 ÷ 24 ≈ 175 KES/mo. Conservative.
  const phone = inputs.phone ? Math.round((28000 * 0.15) / 24) : 0;

  // Mitumba: 25% import duty on second-hand clothing imports.
  // Assume importers pass through 60% to consumers.
  const mitumba = Math.round(inputs.mitumba * 0.25 * 0.6);

  // Rent: §31 — 5% withholding on residential rent, passed back to tenants
  // via revised lease terms (illustrative pass-through 100%).
  const rent = Math.round(inputs.rent * 0.05);

  // Scrap dealer: §47 mandates 16% VAT registration with no threshold.
  // Estimated compliance + cost-of-goods burden ~KES 6,500/mo for a small dealer.
  const scrap = inputs.scrap ? 6500 : 0;

  return { phone, mitumba, rent, scrap, total: phone + mitumba + rent + scrap };
}

function UshuruApp({ initialLang = "en", mode = "mobile" }) {
  const [lang, setLang] = useState(initialLang);
  const t = window.I18N[lang];

  const [phone, setPhone] = useState(true);
  const [mitumba, setMitumba] = useState(2500);
  const [rent, setRent] = useState(22000);
  const [scrap, setScrap] = useState(false);

  const inputs = { phone, mitumba, rent, scrap };
  const r = useMemo(() => calc(inputs), [phone, mitumba, rent, scrap]);

  const breakdown = [
    { key: "phone", label: t.smartphone, amt: r.phone, qty: phone ? "1" : "0" },
    { key: "mitumba", label: t.mitumba, amt: r.mitumba, qty: KES(mitumba) + " " + t.amt },
    { key: "rent", label: t.rentWh, amt: r.rent, qty: KES(rent) + " " + t.amt },
    { key: "scrap", label: t.scrap, amt: r.scrap, qty: scrap ? "1" : "0" },
  ];
  const total = r.total;

  const isDesktop = mode === "desktop";

  return (
    <div className={"uw-app " + mode} id="top">
      <UWNavbar lang={lang} setLang={setLang} t={t} compact={mode === "mobile"} />

      {/* Hero */}
      <section className="uw-hero">
        <div className="uw-hero-inner">
          <div className="uw-eyebrow">{t.eyebrow}</div>
          <h1 className="uw-h1">{t.heroTitle}</h1>
          <p className="uw-lead">{t.heroLead}</p>
          <div className="uw-hero-meta">
            <span className="uw-pill">
              <span className="uw-pill-dot" /> {t.badgeBill}
            </span>
            <span className="uw-pill ghost">{t.badgeUsers}</span>
          </div>
        </div>
        <FlagBar />
      </section>

      {/* Main grid */}
      <main className={"uw-main " + mode}>
        <div className="uw-col uw-col-left">
          {/* Calculator */}
          <section className="uw-card">
            <header className="uw-card-head">
              <div>
                <div className="uw-eyebrow small">01 · CALCULATOR</div>
                <h2 className="uw-h2">{t.sectionCalc}</h2>
                <p className="uw-card-sub">{t.sectionCalcSub}</p>
              </div>
              <ProgressDots
                total={4}
                filled={
                  (phone ? 1 : 0) + (mitumba > 0 ? 1 : 0) + (rent > 0 ? 1 : 0) + (scrap ? 1 : 0)
                }
              />
            </header>

            <UWQuestion idx={1} title={t.qPhoneT} sub={t.qPhoneS}>
              <UWToggle value={phone} onChange={setPhone} labels={{ yes: t.yes, no: t.no }} />
            </UWQuestion>

            <UWQuestion idx={2} title={t.qMitumbaT} sub={t.qMitumbaS}>
              <UWSlider
                value={mitumba}
                onChange={setMitumba}
                min={0}
                max={10000}
                step={100}
                format={(v) => `KES ${KES(v)} ${t.perMo}`}
                marks={[
                  { v: 0, label: "0" },
                  { v: 5000, label: "5K" },
                  { v: 10000, label: "10K" },
                ]}
              />
            </UWQuestion>

            <UWQuestion idx={3} title={t.qRentT} sub={t.qRentS}>
              <UWSlider
                value={rent}
                onChange={setRent}
                min={0}
                max={150000}
                step={500}
                format={(v) => `KES ${KES(v)} ${t.perMo}`}
                marks={[
                  { v: 0, label: "0" },
                  { v: 50000, label: "50K" },
                  { v: 100000, label: "100K" },
                  { v: 150000, label: "150K" },
                ]}
              />
            </UWQuestion>

            <UWQuestion idx={4} title={t.qScrapT} sub={t.qScrapS}>
              <UWToggle value={scrap} onChange={setScrap} labels={{ yes: t.yes, no: t.no }} />
            </UWQuestion>
          </section>

          {/* Receipt */}
          <section className="uw-card uw-card-receipt">
            <header className="uw-card-head">
              <div>
                <div className="uw-eyebrow small">02 · RECEIPT</div>
                <h2 className="uw-h2">{t.receiptHeading}</h2>
                <p className="uw-card-sub">{t.receiptSubhead}</p>
              </div>
            </header>
            <UWReceipt t={t} items={breakdown} total={total} inputs={inputs} />
            <div className="uw-share">
              <a
                className="uw-btn uw-btn-wa"
                href={`https://wa.me/?text=${encodeURIComponent(
                  `The Finance Bill 2026 will cost me KES ${KES(total)}/month (KES ${KES(
                    total * 12
                  )}/yr). What about you? ushuru.watch`
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <IconWa /> {t.shareWa}
              </a>
              <button className="uw-btn uw-btn-ghost" type="button">
                <DownloadIcon /> {t.download}
              </button>
            </div>
          </section>

          {/* Civic Action */}
          <section className="uw-card">
            <UWCivic t={t} total={total} breakdown={breakdown.filter((b) => b.amt > 0)} />
          </section>

          <Footer t={t} />
        </div>

        {/* Sticky impact (desktop) — right column */}
        {isDesktop && (
          <aside className="uw-col uw-col-right">
            <div className="uw-sticky">
              <UWImpact total={total} t={t} breakdown={breakdown} />
              <BillStatus t={t} />
            </div>
          </aside>
        )}
      </main>

      {/* Sticky bottom impact (mobile) */}
      {!isDesktop && (
        <div className="uw-mobile-impact-wrap">
          <MobileImpactBar total={total} t={t} />
        </div>
      )}

      <UWChat t={t} />
    </div>
  );
}

// ── Mobile sticky impact bar (compact) ──────────────────────
function MobileImpactBar({ total, t }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"uw-mib" + (open ? " open" : "")}>
      <button type="button" className="uw-mib-bar" onClick={() => setOpen((o) => !o)}>
        <div className="uw-mib-text">
          <div className="uw-mib-kicker">{t.impactKicker}</div>
          <div className="uw-mib-amt">
            <span className="uw-mib-cur">KES</span>
            <span className="uw-mib-num">{KES(total)}</span>
            <span className="uw-mib-per">{t.perMo}</span>
          </div>
        </div>
        <div className="uw-mib-chev" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
            <path d={open ? "M3 9l4-4 4 4" : "M3 5l4 4 4-4"} />
          </svg>
        </div>
      </button>
      {open && (
        <div className="uw-mib-panel">
          <div className="uw-mib-yr">≈ {KESnice(total * 12)} {t.perYear}</div>
          <div className="uw-mib-foot">{t.impactSub}</div>
        </div>
      )}
    </div>
  );
}

// ── Bill status timeline (desktop sidebar) ─────────────────
function BillStatus({ t }) {
  const stages = [
    { k: "1st", label: "First Reading", done: true, date: "12 Apr 2026" },
    { k: "2nd", label: "Second Reading", done: true, date: "06 May 2026", active: true },
    { k: "comm", label: "Committee Stage", done: false, date: "20 May 2026" },
    { k: "3rd", label: "Third Reading", done: false, date: "12 Jun 2026" },
    { k: "asst", label: "Presidential Assent", done: false, date: "30 Jun 2026" },
  ];
  return (
    <div className="uw-status">
      <div className="uw-eyebrow small">BILL STATUS · 318 MPs</div>
      <h3 className="uw-h3 tight">Where the Bill stands</h3>
      <ol className="uw-timeline">
        {stages.map((s) => (
          <li key={s.k} className={"uw-tl " + (s.done ? "done " : "") + (s.active ? "active" : "")}>
            <span className="uw-tl-dot" />
            <div className="uw-tl-body">
              <div className="uw-tl-label">{s.label}</div>
              <div className="uw-tl-date">{s.date}</div>
            </div>
          </li>
        ))}
      </ol>
      <div className="uw-status-foot">
        Public participation closes <strong>28 May 2026</strong>. Submissions accepted by email and at Parliament Buildings.
      </div>
    </div>
  );
}

// ── Footer ──────────────────────────────────────────────────
function Footer({ t }) {
  return (
    <footer className="uw-footer">
      <UWLogo size={22} />
      <div className="uw-footer-text">
        <div className="uw-footer-head">{t.footHead}</div>
        <p>{t.footBody}</p>
        <div className="uw-footer-links">
          <a href="#">{t.footLink1}</a>
          <a href="#">{t.footLink2}</a>
          <a href="#">{t.footLink3}</a>
          <a href="#">{t.footLink4}</a>
        </div>
      </div>
    </footer>
  );
}

// ── Misc atoms ──────────────────────────────────────────────
function ProgressDots({ total, filled }) {
  return (
    <div className="uw-dots" aria-label={`${filled} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={"uw-dot" + (i < filled ? " on" : "")} />
      ))}
    </div>
  );
}

function FlagBar() {
  return (
    <div className="uw-flagbar" aria-hidden="true">
      <span className="uw-fb a" />
      <span className="uw-fb b" />
      <span className="uw-fb c" />
      <span className="uw-fb d" />
      <span className="uw-fb e" />
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v9M4.5 7.5L8 11l3.5-3.5M3 13.5h10" />
    </svg>
  );
}

window.UshuruApp = UshuruApp;
