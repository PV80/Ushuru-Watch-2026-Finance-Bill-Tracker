"use client";

import { useMemo } from "react";
import { useCalcStore } from "@/lib/store";
import { useTaxCalculator } from "@/hooks/useTaxCalculator";
import { I18N, type Lang } from "@/lib/i18n";
import { KES } from "@/lib/format";
import {
  BigNumber,
  KwMark,
  KwQ,
  KwReceipt,
  KwSlider,
  KwYesNo,
  WaIcon,
  DlIcon,
  type ReceiptItem,
} from "./primitives";
import KwAction from "./KwAction";
import KwChat from "./KwChat";

function KwNavbar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const isEn = lang === "en";
  const t = I18N[lang];
  return (
    <header className="kw-nav">
      <div className="kw-nav-inner">
        <a className="kw-brand" href="#top">
          <div className="kw-brand-mark">
            <KwMark size={18} />
          </div>
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
            <span
              className="kw-lang-thumb"
              style={{ transform: isEn ? "translateX(0)" : "translateX(44px)" }}
            />
            <span className={"kw-lang-opt" + (isEn ? " on" : "")}>EN</span>
            <span className={"kw-lang-opt" + (!isEn ? " on" : "")}>SW</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default function UshuruApp() {
  const lang = useCalcStore((s) => s.lang);
  const setLang = useCalcStore((s) => s.setLang);
  const phone = useCalcStore((s) => s.phone);
  const setPhone = useCalcStore((s) => s.setPhone);
  const mitumba = useCalcStore((s) => s.mitumba);
  const setMitumba = useCalcStore((s) => s.setMitumba);
  const rent = useCalcStore((s) => s.rent);
  const setRent = useCalcStore((s) => s.setRent);
  const scrapVolume = useCalcStore((s) => s.scrapVolume);
  const setScrapVolume = useCalcStore((s) => s.setScrapVolume);

  const t = I18N[lang];
  const tax = useTaxCalculator();

  const items: ReceiptItem[] = useMemo(
    () => [
      { key: "phone", label: t.itemPhone, amt: tax.phoneTax },
      { key: "mitumba", label: t.itemMitumba, amt: tax.mitumbaTax },
      { key: "rent", label: t.itemRent, amt: tax.rentTax },
      { key: "scrap", label: t.itemScrap, amt: tax.scrapTax },
    ],
    [tax, t]
  );

  const waMsg = t.shareWaMsg
    .replace("%TOTAL%", KES(tax.total))
    .replace("%ANNUAL%", KES(tax.annual));

  return (
    <div className="kw" id="top">
      <div className="kw-flagline" />
      <KwNavbar lang={lang} setLang={setLang} />

      {/* Hero */}
      <section className="kw-hero">
        <div className="kw-hero-mega" aria-hidden="true">
          26
        </div>
        <div className="kw-hero-inner">
          <div className="kw-hero-tag">{t.heroTag}</div>
          <h1>
            {t.heroTitle1}
            <br />
            {t.heroTitle2} <em>{t.heroTitleYou}</em>?
          </h1>
          <p className="kw-hero-lead">{t.heroLead}</p>
          <a href="#calc" className="kw-hero-cta">
            <span>{t.heroCta}</span>
            <span className="arr">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6h8M7 2l4 4-4 4" />
              </svg>
            </span>
          </a>
          <div className="kw-hero-meta">
            <div className="kw-hero-meta-cell">
              <span className="kw-hero-meta-k">{t.heroStageK}</span>
              <span className="kw-hero-meta-v">{t.heroStageV}</span>
            </div>
            <div className="kw-hero-meta-cell">
              <span className="kw-hero-meta-k">{t.heroCloseK}</span>
              <span className="kw-hero-meta-v">{t.heroCloseV}</span>
            </div>
            <div className="kw-hero-meta-cell">
              <span className="kw-hero-meta-k">{t.heroCountK}</span>
              <span className="kw-hero-meta-v">{t.heroCountV}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="kw-flagline fat" />

      {/* Calculator */}
      <section className="kw-sec calc" id="calc">
        <div className="kw-sec-inner">
          <div className="kw-sec-head">
            <div className="kw-sec-tag">{t.calcTag}</div>
            <h2 className="kw-sec-title">{t.calcTitle}</h2>
            <p className="kw-sec-lead">{t.calcLead}</p>
          </div>

          <div className="kw-qgrid">
            <KwQ num={1} total={4} title={t.q1Title} clause={t.q1Clause} active={phone}>
              <KwYesNo value={phone} onChange={setPhone} t={t} tone="red" />
            </KwQ>

            <KwQ num={2} total={4} title={t.q2Title} clause={t.q2Clause} active={mitumba > 0}>
              <KwSlider
                value={mitumba}
                onChange={setMitumba}
                min={0}
                max={10000}
                step={100}
                marks={[
                  { v: 0, label: "0" },
                  { v: 5000, label: "5K" },
                  { v: 10000, label: "10K" },
                ]}
              />
            </KwQ>

            <KwQ num={3} total={4} title={t.q3Title} clause={t.q3Clause} active={rent > 0}>
              <KwSlider
                value={rent}
                onChange={setRent}
                min={0}
                max={150000}
                step={500}
                marks={[
                  { v: 0, label: "0" },
                  { v: 50000, label: "50K" },
                  { v: 100000, label: "100K" },
                  { v: 150000, label: "150K" },
                ]}
              />
            </KwQ>

            <KwQ num={4} total={4} title={t.q4Title} clause={t.q4Clause} active={scrapVolume > 0}>
              <KwSlider
                value={scrapVolume}
                onChange={setScrapVolume}
                min={0}
                max={200000}
                step={5000}
                marks={[
                  { v: 0, label: "0" },
                  { v: 100000, label: "100K" },
                  { v: 200000, label: "200K" },
                ]}
              />
            </KwQ>
          </div>
        </div>
      </section>

      <div className="kw-flagline" />

      {/* Result */}
      <section className="kw-sec result" id="result">
        <div className="kw-sec-inner">
          <div className="kw-result-grid">
            <div>
              <div className="kw-result-tag">{t.resultTag}</div>
              <div className="kw-result-amt">
                <span className="kw-result-cur">KES</span>
                <BigNumber value={tax.total} />
              </div>
              <div className="kw-result-yearly">
                {t.resultYearlyPre}
                {KES(tax.annual)}
                {t.resultYearlyPost}
              </div>
              <div className="kw-result-tail">{t.resultTail}</div>
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

      {/* Receipt */}
      <section className="kw-sec receipt">
        <div className="kw-sec-inner">
          <div className="kw-receipt-stage">
            <div className="kw-receipt-copy">
              <div className="kw-sec-tag">{t.receiptTag}</div>
              <h2 className="kw-sec-title">
                {t.receiptTitle1}
                <br />
                {t.receiptTitle2}
              </h2>
              <p className="kw-sec-lead" style={{ marginTop: 16 }}>
                {t.receiptLead}
              </p>
              <div className="kw-receipt-share">
                <a
                  className="kw-btn kw-btn-wa"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://wa.me/?text=${encodeURIComponent(waMsg)}`}
                >
                  <WaIcon /> {t.shareWa}
                </a>
                <button type="button" className="kw-btn kw-btn-ghost">
                  <DlIcon /> {t.download}
                </button>
              </div>
            </div>
            <KwReceipt items={items} total={tax.total} t={t} />
          </div>
        </div>
      </section>

      <div className="kw-flagline" />

      <KwAction />

      <div className="kw-flagline fat" />

      {/* Footer */}
      <footer className="kw-footer">
        <div className="kw-footer-inner">
          <div>
            <div className="kw-footer-brand">
              <div className="kw-brand-mark">
                <KwMark size={18} />
              </div>
              <div>
                <div className="kw-brand-name" style={{ color: "#fff" }}>
                  {t.brand}
                </div>
                <div className="kw-brand-sub" style={{ marginTop: 4 }}>
                  Finance Bill 2026
                </div>
              </div>
            </div>
            <p>{t.footAbout}</p>
          </div>
          <div>
            <h4>{t.footBillH}</h4>
            <ul>
              <li><a href="#">{t.footBill1}</a></li>
              <li><a href="#">{t.footBill2}</a></li>
              <li><a href="#">{t.footBill3}</a></li>
              <li><a href="#">{t.footBill4}</a></li>
            </ul>
          </div>
          <div>
            <h4>{t.footProjH}</h4>
            <ul>
              <li><a href="#">{t.footProj1}</a></li>
              <li><a href="#">{t.footProj2}</a></li>
              <li><a href="#">{t.footProj3}</a></li>
              <li><a href="#">{t.footProj4}</a></li>
            </ul>
          </div>
        </div>
        <div className="kw-footer-bottom">
          <span>{t.footBottomL}</span>
          <span>{t.footBottomR}</span>
        </div>
      </footer>

      <KwChat t={t} />
    </div>
  );
}
