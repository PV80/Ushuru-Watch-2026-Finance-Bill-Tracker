import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { z } from "zod";
import { MEMO_SYSTEM } from "@/lib/prompts";

export const maxDuration = 60;

const bodySchema = z.object({
  phone: z.boolean(),
  mitumba: z.number().min(0).max(10_000_000),
  rent: z.number().min(0).max(10_000_000),
  scrapVolume: z.number().min(0).max(10_000_000),
  phoneTax: z.number(),
  mitumbaTax: z.number(),
  rentTax: z.number(),
  scrapTax: z.number(),
  total: z.number(),
  annual: z.number(),
  lang: z.enum(["en", "sw"]),
  concerns: z.string().max(4000).optional().default(""),
});

export async function POST(req: Request) {
  let body;
  try {
    body = bodySchema.parse(await req.json());
  } catch (e) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Hidden personalization context appended to the system prompt — the user
  // never sees these lines, but they steer the AI to write a memo that
  // names the citizen's specific financial impact and addresses the personal
  // concerns the petitioner typed in plain language.
  const concernsBlock = body.concerns.trim()
    ? `

== PETITIONER'S CONCERNS (RAW INPUT — TRANSLATE INTO FORMAL PARLIAMENTARY REGISTER) ==
The petitioner has written the following concerns in their own words. You MUST:
  - Weave each concern into the memorandum as a distinct numbered paragraph of objection.
  - Where the concern matches a specific clause of the Finance Bill, 2026, cite that clause.
  - Translate informal phrasing into formal parliamentary language; preserve the substantive
    grievance but elevate the register. Never quote the petitioner's raw words verbatim.
  - If a concern is unclear or off-topic relative to the Bill, integrate it sensibly or
    omit it — do not fabricate a justification.

PETITIONER'S WORDS:
${body.concerns.trim()}
== END PETITIONER'S CONCERNS ==`
    : "";

  const personalContext = `

== PETITIONER'S CALCULATOR DATA (CONFIDENTIAL — DO NOT QUOTE VERBATIM) ==
Use these figures to ground the memorandum in concrete personal evidence.
Reference each affected clause only if the corresponding figure is non-zero.

- Buying a new smartphone this year: ${body.phone ? "YES" : "NO"}
    → Additional excise (Clause 14, smartphone): KES ${body.phoneTax}/month
- Monthly mitumba expenditure: KES ${body.mitumba}
    → Additional import duty (Clause 22, mitumba): KES ${body.mitumbaTax}/month
- Monthly residential rent: KES ${body.rent}
    → Additional withholding (Clause 31, rent — 7.5% → 10%): KES ${body.rentTax}/month
- Monthly scrap-metal volume: KES ${body.scrapVolume}
    → Additional VAT burden (Clause 47, scrap): KES ${body.scrapTax}/month

TOTAL ADDITIONAL MONTHLY TAX BURDEN: KES ${body.total}
TOTAL ADDITIONAL ANNUAL TAX BURDEN:  KES ${body.annual}

Language for the memorandum: ${body.lang === "sw" ? "Kiswahili (formal parliamentary register)" : "English (formal parliamentary register)"}
== END PETITIONER DATA ==${concernsBlock}`;

  try {
    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-5"),
      system: MEMO_SYSTEM + personalContext,
      prompt:
        "Draft the memorandum now in accordance with the conventions above. Output the memorandum body only — plain text, no markdown, no preamble.",
      temperature: 0.4,
    });

    return Response.json({ memo: text });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
