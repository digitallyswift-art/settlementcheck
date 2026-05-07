# BRAND.md — SettlementCheck Voice and Tone

## Voice in three words
Calm. Clear. On your side.

---

## The reader

An employee who has just received a settlement offer — probably today or this week.
They feel a mix of shock, suspicion, and uncertainty. They do not know if the offer
is fair. They do not know how to find a solicitor. They assume legal help costs money.
They are cautious about anything that feels like a sales pitch.

Your job: give them clear information and let them make an informed decision.
Do not alarm them. Do not patronise them. Do not oversell.

---

## Writing principles

- Write as a knowledgeable colleague, not a legal firm and not a salesperson.
- One idea per sentence. Keep sentences under 20 words where possible. Sentences must be short, to the point, and highly readable for a human.
- Active voice. "Your employer pays your fees" not "Your fees are paid by your employer".
- Plain UK English. Write in a human tone specifically targeting UK demographics.
- Short paragraphs. Two to three sentences maximum per block.
- **Never give legal advice.** State the objective facts (e.g., "Employees must receive independent legal advice..." instead of "You must get a solicitor...").
- Be honest about what the calculator can and cannot tell them.

---

## Layout and Visual Design for Content

- **Never produce a "wall of text."** 
- Whenever pumping out any content, it must be visually appealing and scannable.
- Use bullet points with icons (e.g., checkmarks) where applicable to make actionable steps easy to follow.
- Use custom UI components (callout boxes, side-by-side grids, numbered timelines) to break down complex information.
- Utilise Tailwind tokens (`bg-paper-2`, `border-coral`, `text-ink`) to highlight key metrics and core facts.

---

## UK language — use these

- solicitor (not lawyer or attorney)
- redundancy (not layoff or termination)
- employment tribunal (not labor court)
- statutory (correct UK legal term — use it)
- colour, favour, recognise, organise, licence (noun), authorize
- "find out where you stand" — natural, resonant phrase
- "what you're entitled to" — appropriate and familiar
- "get advice" not "obtain legal counsel"
- "sort this out" — acceptable in CTAs
- "your employer" not "the company" or "your organization"

---

## Never write

- Em dashes — banned entirely. Use a comma, a full stop, or restructure the sentence
- Exclamation marks in body copy. Acceptable sparingly in CTAs only
- Ellipsis (...) in UI copy. Creates unease and uncertainty
- "Don't worry" — patronising
- "We're passionate about" — corporate filler
- "Reach out" — American phrasing
- "Going forward" / "touch base" / "leverage" — jargon
- "Please be advised that" / "It is important to note that" — bureaucratic
- "Low-ball" in user-facing copy (use "below the typical range" instead)
- "Claim" when referring to what an employee might receive (use "settlement" or "amount")
- Two-word filler openers: "Basically,", "Essentially,", "Simply put,"
- Passive constructions: "It has been determined that..." just say what is true

---

## Tone by context

**Homepage:** Factual and calm. State what the tool does. No hype.

**Calculator labels:** Minimal. Label only. No explanatory copy inside the form itself.

**Result — below typical range:** Honest without alarmism. "Your offer may be below
the typical range" not "Your employer is underpaying you." Give them the fact.
Let the solicitor interpret it.

**Result — within range:** Reassuring but not dismissive. Still recommend advice
because every case is different.

**Result — above typical range:** Positive and brief. Still recommend a solicitor
confirms the structure before they sign.

**OTP verification screen:** Functional. Short. One sentence of context.
No enthusiasm. No filler.

**Error states:** Never technical, never blame the user. "We couldn't send that email.
Please check the address and try again." Full stop.

**For Solicitors page:** Straightforward B2B. What leads look like. What it costs.
What the commitment is. No waffle.

---

## Punctuation rules

- Full stops after standalone UI labels: No (button text, field labels)
- Full stops after body sentences: Yes, always
- Commas before "and" in a list of three or more: Yes (Oxford comma)
- Colons to introduce a list: Yes
- Semicolons: Avoid. Use two sentences instead
- Quotation marks: Single quotes in UI, double quotes in body copy
- Apostrophes: Standard UK rules. "Your employer's legal fees."
- Em dashes: Banned. See above.
- En dashes in ranges: Yes. "£350 to £750" is preferred over "£350-£750" in body copy
