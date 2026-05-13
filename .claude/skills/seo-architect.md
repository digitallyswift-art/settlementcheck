---
name: seo-architect
version: 1.0
project: SettlementCheck (settlementcheck.co.uk)
description: >
  Run comprehensive SEO audits, content gap analyses, technical
  checks, and E-E-A-T evaluations for SettlementCheck. Produces
  prioritised, actionable output calibrated to the emotional state
  of the target user — someone who has just received redundancy or
  settlement news and is searching for urgent, trustworthy answers.
  Apply this skill whenever auditing site content, generating meta
  tags, assessing new pages, identifying keyword opportunities, or
  reviewing internal link architecture.
triggers:
  - "run seo audit"
  - "check this page for seo"
  - "generate meta for"
  - "find content gaps"
  - "review my content"
  - "keyword opportunities"
  - "check my title tag"
  - "E-E-A-T review"
  - "internal linking"
  - "featured snippet"
  - "seo-architect"
---

# SEO ARCHITECT — SettlementCheck

## READ THIS BEFORE ANY OUTPUT

This skill exists for one project: SettlementCheck at
settlementcheck.co.uk. It is not a generic SEO framework.
Every decision made under this skill must be calibrated to
the specific user, their emotional state, and the competitive
landscape defined below.

The user arriving at SettlementCheck has just been told their
job is at risk or handed a settlement agreement to sign. They
are in a state of shock, fear, suspicion, and urgency. They
are searching at 11pm on a Tuesday. They cannot ask colleagues.
They have a signing deadline.

SEO for this project is not about traffic volume.
It is about reaching that person, at that moment,
with the most accurate and trustworthy answer available —
faster than any law firm, comparison site, or generic
calculator competitor can.

Every audit, every meta tag, every content recommendation
must serve that goal.

---

## SECTION 1: PROJECT CONTEXT

### Site Architecture
- **Primary tool:** Settlement calculator (stepped, 7-question flow)
- **Primary conversion:** Step 2 solicitor matching (lead generation)
- **Secondary conversion:** PDF download / email save (nurture leads)
- **Revenue model:** Lead referral to employment solicitors
- **Tech stack:** Next.js, Vercel, Supabase

### Competitive Landscape
SettlementCheck competes against:
1. Large law firm calculator pages (Citizens Advice, employment
   solicitor firms) — high domain authority, low content quality,
   zero emotional intelligence in copy
2. Generic comparison sites — broad but shallow, no statutory
   accuracy
3. Gov.uk pages — authoritative but passive, no verdict output

**The moat:** SettlementCheck is the only tool that produces
a named verdict ("your offer is below the legal minimum"),
shows an estimated net take-home, separates PILON from SRP
in tax treatment, and uses copy written for the user's
emotional state rather than for legal liability avoidance.

SEO must make this moat visible to search engines and to
the AI Overview / SGE extraction layer.

### Statutory Accuracy Baseline
All content must reflect these verified figures (April 2026 — current):
```
Weekly pay cap (GB):    £751      // ERA 1996 s.227 (SI 2026/310)
Weekly pay cap (NI):    £783      // ERO(NI) 1996 (SR 2026/57)
Max redundancy weeks:   20        // ERA 1996 s.162
Tax-free threshold:     £30,000   // ITEPA 2003 s.403
Protective award max:   90 days   // TULRCA 1992 s.189
Unfair dismissal cap:   £123,543  // ERA 1996 s.124 (SI 2026/310)
Max SRP / basic award:  £22,530   // 20 × 1.5 × £751
```

Previous-year figures (April 2025, retained for comparison tables only):
```
Weekly pay cap (GB):    £719
Weekly pay cap (NI):    £749
Unfair dismissal cap:   £118,223
```

Flag any content referencing outdated figures as
**CRITICAL — TRUST FAILURE** in audit output.
Flag any reference to "Employment Rights Act 2025" as
**CRITICAL — STATUTE ERROR**. This act does not exist in
commenced form (the Bill became an Act but most provisions
commence in stages from 2026 onward).

---

## SECTION 2: AUDIT METHODOLOGY

When running a content or page SEO audit, execute in this
exact sequence. Do not skip steps. Do not reorder them.

### STEP 1 — STATUTORY ACCURACY SCAN
Check before anything else. Accuracy errors destroy E-E-A-T
faster than any technical issue.

Scan for:
- Outdated weekly pay caps (pre-April 2026 figures, except where explicitly labelled as historical "last year" data for comparison tables)
- Any reference to "Employment Rights Act 2025"
- Protective award stated as 180 days (current max is 90)
- PILON described as tax-free (it is fully taxable)
- £30,000 exemption applied to PILON (incorrect)

Output format:
```
STATUTORY ACCURACY: [PASS / FAIL]
Errors found: [list with line reference]
Risk level: CRITICAL — incorrect statutory data destroys
the trust architecture that is SettlementCheck's core
competitive advantage.
```

### STEP 2 — E-E-A-T ASSESSMENT
Evaluate Experience, Expertise, Authoritativeness, Trust
signals on the page.

Check for:
- Legislation citations with section numbers (not just act names)
- Legislation.gov.uk outbound links from cited statutes
- Author credentials or review attribution where applicable
- Date of last statutory update visible on page
- Clear disclaimer: estimate not legal advice
- No overclaiming ("we guarantee" / "maximum award")

Score each signal: PRESENT / ABSENT / WEAK

Output format:
```
E-E-A-T SCORE: [X of 6 signals present]
Missing signals (prioritised by impact):
1. [Signal] — [specific fix required]
2. [Signal] — [specific fix required]
```

### STEP 3 — SEARCH INTENT ALIGNMENT
SettlementCheck exists to serve one primary intent:
**navigational-informational hybrid** — the user knows
what they want (to check if their offer is fair) but
does not know the answer.

Secondary intents served:
- Informational: what am I entitled to?
- Informational: what is the 2026 redundancy pay cap?
- Navigational: find a solicitor who handles settlement agreements

Evaluate whether the page:
- Answers the primary intent in the first visible paragraph
  (above the fold, before any scroll)
- Uses Answer-First methodology (conclusion before explanation)
- Contains at least one specific figure in the opening paragraph
- Does not bury the answer in legal caveats

Output format:
```
INTENT ALIGNMENT: [STRONG / PARTIAL / MISALIGNED]
Primary intent served: [Yes / No]
Answer-First implemented: [Yes / No]
Opening paragraph assessment: [one sentence]
Fix required: [specific rewrite if needed]
```

### STEP 4 — KEYWORD TARGETING ASSESSMENT
Evaluate primary, secondary, and semantic keyword coverage.

#### Keyword Tiers for SettlementCheck

**TIER 1 — Primary (high intent, direct):**
- settlement agreement calculator 2026
- is my settlement offer fair
- settlement calculator UK
- redundancy pay calculator 2026
- settlement agreement calculator free

**TIER 2 — Secondary (high intent, specific):**
- redundancy pay cap 2026
- PILON tax UK
- protective award redundancy
- settlement agreement tax free
- constructive dismissal settlement calculator
- discrimination settlement calculator UK

**TIER 3 — SGE / AI Overview targets (zero-click):**
- what is the redundancy pay cap 2026
- is PILON taxable UK
- what is a protective award
- how long to sign a settlement agreement
- what is the Fair Work Agency

**TIER 4 — Low competition, high intent (own outright):**
- settlement offer below legal minimum
- settlement calculator no email
- is my redundancy pay correct
- settlement agreement free check UK

Evaluate which tiers are covered, missing, or
under-optimised on the audited page.

Output format:
```
KEYWORD COVERAGE:
Tier 1: [covered / missing / weak]
Tier 2: [list which are covered, which are absent]
Tier 3: [list which are present in FAQ schema or headings]
Tier 4: [which are owned, which are opportunities]
Priority gaps: [ranked list of highest-impact missing terms]
```

### STEP 5 — ON-PAGE TECHNICAL ELEMENTS
Audit all technical SEO elements.

#### Title Tag
Requirements:
- 50 to 60 characters
- Primary keyword in first 40 characters
- Brand name at end: | SettlementCheck
- Contains a year (2026) or a figure (£751) or both
- No keyword stuffing

Scoring:
```
TITLE TAG: [PASS / FAIL]
Current: "[current title]"
Character count: [X]
Issues: [list]
Recommended: "[rewritten title]"
```

#### Meta Description
Requirements:
- 140 to 157 characters (do not exceed 157)
- Contains primary keyword
- Contains at least one specific figure (£751, £30,000, etc.)
- Contains a clear CTA or differentiator
- No passive voice
- Ends with a benefit, not a feature

Scoring:
```
META DESCRIPTION: [PASS / FAIL]
Current: "[current meta]"
Character count: [X]
Issues: [list]
Recommended: "[rewritten meta, character count in brackets]"
```

**Meta description template for SettlementCheck pages:**
```
Free UK [page topic] — [specific statutory figure].
[What the page does]. No email. [Differentiator].
```

Example (calculator page):
```
Free UK settlement calculator. Check if your offer is fair
using 2026 rates (£751/week cap). Redundancy, PILON, tax
breakdown. No email. Instant result. [157 chars]
```

#### Heading Hierarchy
Requirements:
- One H1 per page. No exceptions.
- H1 must contain primary keyword and a year or figure
- H2s used for major sections, contain secondary keywords
- H3s for subsections, FAQ questions, and comparison items
- No heading used purely for visual styling
- Answer-First: the H1 must answer the page's primary intent
  as a statement, not a question

```
HEADING HIERARCHY: [PASS / FAIL]
H1: "[current H1]"
Issues: [list]
H2s present: [list]
Missing keyword coverage in headings: [list]
```

#### Open Graph and Social Tags
Requirements:
- og:title set (can differ from title tag)
- og:description set (can differ from meta description)
- og:type: website
- og:image: present, relevant, not generic
- twitter:card: summary_large_image

```
OG TAGS: [PASS / FAIL]
Missing: [list]
```

#### Canonical Tag
- Canonical must be present and self-referencing
- No duplicate content risk from URL parameters
  (calculator result URLs must not be indexable)

```
CANONICAL: [PASS / FAIL]
Issues: [list]
```

#### Structured Data / Schema
Required schema types for SettlementCheck:

| Page Type          | Required Schema                    |
|--------------------|------------------------------------|
| Calculator page    | FAQPage + HowTo                    |
| Blog / guide pages | Article + FAQPage (if FAQs present)|
| Homepage           | Organization + WebSite             |
| Solicitor match    | Service                            |

```
STRUCTURED DATA: [PASS / FAIL]
Present: [list schema types found]
Missing: [list required schema types]
Errors: [list validation errors]
```

### STEP 6 — CONTENT QUALITY ASSESSMENT
Evaluate copy against the SettlementCheck copy standard.

Apply the following checks to every piece of body copy:

**Prohibited phrases (flag as COPY FAILURE if found):**
- "We recommend seeking legal advice"
- "It depends on your circumstances" (without specificity)
- "You may wish to" (passive deflection)
- "Employment Rights Act 2025"
- "Expert solicitors" without specific qualifier
- Any figure without a statutory source citation
- "180 days" as a protective award figure

**Required elements (flag as COPY MISSING if absent):**
- At least one specific statutory figure in opening paragraph
- Answer-First structure (conclusion before explanation)
- Second person throughout (you, your — not "the employee")
- One plain English definition per legal term used
- Emotional acknowledgement on pages serving Phase 1-3 users
- Legislation.gov.uk link for any cited statute

**Copy tone check:**
The copy must serve the user in one of the six emotional
phases defined in Section 0 of the God Mode Prompt.
If the copy reads as:
- Written for a solicitor's professional indemnity insurer → FAIL
- Written for a search engine not a human → FAIL
- Written for a user in shock who needs a straight answer → PASS

```
CONTENT QUALITY: [PASS / PARTIAL / FAIL]
Prohibited phrases found: [list with location]
Required elements missing: [list]
Tone assessment: [one sentence]
Priority rewrites: [ranked list]
```

### STEP 7 — INTERNAL LINKING AUDIT
Internal links distribute authority and guide users through
the conversion funnel.

Map and assess:
- Does the page link to the calculator? (Every page should)
- Does the calculator confirmation state link to the
  Fair Work Agency guide?
- Are statutory terms linked to their definition pages
  (if definition pages exist)?
- Is there a logical next-step link from every page?
- Are there orphaned pages (no inbound internal links)?

```
INTERNAL LINKING: [PASS / FAIL]
Missing links: [list page → recommended target]
Orphaned pages: [list]
CTA link present: [Yes / No]
```

### STEP 8 — PAGE SPEED AND CORE WEB VITALS FLAGS
Do not run full Lighthouse — that requires browser access.
Instead, flag known risk patterns in the codebase:

Risk patterns to check:
- Calculator rendered entirely in JavaScript (not SSR/SSG)
  → risk: LCP failure, content not indexable
- Images without explicit width and height attributes
  → risk: CLS
- No loading="lazy" on below-fold images
  → risk: unnecessary LCP delay
- Render-blocking scripts in head without defer or async
  → risk: FID/INP
- FAQ schema in JavaScript not in static HTML head
  → risk: schema not indexed

```
CORE WEB VITALS RISKS: [list of patterns found]
Priority: [HIGH / MEDIUM / LOW per issue]
```

---

## SECTION 3: CONTENT GAP ANALYSIS

When running a content gap analysis for the site as a whole,
identify missing pages against this priority matrix.

### Priority Matrix

Score each opportunity on:
- **Search volume proxy:** estimated monthly searches
- **Competition level:** 1 (dominated by law firms) to 5 (no competition)
- **Intent match:** how closely it matches the target user's state
- **Authority required:** can SettlementCheck own this without
  a law firm's domain authority?

**Gap Score = Competition × Intent Match**
Higher score = higher priority.

### Content Gaps by Category

#### GAP CATEGORY 1 — Calculator Variant Pages
Low competition. High intent. SettlementCheck can own outright.

| Page                                      | Gap Score | Status |
|-------------------------------------------|-----------|--------|
| Collective redundancy calculator 2026     | 20        | Check  |
| Constructive dismissal calculator         | 20        | Check  |
| NHS settlement calculator 2026            | 16        | Check  |
| Retail sector redundancy calculator       | 15        | Check  |
| Protective award calculator UK            | 20        | Check  |

Note on employer-named calculators:
Do NOT create pages using registered employer brand names
(e.g., Tesco, Amazon, HSBC) as primary page targets.
Trademark exposure. Use sector descriptors instead:
"retail sector redundancy calculator" not
"Tesco redundancy calculator."

NHS is acceptable as a generic sector descriptor,
not a trademark in this context.

#### GAP CATEGORY 2 — Fair Work Agency Content
Zero established competition. New 2025 search territory.

| Page                                      | Gap Score | Status |
|-------------------------------------------|-----------|--------|
| What is the Fair Work Agency?             | 25        | Check  |
| Fair Work Agency settlement agreements    | 25        | Check  |
| Report employer to Fair Work Agency       | 20        | Check  |
| Fair Work Agency vs ACAS                  | 20        | Check  |

These pages should be built now. Competition will arrive.
The window to establish authority is 2025 to 2026.

#### GAP CATEGORY 3 — Statutory Rate Guides
Moderate competition. High trustworthiness requirement.
SettlementCheck can compete on accuracy and recency.

| Page                                      | Gap Score | Status |
|-------------------------------------------|-----------|--------|
| Redundancy pay cap 2026 explained         | 16        | Check  |
| PILON tax treatment UK 2026               | 20        | Check  |
| £30,000 tax-free rule settlement          | 15        | Check  |
| Protective award what it is and how       | 20        | Check  |
| Settlement agreement vs tribunal claim    | 15        | Check  |

#### GAP CATEGORY 4 — Emotional Intent Pages
No competitors are writing for the user's emotional state.
This is the highest-differentiation content opportunity.

| Page                                          | Gap Score |
|-----------------------------------------------|-----------|
| My employer has made me redundant — what now  | 25        |
| Is my settlement offer fair?                  | 25        |
| Can I negotiate my settlement agreement?      | 20        |
| Should I sign my settlement agreement?        | 20        |
| My employer is pressuring me to sign quickly  | 25        |

These pages are differentiated by tone, not by keyword.
No law firm will write "My employer is pressuring me to sign
quickly" in the first person on behalf of the user.
SettlementCheck can own this territory entirely.

---

## SECTION 4: META TAG GENERATION

When asked to generate meta tags for a page, apply this
exact process.

### Inputs Required Before Generating
1. Page URL or slug
2. Page primary purpose (one sentence)
3. Primary keyword target
4. One specific statutory figure relevant to the page
5. Key differentiator for this page vs competitors

### Generation Process

**Title Tag Formula:**
```
[Primary Keyword Year] | [Specific Figure or Action] | SettlementCheck
```
Example:
```
Settlement Agreement Calculator 2026 | Check Your Offer | SettlementCheck
```
Check: 50-60 characters. Primary keyword in first 40 chars.

**Meta Description Formula:**
```
[Action verb] your [topic] using [specific figure or year].
[What the tool/page does in one clause]. [Differentiator].
No email. [Benefit].
```
Example:
```
Check your settlement offer using 2026 UK rates (£751 cap).
Redundancy, PILON and tax calculated instantly. Free, no
email required. See if your offer is fair in 60 seconds.
[157 chars]
```

**AI Overview / SGE Optimisation:**
The opening paragraph of every page must contain:
1. A direct answer to the primary intent
2. At least one specific figure
3. A reference to the current year or statutory update date

This is the paragraph Google's AI Overview extracts.
It must be self-contained — answering the question fully
without requiring the reader to continue reading.

Example for the calculator page:
```
From April 2026, the UK redundancy weekly pay cap is £751
in England, Scotland and Wales (£783 in Northern Ireland).
Statutory redundancy pay is calculated by age, service length,
and weekly pay, capped at 20 qualifying years. The first
£30,000 of a termination payment is tax-free. Enter your
details above to see whether your offer meets, falls below,
or exceeds what similar cases typically receive.
```

This paragraph contains: a specific figure, a jurisdiction
distinction, a tax reference, and a direct instruction.
It is self-contained. It will be extracted by AI Overviews.

---

## SECTION 5: FEATURED SNIPPET TARGETING

SettlementCheck should target three featured snippet types.

### Type 1 — Definition Snippet (paragraph)
Target: Questions beginning with "what is"

Structure required:
- H2 or H3 heading that is the exact question
- Opening sentence that is a direct, specific answer
- No preamble. No "great question." No context-setting.
- 40 to 60 words maximum for the definition paragraph

Example:
```
H2: What is a protective award?

A protective award is compensation of up to 90 days' pay
ordered by an Employment Tribunal when an employer fails to
consult collectively before making 20 or more employees
redundant. It is separate from statutory redundancy pay and
is claimed under TULRCA 1992 s.189.
```

### Type 2 — Table Snippet
Target: Comparison and rate questions

The 2025 vs 2026 comparison table (already specified in the
God Mode Prompt) is the primary table snippet target.
Additional table opportunities:

| Table topic                               | Target query                        |
|-------------------------------------------|-------------------------------------|
| Age multiplier table                      | redundancy multiplier by age UK     |
| Notice period entitlement by years        | statutory notice period UK 2026     |
| Settlement vs tribunal comparison         | settlement agreement vs tribunal UK |
| Tax treatment by payment type             | which redundancy payments are taxable |

All tables must:
- Be in static HTML (not JavaScript-rendered)
- Have a descriptive caption with source attribution
- Use the exact query language in the caption or nearby heading

### Type 3 — Process Snippet (numbered list)
Target: How-to and step-by-step questions

Structure required:
- H2 that matches the question
- Numbered list (ol, not ul)
- Each item: one action, one sentence, maximum 15 words
- Maximum 8 steps

Example:
```
H2: How to calculate your redundancy pay in 2026

1. Find your weekly pay (gross salary divided by 52).
2. Apply the weekly cap: £751 in Great Britain, £783 in NI.
3. Count your complete years of service (maximum 20).
4. Apply the age multiplier: 0.5 under 22, 1.0 aged 22-40,
   1.5 aged 41 and over.
5. Multiply capped weekly pay by the multiplier for each year.
6. Total the years. This is your statutory redundancy pay.
```

---

## SECTION 6: E-E-A-T ACCELERATION

SettlementCheck cannot use domain authority as its E-E-A-T
signal — it is a relatively new site. It must build E-E-A-T
through demonstrated accuracy and citation depth instead.

### Legal Citation Footnote System
Every calculated or stated figure in any piece of content
must carry a source citation. Format:

```
Inline: "The weekly pay cap is £751 ¹"
Footnote: "¹ ERA 1996 s.227, as amended by the Employment
Rights (Increase of Limits) Order 2026 (SI 2026/310)."
Link: legislation.gov.uk canonical URL
```

This is the E-E-A-T equivalent of a peer-reviewed paper's
reference section. Law firms do not do this because their
brand authority substitutes for it. SettlementCheck must
do it because it cannot rely on brand authority yet.

### Statutory Update Protocol
Every page that references a statutory figure must display:

```
"Figures on this page reflect the Employment Rights (Increase
of Limits) Order 2026 (SI 2026/310), in force from 6 April 2026.
Last reviewed: [Month Year]."
```

This signals to Google and to the user that the figures are
current and that someone is maintaining them.

### Pending Legislation Handling
The Employment Rights Bill 2024-25 (HC Bill 11) contains
provisions that are not yet commenced. When referencing
these:

```
CORRECT:
"The Employment Rights Bill 2024-25 proposes [change].
This has not yet come into force. Current law remains [X]."

INCORRECT (creates false authority):
"Under the new Employment Rights Act, [change]..."
"From 2026, [change] will apply..."
```

Flag any content that presents unenacted provisions as
current law as **CRITICAL — LEGAL ACCURACY FAILURE**.

---

## SECTION 7: AUDIT OUTPUT FORMAT

When completing a full page audit, produce output in this
exact structure. Do not deviate from the format.

```
═══════════════════════════════════════════════════════
SEO ARCHITECT AUDIT — [PAGE URL]
Date: [DD Month YYYY]
Audit type: [Full / Quick / Targeted]
═══════════════════════════════════════════════════════

CRITICAL FAILURES (fix before anything else)
─────────────────────────────────────────────
[List only items that are actively harming trust,
accuracy, or indexability. If none, state: None found.]

HIGH PRIORITY (fix within 7 days)
─────────────────────────────────
[Items that are materially limiting traffic or conversion]

MEDIUM PRIORITY (fix within 30 days)
──────────────────────────────────────
[Items that improve performance but are not blocking]

QUICK WINS (fix today, under 30 minutes each)
─────────────────────────────────────────────
[Title tag rewrites, meta description updates,
 heading copy changes, missing alt text]

CONTENT GAPS IDENTIFIED
────────────────────────
[Pages or sections missing that this page should
 link to or that should exist for this topic cluster]

FEATURED SNIPPET OPPORTUNITY
─────────────────────────────
[Specific snippet type, target query, and structural
 recommendation if applicable]

RECOMMENDED META TAGS
──────────────────────
Title: "[rewritten title]" [X chars]
Meta:  "[rewritten description]" [X chars]

COPY REWRITES REQUIRED
────────────────────────
[Section: current copy → recommended copy]
[Maximum 3 rewrites per audit to keep output actionable]

SELF-AUDIT BEFORE DELIVERING THIS REPORT
──────────────────────────────────────────
[ ] No statutory figures cited without source
[ ] No "Employment Rights Act 2025" appears anywhere
[ ] No recommended copy uses prohibited phrases
[ ] All meta descriptions are 157 chars or fewer
[ ] Featured snippet recommendations are structurally correct
[ ] Critical failures are genuinely critical — not inflated
═══════════════════════════════════════════════════════
```

---

## SECTION 8: QUICK REFERENCE — PROHIBITED AND REQUIRED

### Prohibited in ALL SettlementCheck content
```
"Employment Rights Act 2025"          → STATUTE ERROR
"180 days" as protective award figure → LEGAL ERROR
"PILON is tax-free"                   → TAX ERROR
"We recommend seeking legal advice"   → COPY FAILURE
"It depends on your circumstances"    → COPY FAILURE (without specificity)
"Expert solicitors"                   → UNSPECIFIC CLAIM
Any figure without statutory source   → E-E-A-T FAILURE
Employer brand names as page targets  → TRADEMARK RISK
```

### Required on ALL SettlementCheck pages
```
One specific statutory figure in opening paragraph
Answer-First structure (answer before explanation)
Second person throughout (you / your)
Legislation.gov.uk link for any cited statute
Last reviewed date on any page with statutory figures
Calculator CTA link (every page without exception)
```

### Statutory Sources Reference
```
ERA 1996 s.86     → notice entitlement
ERA 1996 s.124    → unfair dismissal cap
ERA 1996 s.139    → redundancy definition
ERA 1996 ss.162-3 → redundancy pay calculation
ERA 1996 s.227    → weekly pay cap
ITEPA 2003 s.402D → PILON taxation
ITEPA 2003 s.403  → £30,000 tax-free threshold
TULRCA 1992 s.188 → collective consultation duty
TULRCA 1992 s.189 → protective award
ERO(NI) 1996      → Northern Ireland weekly cap
```

---

## SECTION 9: SKILL SELF-AUDIT

Before delivering any output produced under this skill,
run these checks. Binary. No partial credit.

```
[ ] Statutory accuracy scan completed first
[ ] All cited figures match April 2026 verified baseline
[ ] "Employment Rights Act 2025" appears in no recommendation
[ ] All meta descriptions are 157 characters or fewer
[ ] All recommended title tags are 60 characters or fewer
[ ] Answer-First structure applied to all recommended copy
[ ] Featured snippet recommendations include structural spec
[ ] Content gap recommendations exclude employer brand names
[ ] All copy recommendations use second person
[ ] All prohibited phrases are absent from recommendations
[ ] E-E-A-T signals assessed and scored
[ ] Audit output follows the exact format from Section 7
[ ] Critical failures are genuinely critical
    (accuracy errors, indexability blockers, trust destroyers)
    not minor optimisations inflated for impact
```

---

*SEO Architect Skill — SettlementCheck*
*Version 1.0 | May 2026*
*All statutory figures verified as of April 2026 (SI 2026/310 / SR 2026/57)*
*Next review: April 2027 or when new commencement orders are published*
