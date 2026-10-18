# SettlementCheck — Brand Voice & Editorial Standards

This rule is strictly binding across all user-facing copy, code comments, and content generation.

## 1. Voice in Three Words
**Calm. Clear. On your side.**

The reader is an employee who has just received a settlement agreement or redundancy notice today. They are in shock, suspicious of sales pitches, and assume legal help costs thousands of pounds. Your job is to give them clarity and let them decide. Never alarm, never patronize, never oversell.

---

## 2. Strict Linguistic Non-Negotiables

1. **Zero Em Dashes (`—`)**:
   - **Banned everywhere**. Never use em dashes. Use hyphens with spaces (` - `), commas, or restructure into separate, crisp sentences.
2. **Plain UK English**:
   - "Solicitor" (never lawyer, attorney, counsel).
   - "Redundancy" (never layoff).
   - "Employment tribunal" (never labour court, labor court, court).
   - "Settlement agreement" (never severance package).
   - "Your employer" (never "the company" or "your organization").
   - UK spellings: colour, favour, recognise, organise, licence (noun).
   - Natural UK phrases: "find out where you stand", "what you're entitled to", "get advice", "sort this out".
3. **Legal Fee Reassurance**:
   - Whenever mentioning independent legal advice, always state:
     **"Your employer covers the legal fees"** (typically £500 to £1,500 + VAT under Section 203 ERA 1996).
4. **Banned Buzzwords & Corporate Clichés**:
   - Never write: *"don't worry"*, *"reach out"*, *"touch base"*, *"leverage"*, *"essentially"*, *"basically"*, *"navigating the complexities"*, *"tapestry"*, *"delve"*, *"please be advised"*, *"going forward"*, *"we're passionate about"*.
   - Never use *"low-ball"* in user-facing copy (use *"below the typical range"*).
   - Never use *"claim"* for what an employee receives in a settlement (use *"settlement"* or *"amount"*).
   - No ellipsis (`...`) in UI copy (creates unease and uncertainty).
   - No exclamation marks in body copy (acceptable sparingly in CTAs only).
5. **Zero Prompt / CRO Meta-Jargon**:
   - Never expose developer, CRO, or copy-framework terminology in user-facing copy (e.g., *"Attention Economy"*, *"Diagnostic"*, *"Existential Vacuum"*, *"Cognitive Relief"*, *"Framework"*, *"Fast-Path"*).
   - Use natural, plain English (e.g., "Find your calculator", "Quick check", "Check your offer").
6. **Sentence Economy**:
   - Aim for under 20 words per sentence.
   - Maximum 2 to 3 sentences per paragraph block.
7. **Legal Boundary**:
   - **Never provide legal advice**. Present objective statutory calculations and commercial ranges. Independent advice is reserved for SRA-regulated solicitors.

---

## 3. Cognitive Load & Attention Principles

- **Intent-Matched First Screen**:
  - On calculator and tool routes, place the interactive inputs above the fold.
  - On informational guides, place the Answer-First summary box (40 to 60 words) above the fold, followed immediately by an inline interactive tool.
- **Zero Gating**: Always display the statutory calculation, tax split, and fairness verdict freely without requiring an email address or telephone number.
- **Progressive Disclosure**: Deliver the high-level verdict immediately. Provide granular statutory breakdowns and tax mechanics as the user scrolls or interacts.
- **Active State Persistence**: Never ask a user to re-enter data they have already provided in an earlier tool or widget. Carry parameters forward via URL search params.
- **Content Scannability**: Never produce a "wall of text." Break content up with bullet points, structured comparison tables, and visual callouts.

---

## 4. Tone by Context

- **Homepage**: Factual and calm. State what the tool does. Zero hype.
- **Calculator Labels**: Minimal. Label only. No explanatory copy inside the form itself.
- **Result (Below Typical Range)**: Honest without alarmism. *"Your offer may be below the typical range"* (not *"Your employer is underpaying you"*). Give the facts; let the solicitor interpret them.
- **Result (Within Typical Range)**: Reassuring but not dismissive. Still recommend independent advice because every case is unique.
- **Result (Above Typical Range)**: Positive and brief. Still recommend a solicitor confirms the structure and tax indemnities before signing.
- **OTP Verification Screen**: Functional and concise. One sentence of context. Zero enthusiasm or filler.
- **Error States**: Never technical, never blame the user. *"We couldn't send that email. Please check the address and try again."* Full stop.
- **For Solicitors Page**: Straightforward B2B. What leads look like, lead qualification rules, pricing, and panel commitments.

---

## 5. Punctuation & Typography Rules

- **Full stops after standalone UI labels**: No (button text, field labels).
- **Full stops after body sentences**: Yes, always.
- **Commas before "and" in a list of three or more**: Yes (Oxford comma).
- **Colons to introduce a list**: Yes.
- **Semicolons**: Avoid. Use two separate sentences instead.
- **Quotation marks**: Single quotes in UI, double quotes in body copy.
- **En dashes in ranges**: Yes. "£350 to £750" is preferred over "£350-£750" in body copy.
- **Em dashes**: Banned everywhere.

---

## 6. High-Converting CTA Playbook

- **Calculator Submit**: `Calculate my estimate →`
- **Lead Form Submit**: `Get my free solicitor match →`
- **Homepage Banner**: `Check my offer now →`
- **For Solicitors**: `Apply to join our panel →`
- **Forbidden CTAs**: Never use "Submit", "Get started", "Click here", "Learn more".

---

## 7. UI Brand Tokens

- **Navy**: `#0B1F3A` (`text-ink`, `bg-ink`)
- **Coral**: `#D9603B` (`bg-coral`, `border-coral`)
- **Off-white / Paper**: `#F7F4EE` (`bg-paper`) / `#EFEAE0` (`bg-paper-2`)
- **Card**: `#FFFFFF` (`bg-card`)
- **Strict Brand Color Rule**: **Never use green**.
