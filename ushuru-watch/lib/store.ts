import { create } from "zustand";
import type { Lang } from "./i18n";

export interface CalcState {
  phone: boolean;
  mitumba: number;
  rent: number;
  scrapVolume: number;
  lang: Lang;
  setPhone: (v: boolean) => void;
  setMitumba: (v: number) => void;
  setRent: (v: number) => void;
  setScrapVolume: (v: number) => void;
  setLang: (v: Lang) => void;
}

export const useCalcStore = create<CalcState>((set) => ({
  phone: true,
  mitumba: 2500,
  rent: 22000,
  scrapVolume: 0,
  lang: "en",
  setPhone: (v) => set({ phone: v }),
  setMitumba: (v) => set({ mitumba: v }),
  setRent: (v) => set({ rent: v }),
  setScrapVolume: (v) => set({ scrapVolume: v }),
  setLang: (v) => set({ lang: v }),
}));
