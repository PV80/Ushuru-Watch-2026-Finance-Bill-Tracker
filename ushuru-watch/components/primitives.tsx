"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { KES } from "@/lib/format";
import type { I18NStrings } from "@/lib/i18n";

export function KwMark({ size = 18, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4h11l3 4v12H5z" fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <g stroke={color} strokeLinecap="round" strokeWidth="1.5">
        <line x1="8" y1="10" x2="15" y2="10" />
        <line x1="8" y1="13" x2="13" y2="13" />
        <line x1="8" y1="16" x2="14" y2="16" />
      </g>
    </svg>
  );
}

export function BigNumber({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const raf = useRef<number | null>(null);
  const prev = useRef(value);
  useEffect(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    const from = prev.current;
    const to = value;
    const dur = 380;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(from + (to - from) * e));
      if (p < 1) raf.current = requestAnimationFrame(step);
      else prev.current = to;
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value]);
  return <span className="kw-result-num">{KES(shown)}</span>;
}

export function KwYesNo({
  value,
  onChange,
  t,
  tone = "red",
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  t: I18NStrings;
  tone?: string;
}) {
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

export function KwSlider({
  value,
  onChange,
  min,
  max,
  step,
  marks,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  marks?: { v: number; label: string }[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const pct = ((value - min) / (max - min)) * 100;
  const setFromClient = (clientX: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    let v = min + ((clientX - r.left) / r.width) * (max - min);
    v = Math.round(v / step) * step;
    v = Math.max(min, Math.min(max, v));
    onChange(v);
  };
  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setFromClient(e.clientX);
    const move = (ev: PointerEvent) => setFromClient(ev.clientX);
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

export function KwQ({
  num,
  total,
  title,
  clause,
  active,
  children,
}: {
  num: number;
  total: number;
  title: string;
  clause?: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={"kw-qcard" + (active ? " active" : "")}>
      <div className="kw-qcard-num">
        Q{String(num).padStart(2, "0")}{" "}
        <span style={{ opacity: 0.4 }}> / {String(total).padStart(2, "0")}</span>
      </div>
      <div className="kw-qcard-title">{title}</div>
      {clause && <div className="kw-qcard-clause">FINANCE BILL 2026 · {clause}</div>}
      <div className="kw-qcard-body">{children}</div>
    </div>
  );
}

export function Zigzag({ bottom }: { bottom?: boolean }) {
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

export interface ReceiptItem {
  key: string;
  label: string;
  amt: number;
}

export function KwReceipt({
  items,
  total,
  t,
}: {
  items: ReceiptItem[];
  total: number;
  t: I18NStrings;
}) {
  const today = new Date().toLocaleDateString("en-GB");
  const txn = "FB26-" + (1000 + Math.floor(total)).toString();
  const bars = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < txn.length; i++) seed = (seed * 31 + txn.charCodeAt(i)) >>> 0;
    const out: number[] = [];
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
          <span className="lbl">{t.dispLost}</span>
          <span className="val">KES {KES(total)}</span>
          <span className="yr">
            {t.receiptTotalLine.replace("%ANNUAL%", KES(total * 12))}
          </span>
        </div>
        <div className="kw-r-barcode">
          <div className="kw-barcode">
            {bars.map((bw, i) => (
              <span key={i} className="kw-bar" style={{ width: bw + "px" }} />
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

export function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3.5" width="12" height="9" rx="1.2" />
      <path d="M2.5 4.5l5.5 4.5 5.5-4.5" />
    </svg>
  );
}

export function WaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5 3.5A11 11 0 003 17l-1 5 5.2-1.4A11 11 0 1020.5 3.5zM12 20a8 8 0 01-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1112 20zm4.5-5.7c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.3-.7.8-.8 1-.1.1-.3.1-.5 0-.2-.1-1-.4-2-1.3-.7-.7-1.2-1.5-1.4-1.7-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.2.2-.4 0-.1 0-.3-.1-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.7 2.7 4.2 3.7.6.3 1 .4 1.4.5.6.2 1.1.2 1.6.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.1-.4-.2z" />
    </svg>
  );
}

export function DlIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v9M4.5 7.5L8 11l3.5-3.5M3 13.5h10" />
    </svg>
  );
}
