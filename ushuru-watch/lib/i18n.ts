export type Lang = "en" | "sw";

export interface I18NStrings {
  locale: string;
  other: string;
  brand: string;
  brandSub: string;
  yes: string;
  no: string;
  perMo: string;
  dispLost: string;
  civicSubjectVal: string;

  // Hero
  heroTag: string;
  heroTitle1: string;
  heroTitle2: string;
  heroTitleYou: string;
  heroLead: string;
  heroCta: string;
  heroStageK: string;
  heroStageV: string;
  heroCloseK: string;
  heroCloseV: string;
  heroCountK: string;
  heroCountV: string;

  // Calculator
  calcTag: string;
  calcTitle: string;
  calcLead: string;
  q1Title: string;
  q1Clause: string;
  q2Title: string;
  q2Clause: string;
  q3Title: string;
  q3Clause: string;
  q4Title: string;
  q4Clause: string;

  // Receipt items
  itemPhone: string;
  itemMitumba: string;
  itemRent: string;
  itemScrap: string;

  // Result
  resultTag: string;
  resultYearlyPre: string;
  resultYearlyPost: string;
  resultTail: string;

  // Receipt section
  receiptTag: string;
  receiptTitle1: string;
  receiptTitle2: string;
  receiptLead: string;
  shareWa: string;
  shareWaMsg: string; // template — uses %TOTAL% / %ANNUAL%
  download: string;
  receiptTotalLine: string;

  // Action / memo
  actionTag: string;
  actionTitle1: string;
  actionTitle2: string;
  actionLead: string;
  draftMemoBtn: string;
  drafting: string;
  concernsLabel: string;
  concernsHelp: string;
  concernsPlaceholder: string;
  sendEmail: string;
  copyMemo: string;
  memoTagL: string;
  memoTagR: string;
  toLabel: string;
  subjectLabel: string;
  words: string;
  autoSaved: string;
  resetDraft: string;
  memoFallback: (totalKes: string, annualKes: string, subj: string) => string;
  apiErrorHint: string;

  // Footer
  footAbout: string;
  footBillH: string;
  footProjH: string;
  footLinks: { label: string; href: string; external?: boolean }[];
  footProjLinks: { label: string; href: string; external?: boolean }[];
  footBottomL: string;
  footBottomR: string;

  // Chat
  chatTitle: string;
  chatSubtitle: string;
  chatPlaceholder: string;
  chatGreeting: string;
  chatSuggestQ1: string;
  chatSuggestQ2: string;
  chatSuggestQ3: string;
  chatError: string;
}

const memoFallbackEn = (totalKes: string, annualKes: string, subj: string) =>
  [
    "To the Clerk of the National Assembly",
    "Parliament Buildings, Nairobi",
    "",
    `Re: ${subj}`,
    "",
    "Honourable Members,",
    "",
    "I write under Article 118 of the Constitution to submit views on the",
    "Finance Bill, 2026. Based on the gazetted draft, my personal monthly",
    `tax burden will increase by KES ${totalKes} — approximately`,
    `KES ${annualKes} per year.`,
    "",
    "Click “Draft Memorandum” below to generate a personalised legal",
    "objection drafted in formal parliamentary language.",
    "",
    "[Your name] · [Constituency]",
  ].join("\n");

const memoFallbackSw = (totalKes: string, annualKes: string, subj: string) =>
  [
    "Kwa Karani wa Bunge la Taifa",
    "Majengo ya Bunge, Nairobi",
    "",
    `Kuh: ${subj}`,
    "",
    "Waheshimiwa Wabunge,",
    "",
    "Naandika kwa mujibu wa Kifungu cha 118 cha Katiba kuwasilisha maoni",
    "kuhusu Mswada wa Fedha, 2026. Kwa msingi wa rasimu iliyochapishwa,",
    `mzigo wangu wa kodi ya kila mwezi utaongezeka kwa KES ${totalKes} —`,
    `takriban KES ${annualKes} kwa mwaka.`,
    "",
    "Bofya “Andika Kumbukumbu” hapa chini ili kutengeneza pingamizi",
    "rasmi la kisheria lililoandaliwa kwa lugha ya kibunge.",
    "",
    "[Jina lako] · [Eneo Bunge]",
  ].join("\n");

export const I18N: Record<Lang, I18NStrings> = {
  en: {
    locale: "EN",
    other: "SW",
    brand: "Ushuru Watch",
    brandSub: "Finance Bill 2026 · Personal Impact",
    yes: "Yes",
    no: "No",
    perMo: "/ month",
    dispLost: "Disposable income lost",
    civicSubjectVal:
      "Memorandum on the Finance Bill, 2026 — Submitted under Article 118",

    heroTag: "FINANCE BILL 2026 · LIVE TRACKER",
    heroTitle1: "What will the",
    heroTitle2: "Bill cost",
    heroTitleYou: "you",
    heroLead:
      "Four questions. One honest number. The exact extra tax that lands in your pocket each month — if Parliament passes the Bill as drafted.",
    heroCta: "Start — 30 seconds",
    heroStageK: "Stage",
    heroStageV: "Second Reading",
    heroCloseK: "Public participation closes",
    heroCloseV: "28 May 2026",
    heroCountK: "Calculated this week",
    heroCountV: "318,402 Kenyans",

    calcTag: "01 · Your situation",
    calcTitle: "Tell us four things.",
    calcLead:
      "Nothing leaves your phone. Answers are anonymous and only used to calculate your number.",
    q1Title: "Buying a new smartphone this year?",
    q1Clause: "§14 — 25% excise on a 15,000 KES handset",
    q2Title: "Monthly mitumba budget",
    q2Clause: "§22 — 5% import duty on used clothing",
    q3Title: "Monthly rent paid",
    q3Clause: "§31 — rent withholding rises 7.5% → 10%",
    q4Title: "Monthly scrap-metal volume",
    q4Clause: "§47 — 1.5% VAT on scrap throughput",

    itemPhone: "New smartphone (§14)",
    itemMitumba: "Mitumba duty (§22)",
    itemRent: "Rent withholding (§31)",
    itemScrap: "Scrap VAT (§47)",

    resultTag: "Total extra monthly tax",
    resultYearlyPre: "≈ KES ",
    resultYearlyPost: " per year",
    resultTail: "Estimated from your inputs and the gazetted draft of 30 April 2026.",

    receiptTag: "02 · Receipt",
    receiptTitle1: "Screenshot it.",
    receiptTitle2: "Send it.",
    receiptLead:
      "A receipt of what the Bill takes from you each month. Built to share — copy, screenshot, or send straight to WhatsApp.",
    shareWa: "Share to WhatsApp",
    shareWaMsg:
      "The Finance Bill 2026 will cost me KES %TOTAL%/month (KES %ANNUAL%/yr). What about you? ushuru.watch",
    download: "Download",
    receiptTotalLine: "= KES %ANNUAL% per year",

    actionTag: "03 · Civic action",
    actionTitle1: "Your move,",
    actionTitle2: "Mwananchi.",
    actionLead:
      "Under Article 118, every Kenyan can submit views directly to the Clerk of the National Assembly. Click \"Draft Memorandum\" to have our AI legal scholar prepare a formal objection grounded in your personal numbers — review, edit, send.",
    draftMemoBtn: "Draft Memorandum",
    drafting: "Drafting…",
    concernsLabel: "Your concerns (in your own words)",
    concernsHelp:
      "Write what worries you — how the Bill hits your wallet, your family, your business, or the country. The AI will rewrite this into the formal parliamentary format required for Article 118 submissions. English or Kiswahili — type as you speak.",
    concernsPlaceholder:
      "e.g. The rent withholding hike will force my landlord to raise my rent by KES 1,000. I already cut back on chai for my kids. The Bill also kills small mitumba traders in my estate — three closed last month.",
    sendEmail: "Send via Email",
    copyMemo: "Copy memo",
    memoTagL: "MEMORANDUM · DRAFT",
    memoTagR: "EDITABLE",
    toLabel: "To",
    subjectLabel: "Subject",
    words: "words",
    autoSaved: "auto-saved",
    resetDraft: "Reset to draft",
    memoFallback: memoFallbackEn,
    apiErrorHint: "Set ANTHROPIC_API_KEY and try again.",

    footAbout:
      "Built by independent volunteers from the Kenyan tech community. Open-source. Not affiliated with KRA, the Treasury, or any political party. Calculations use the gazetted draft of 30 April 2026.",
    footBillH: "Bill",
    footProjH: "Project",
    footLinks: [
      { label: "Read the Bill (PDF)", href: "/Finance-Bill-2026.pdf", external: true },
      { label: "Section index", href: "#calc" },
      { label: "Parliament of Kenya", href: "http://www.parliament.go.ke", external: true },
      { label: "The National Treasury", href: "https://www.treasury.go.ke", external: true },
    ],
    footProjLinks: [
      { label: "Source code", href: "https://github.com/PV80/Ushuru-Watch-2026-Finance-Bill-Tracker", external: true },
      { label: "Kenya Revenue Authority", href: "https://www.kra.go.ke", external: true },
      { label: "Kenya Law", href: "http://kenyalaw.org", external: true },
      { label: "Contact the Clerk", href: "mailto:cna@parliament.go.ke", external: true },
    ],
    footBottomL: "© 2026 USHURU WATCH · HARAMBEE",
    footBottomR: "BUILT IN NAIROBI",

    chatTitle: "Ask the Bill",
    chatSubtitle: "Beta · answers cite the section.",
    chatPlaceholder: "e.g. Does this affect bodaboda riders?",
    chatGreeting:
      "Habari. I'm trained on the Finance Bill 2026. Ask me anything — I'll cite the section.",
    chatSuggestQ1: "What's new for boda riders?",
    chatSuggestQ2: "Will fuel get more expensive?",
    chatSuggestQ3: "How does VAT on bread change?",
    chatError: "Couldn't reach the API.",
  },

  sw: {
    locale: "SW",
    other: "EN",
    brand: "Ushuru Watch",
    brandSub: "Mswada wa Fedha 2026 · Athari Yako",
    yes: "Ndio",
    no: "La",
    perMo: "/ mwezi",
    dispLost: "Mapato yaliyopotea",
    civicSubjectVal:
      "Kumbukumbu kuhusu Mswada wa Fedha, 2026 — Kwa mujibu wa Kifungu cha 118",

    heroTag: "MSWADA WA FEDHA 2026 · UFUATILIAJI WA MOJA KWA MOJA",
    heroTitle1: "Mswada huu",
    heroTitle2: "utakugharimu",
    heroTitleYou: "wewe",
    heroLead:
      "Maswali manne. Jibu moja la ukweli. Kodi ya ziada utakayolipa kila mwezi — iwapo Bunge litapitisha Mswada kama ulivyoandikwa.",
    heroCta: "Anza — sekunde 30",
    heroStageK: "Hatua",
    heroStageV: "Usomaji wa Pili",
    heroCloseK: "Ushirikishwaji wa umma unafungwa",
    heroCloseV: "28 Mei 2026",
    heroCountK: "Wamekipima wiki hii",
    heroCountV: "Wakenya 318,402",

    calcTag: "01 · Hali yako",
    calcTitle: "Tuambie mambo manne.",
    calcLead:
      "Hakuna kinachotoka kwenye simu yako. Majibu ni ya siri na hutumiwa tu kukokotoa nambari yako.",
    q1Title: "Unanunua simu mpya mwaka huu?",
    q1Clause: "§14 — ushuru wa 25% kwa simu ya KES 15,000",
    q2Title: "Bajeti ya mitumba kwa mwezi",
    q2Clause: "§22 — ushuru wa 5% wa kuingiza nguo za mitumba",
    q3Title: "Kodi ya nyumba kwa mwezi",
    q3Clause: "§31 — kuzuiliwa kwa kodi kunaongezeka 7.5% → 10%",
    q4Title: "Kiasi cha chuma chakavu kwa mwezi",
    q4Clause: "§47 — VAT ya 1.5% kwa biashara ya chuma chakavu",

    itemPhone: "Simu mpya (§14)",
    itemMitumba: "Ushuru wa mitumba (§22)",
    itemRent: "Kuzuiliwa kwa kodi ya nyumba (§31)",
    itemScrap: "VAT ya chuma chakavu (§47)",

    resultTag: "Jumla ya kodi ya ziada kwa mwezi",
    resultYearlyPre: "≈ KES ",
    resultYearlyPost: " kwa mwaka",
    resultTail: "Kadirio kutoka kwa taarifa zako na rasimu iliyochapishwa tarehe 30 Aprili 2026.",

    receiptTag: "02 · Risiti",
    receiptTitle1: "Piga picha.",
    receiptTitle2: "Tuma.",
    receiptLead:
      "Risiti ya kile Mswada unakuondolea kila mwezi. Imetengenezwa kushirikishwa — nakili, piga picha, au tuma moja kwa moja WhatsApp.",
    shareWa: "Shiriki kwenye WhatsApp",
    shareWaMsg:
      "Mswada wa Fedha 2026 utanigharimu KES %TOTAL%/mwezi (KES %ANNUAL%/mwaka). Wewe je? ushuru.watch",
    download: "Pakua",
    receiptTotalLine: "= KES %ANNUAL% kwa mwaka",

    actionTag: "03 · Hatua ya kiraia",
    actionTitle1: "Hatua yako,",
    actionTitle2: "Mwananchi.",
    actionLead:
      "Kwa mujibu wa Kifungu cha 118, kila Mkenya anaweza kuwasilisha maoni moja kwa moja kwa Karani wa Bunge la Taifa. Bofya \"Andika Kumbukumbu\" ili msomi wetu wa kisheria wa AI atengeneze pingamizi rasmi linaloegemea kwenye takwimu zako binafsi — kagua, hariri, tuma.",
    draftMemoBtn: "Andika Kumbukumbu",
    drafting: "Inaandika…",
    concernsLabel: "Wasiwasi wako (kwa maneno yako mwenyewe)",
    concernsHelp:
      "Andika kinachokusumbua — jinsi Mswada unavyoathiri mfuko wako, familia yako, biashara yako, au taifa. AI itabadilisha haya kuwa muundo rasmi wa kibunge unaohitajika kwa mawasilisho ya Kifungu cha 118. Kiingereza au Kiswahili — andika kama unavyozungumza.",
    concernsPlaceholder:
      "k.m. Ongezeko la kuzuiliwa kwa kodi litamlazimisha mwenye nyumba kupandisha kodi yangu kwa KES 1,000. Tayari nimepunguza chai kwa watoto. Mswada pia unaua wafanyabiashara wadogo wa mitumba katika mtaa wangu — watatu walifunga mwezi uliopita.",
    sendEmail: "Tuma kupitia Barua Pepe",
    copyMemo: "Nakili kumbukumbu",
    memoTagL: "KUMBUKUMBU · RASIMU",
    memoTagR: "INAYOHARIRIKA",
    toLabel: "Kwa",
    subjectLabel: "Kichwa",
    words: "maneno",
    autoSaved: "imehifadhiwa kiotomatiki",
    resetDraft: "Rudisha rasimu",
    memoFallback: memoFallbackSw,
    apiErrorHint: "Weka ANTHROPIC_API_KEY na ujaribu tena.",

    footAbout:
      "Imejengwa na wajitolea kutoka jamii ya teknolojia ya Kenya. Chanzo wazi. Hakihusiani na KRA, Hazina, au chama chochote cha kisiasa. Hesabu zinatumia rasimu iliyochapishwa tarehe 30 Aprili 2026.",
    footBillH: "Mswada",
    footProjH: "Mradi",
    footLinks: [
      { label: "Soma Mswada (PDF)", href: "/Finance-Bill-2026.pdf", external: true },
      { label: "Faharasa ya vifungu", href: "#calc" },
      { label: "Bunge la Kenya", href: "http://www.parliament.go.ke", external: true },
      { label: "Hazina ya Taifa", href: "https://www.treasury.go.ke", external: true },
    ],
    footProjLinks: [
      { label: "Msimbo wa chanzo", href: "https://github.com/PV80/Ushuru-Watch-2026-Finance-Bill-Tracker", external: true },
      { label: "Mamlaka ya Mapato Kenya", href: "https://www.kra.go.ke", external: true },
      { label: "Sheria za Kenya", href: "http://kenyalaw.org", external: true },
      { label: "Wasiliana na Karani", href: "mailto:cna@parliament.go.ke", external: true },
    ],
    footBottomL: "© 2026 USHURU WATCH · HARAMBEE",
    footBottomR: "IMEJENGWA NAIROBI",

    chatTitle: "Uliza Mswada",
    chatSubtitle: "Beta · majibu yanataja kifungu.",
    chatPlaceholder: "k.m. Je, inawagusa madereva wa boda?",
    chatGreeting:
      "Habari. Nimefunzwa Mswada wa Fedha 2026. Niulize chochote — nitataja kifungu.",
    chatSuggestQ1: "Nini kipya kwa boda?",
    chatSuggestQ2: "Mafuta yataongezeka bei?",
    chatSuggestQ3: "VAT ya mkate inabadilikaje?",
    chatError: "Imeshindikana kufikia API.",
  },
};
