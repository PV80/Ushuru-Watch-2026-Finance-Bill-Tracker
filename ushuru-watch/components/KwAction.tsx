"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCalcStore } from "@/lib/store";
import { useTaxCalculator } from "@/hooks/useTaxCalculator";
import { I18N } from "@/lib/i18n";
import { KES } from "@/lib/format";
import { MailIcon } from "./primitives";

const TO_EMAIL = "cna@parliament.go.ke";

export default function KwAction() {
  const lang = useCalcStore((s) => s.lang);
  const phone = useCalcStore((s) => s.phone);
  const mitumba = useCalcStore((s) => s.mitumba);
  const rent = useCalcStore((s) => s.rent);
  const scrapVolume = useCalcStore((s) => s.scrapVolume);
  const tax = useTaxCalculator();
  const t = I18N[lang];

  const fallbackMemo = useMemo(
    () => t.memoFallback(KES(tax.total), KES(tax.annual), t.civicSubjectVal),
    [tax.total, tax.annual, t]
  );

  const [memo, setMemo] = useState<string>(fallbackMemo);
  const [concerns, setConcerns] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inflight = useRef<AbortController | null>(null);

  useEffect(() => {
    setMemo(fallbackMemo);
  }, [fallbackMemo]);

  const draftMemo = useCallback(async () => {
    inflight.current?.abort();
    const ctrl = new AbortController();
    inflight.current = ctrl;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/draft-memo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          phone,
          mitumba,
          rent,
          scrapVolume,
          phoneTax: tax.phoneTax,
          mitumbaTax: tax.mitumbaTax,
          rentTax: tax.rentTax,
          scrapTax: tax.scrapTax,
          total: tax.total,
          annual: tax.annual,
          lang,
          concerns,
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Request failed (${res.status})`);
      }
      const { memo: drafted } = (await res.json()) as { memo: string };
      setMemo(drafted);
    } catch (e: unknown) {
      if ((e as { name?: string })?.name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Could not draft memo");
    } finally {
      setLoading(false);
    }
  }, [phone, mitumba, rent, scrapVolume, tax.phoneTax, tax.mitumbaTax, tax.rentTax, tax.scrapTax, tax.total, tax.annual, lang, concerns]);

  const subj = t.civicSubjectVal;
  const mailto = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(memo)}`;
  const wordCount = (memo.trim().match(/\S+/g) || []).length;

  return (
    <section className="kw-sec action" id="action">
      <div className="kw-sec-inner">
        <div className="kw-action-grid">
          <div className="kw-action-copy">
            <div className="kw-sec-tag" style={{ color: "rgba(255,255,255,0.6)" }}>
              {t.actionTag}
            </div>
            <h2>
              {t.actionTitle1}
              <br />
              {t.actionTitle2}
            </h2>
            <p>{t.actionLead}</p>

            <label
              style={{
                display: "block",
                marginTop: 24,
                marginBottom: 8,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              {t.concernsLabel}
            </label>
            <textarea
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              placeholder={t.concernsPlaceholder}
              spellCheck={false}
              rows={5}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 8,
                color: "#fff",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                lineHeight: 1.55,
                resize: "vertical",
                outline: "none",
              }}
            />
            <p
              style={{
                marginTop: 8,
                fontSize: 12,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {t.concernsHelp}
            </p>

            <div className="kw-action-cta" style={{ marginTop: 20 }}>
              <button
                type="button"
                className="kw-btn kw-btn-cream"
                onClick={draftMemo}
                disabled={loading}
              >
                {loading ? t.drafting : t.draftMemoBtn}
              </button>
              <a className="kw-btn kw-btn-outline-w" href={mailto}>
                <MailIcon /> {t.sendEmail}
              </a>
              <button
                type="button"
                className="kw-btn kw-btn-outline-w"
                onClick={() => {
                  navigator.clipboard?.writeText(memo).catch(() => {});
                }}
              >
                {t.copyMemo}
              </button>
            </div>
            {error && (
              <p style={{ marginTop: 12, color: "#ffd1d1", fontSize: 13 }}>
                {error}. {t.apiErrorHint}
              </p>
            )}
          </div>

          <div className="kw-action-panel">
            <div className="kw-action-tag">
              <span>{t.memoTagL}</span>
              <span className="kw-action-tag-r">{t.memoTagR}</span>
            </div>
            <div className="kw-action-fields">
              <div className="kw-action-field">
                <span className="kw-action-field-l">{t.toLabel}</span>
                <span className="kw-action-field-v">{TO_EMAIL}</span>
              </div>
              <div className="kw-action-field">
                <span className="kw-action-field-l">{t.subjectLabel}</span>
                <span className="kw-action-field-v">{subj}</span>
              </div>
            </div>
            <textarea
              className="kw-action-textarea"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              spellCheck={false}
            />
            <div className="kw-action-foot">
              <span>
                {wordCount} {t.words} · {loading ? t.drafting : t.autoSaved}
              </span>
              <button type="button" onClick={() => setMemo(fallbackMemo)}>
                {t.resetDraft}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
