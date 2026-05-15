import { useCalcStore } from "@/lib/store";

export interface TaxBreakdown {
  phoneTax: number;
  mitumbaTax: number;
  rentTax: number;
  scrapTax: number;
  total: number;
  annual: number;
}

/**
 * Finance Bill 2026 tax delta — per task spec:
 *   Smartphone: +25% on an assumed 15,000 KES base.
 *   Mitumba:    +5% of monthly spend.
 *   Rent:       +2.5% of monthly rent (the 7.5% → 10% withholding jump).
 *   Scrap:      +1.5% of estimated monthly volume.
 */
export function useTaxCalculator(): TaxBreakdown {
  const phone = useCalcStore((s) => s.phone);
  const mitumba = useCalcStore((s) => s.mitumba);
  const rent = useCalcStore((s) => s.rent);
  const scrapVolume = useCalcStore((s) => s.scrapVolume);

  const phoneTax = phone ? Math.round(15000 * 0.25) : 0;
  const mitumbaTax = Math.round(mitumba * 0.05);
  const rentTax = Math.round(rent * 0.025);
  const scrapTax = Math.round(scrapVolume * 0.015);
  const total = phoneTax + mitumbaTax + rentTax + scrapTax;

  return { phoneTax, mitumbaTax, rentTax, scrapTax, total, annual: total * 12 };
}
