# conversion-optimization phase methods

The full fallback method for each phase — read the relevant section before running a phase from its Brief (constituent skill not installed). Each section distills the constituent skill plus the named external sources into a runnable procedure. When the constituent skill *is* installed, use it; this file then serves only as the cross-phase glue (benchmarks, formulas, placement rules).

## §1 Find the leak (Lean Analytics — Croll & Yoskovitz)

**Procedure:**

1. **List the steps.** Write the flow as an ordered list from entry to the ONE action (e.g. landing → pricing → signup form → email verify → first key action). Steps you cannot observe cannot be diagnosed: instrument what you can now, and where a sub-step is dark, record the instrumentation as a Next Actions item at `awaiting-evidence`. Proceed as long as the funnel still localizes the leak to one step — a fully instrumented funnel is the goal, not a precondition.
2. **Express every step as a ratio.** Step conversion = users completing step ÷ users entering step, over the same window (2-4 weeks). Totals and cumulative charts are vanity — they only go up and hide decay.
3. **Benchmark each ratio.** Against your own history first (this month vs. last quarter), then published baselines: e-commerce sites convert ~1-3% of visitors overall; landing pages on good paid traffic convert low single digits; B2B SaaS pricing→trial-start commonly runs ~5-15%; onboarding/activation completion ~40-60%; checkout completion ~50-70%; SaaS trial→paid 8-20% depending on trial model; casual apps average roughly 14% day-30 retention. If no benchmark fits a step, use your own trailing 12-week median and label the cell `own history` — an empty Benchmark column is worse than an honest one. Benchmarks are heuristics, not laws — re-derive against your own cohorts.
4. **Find the leak by recoverable value.** Leak value = (benchmark − actual, expressed in users) × the downstream conversion rate from that step to the ONE action × value per converted user. Use the gap to benchmark, not raw drop-off: every step loses most of the people who enter it, so raw lost users always ranks the top of the funnel first and tells you nothing. Multiplying by the downstream rate keeps the estimate in recoverable money rather than theoretical maximum. A 40% drop on a step 10,000 people reach usually still outweighs a 70% drop on a step 200 people reach — but only the gap-to-benchmark form shows which is actually winnable.
5. **Pick the OMTM.** The One Metric That Matters for this journey is the step conversion that gates the most value — usually the biggest leak's ratio. Pair it with a counter-metric so it can't be gamed: signup rate × 30-day retention; checkout completion × refund rate; lead volume × lead-to-close rate.
6. **Draw the line in the sand.** Three parts, written before any fix ships: a target number, a date, and a pre-committed miss response ("checkout completion 65% by June 1, or we rebuild the payment step"). "Good enough" is decided in advance, not discovered after.
7. **Cohort and segment.** Split the funnel by acquisition channel, device, and plan. A flat aggregate often hides one segment soaring and another collapsing; mobile-only leaks are the most common find. Read medians and percentiles where value skews (whales vs. lurkers).

**Output check:** a funnel table (stage | conversion | benchmark | bottleneck?), the OMTM + counter-metric, the line in the sand, and one named leak.

## §2 Research why they leave (CRE Methodology — Blanks & Jesson; LIFT — Goward; MECLABS)

**Procedure:**

1. **Mine primary sources first** — the customer's own words out-persuade any copywriter's invention:
   - Exit survey at the leak, ONE question: "What's preventing you from [action] today?" (one question maximizes response rate).
   - Post-conversion survey within 7 days: "What almost stopped you?" — converts' near-objections are the objections that matter.
   - Support tickets and chat logs: search "but", "however", "worried", "not sure", "confused".
   - Sales calls: the objections reps answer daily are tested counter-objections.
2. **Add secondary sources:** your negative reviews (unaddressed objections), competitors' negative reviews (industry-wide objections), community threads.
3. **Sort into the Big 5:** Trust ("why believe you?"), Price ("worth the money?"), Fit ("works for MY case?"), Timing ("why now?"), Effort ("how hard will this be?"). Tag each objection with the verbatim customer quote as evidence.
4. **Build the O/CO table.** For every objection: an evidence-backed counter, placed at the exact step where the doubt arises in the reading flow — the credit-card objection is answered next to the card form, never in an FAQ. Implicit objections (ones visitors won't admit — "am I too lazy for this?") get CO-Only counters: answer without stating the objection ("Let the audio do the work for you").
5. **Diagnose each step with two lenses:**
   - **LIFT (Goward):** conversion probability = value proposition, amplified by clarity, relevance, and urgency, dragged down by anxiety and distraction. Walk the step and score each factor; anxiety (what could go wrong here?) and distraction (what competes with the ONE action?) are the usual finds.
   - **MECLABS heuristic:** conversion rises with the visitor's motivation and the clarity of the value proposition, falls with friction and anxiety; incentive can partially offset friction. Motivation you mostly inherit from the channel — clarity, friction, and anxiety are yours to fix.
6. **Rank hypotheses with ICE.** Impact, Confidence, Ease, 1-10 each, prioritize by average. Apply the 10x screen: worth testing — a different value proposition, a restructured step, a new guarantee; not worth testing — button colors, font nudges. Confidence comes from research: a hypothesis quoting customer words scores 8-9, a hunch scores 2-3.

**Output check:** an objection list with verbatim evidence, an O/CO table with placements, and an ICE-ranked backlog where every row cites its research.

## §3 Fix the message (StoryBrand — Miller; Made to Stick — Heath & Heath)

**Procedure:**

1. **Run the SB7 pass on the leaking step.** Character: the visitor, wanting one thing (name it in their words). Problem at three levels: external (the practical problem), internal (the frustration — this is what the copy must name; most brands miss it), philosophical (why it's just plain wrong). Guide: you — shown with empathy ("we know what it's like…") and authority (proof, numbers). Plan: 3 steps that make acting feel safe ("1. Connect your account 2. Pick a template 3. Ship"). CTA: one Direct (Buy/Start) plus one Transitional (guide, sample) — visually distinct, the Direct dominant. Stakes: what's lost by not acting, what success looks like.
2. **Rewrite the headline in customer language.** Pull the phrasing from Phase 2 verbatim quotes. Test: the 5-second test — show the step to a stranger for five seconds; they must be able to say what's offered, who it's for, and what to do next.
3. **Write the one-liner:** "We help [X] who struggle with [Y] to [Z]" — repeatable after one hearing.
4. **Make it stick (SUCCESs):** Simple — pick the Commander's Intent, the ONE message that survives if everything else is forgotten. Concrete — replace abstractions with sensory specifics ("order in 30 minutes, still hot"; "save 16 hours a month"). Credible — make statistics human-scale (the Sinatra test); prefer specific over round figures ("2,347 teams" beats "thousands"). Unexpected — break one pattern to earn attention, then close the curiosity gap you opened.
5. **Cut.** Half the words, then half again — the step must read at a scan.

**Output check:** a rewritten step that names the internal problem, one dominant CTA, a one-liner that survives one hearing, and a test hypothesis for the copy change.

## §4 Strengthen the offer ($100M Offers — Hormozi)

**Procedure:**

1. **Score the Value Equation.** Value = (Dream Outcome × Perceived Likelihood of Achievement) ÷ (Time Delay × Effort & Sacrifice). Score each lever 1-10 for the offer as the visitor perceives it at the conversion point. The denominator is usually the cheapest place to win: time-to-first-value and perceived effort.
2. **Design the guarantee against the top objection.** Match type to objection: Trust → unconditional money-back ("30 days, no questions"); Fit → conditional outcome guarantee ("10 qualified leads or you don't pay"); Effort → service guarantee ("we set it up for you"). A guarantee raises Perceived Likelihood and lowers anxiety simultaneously — it is the highest-leverage single change on most conversion points. Price the guarantee's real cost: refund abuse is almost always lower than the conversion lift, but model it.
3. **Trim & stack.** List every problem between the visitor and the Dream Outcome; attach a named solution to each (template, setup call, checklist, community). Cut low-value/high-cost components; stack high-value/low-cost ones. Each component: nameable, independently valuable, honestly dollar-valued — never inflate values to fake the gap.
4. **Present price after value.** Anchor against the stack total ("Total value $X. Your investment $Y."). Payment plans and tiers lower the entry threshold without discounting.
5. **Scarcity and urgency — real only.** Cohort start dates, capacity limits, expiring bonuses that actually expire. A fake countdown converts once and destroys trust permanently; if the visitor could see your backend, the claim must still be true.

**Output check:** a per-lever change list, a guarantee aimed at the top researched objection, an honest offer stack, and a test hypothesis per offer change.

## §5 Place the proof (Influence — Cialdini)

**Procedure:**

1. **Audit proof against the O/CO table.** Every open objection row needs its counter physically rendered at its placement. Walk the flow step by step: at each moment of doubt, what does the visitor *see*?
2. **Match principle to objection.** Trust → social proof + authority (named testimonials with faces and context, certification badges, expert endorsements, media logos). Fit → similar-other proof ("agencies like yours…", segmented case studies). Price → ROI evidence, cost-of-alternative comparisons. Timing → real scarcity, cost-of-delay math. Effort → process proof ("set up in 5 minutes" with a screenshot of the 3 steps).
3. **Respect the proof hierarchy:** specific results with context > named testimonials with photos > case studies > statistics > logo bars > generic praise. Specific numbers beat round ones.
4. **Sequence commitment.** Ask for the small yes before the big yes: value moment before card details; a one-field email step before the full form; a saved configuration before the account wall. Each completed micro-step raises consistency pressure toward finishing — ethically, because each step delivers value.
5. **Reciprocity first.** Whatever is free (audit, template, sample) appears before the ask, not gated behind it.
6. **Gate everything with the transparency test:** if the visitor knew exactly how this element was chosen and placed, would they feel helped or tricked? Fabricated testimonials, fake activity feeds, cherry-picked averages presented as typical, and hidden costs fail — they are defects, not tactics. Missing proof gets acquired (testimonial request emails, case-study interviews), logged as Next Actions with owners — never invented.

**Output check:** a Proof Inventory where every O/CO row has a real asset placed or an acquisition task, and no unverifiable claim anywhere in the flow.

## §6 Cut the friction (Design of Everyday Things — Norman; Fogg B=MAP; Baymard Institute)

**Procedure:**

1. **Frame with B=MAP (Fogg).** Behavior = Motivation × Ability × Prompt, converging in the same moment. Phases 3-5 raised Motivation; friction work raises Ability (make it easier) and fixes Prompts (make the next action unmissable). When a step underperforms despite good motivation, suspect ability first — simplify before you persuade harder.
2. **Bridge the Gulf of Execution (Norman).** Signifiers: buttons look pressable, fields look editable, links look clickable — no mystery-meat. Constraints make errors impossible instead of warned-against: date pickers over free text, country-aware phone masks, submit disabled until valid (with visible reasons), confirm-by-design instead of confirm-by-dialog.
3. **Bridge the Gulf of Evaluation.** Feedback within 0.1s of every action; skeleton states or progress for anything slower than 1s; a multi-step flow shows where the visitor is and how much is left. After submission, the confirmation states what happened and what happens next.
4. **Cut the form (Baymard findings).** Every field costs completions. For each field ask: needed *now*, or collectable later? Typical cuts: company size, phone number, "how did you hear about us". Payment details as late as possible; show ALL costs (shipping, taxes, fees) before the final step — surprise costs are the single most-cited reason for checkout abandonment; offer guest checkout (forced account creation is the second); inline validation on blur, with messages that say how to fix ("Card number is 16 digits — this one has 15"), never blame.
5. **Forgive slips.** Undo beats are-you-sure; destructive or expensive actions separated spatially from frequent ones; drafts persist through navigation and crashes.
6. **Severity-rate every finding 0-4** (frequency × impact × persistence) and fix catastrophes before cosmetics.

**Output check:** a Flow Friction Audit with severity per issue, a form cut to minimum fields, all costs visible before the final step, and rewritten error messages.

## §7 Prove it (CRE testing methodology — Blanks & Jesson; Trustworthy Online Controlled Experiments — Kohavi, Tang & Xu)

**Procedure:**

1. **Write the hypothesis:** "If we [change X], then [primary metric] will improve because [reason grounded in Phase 2 research]." No research citation, no test.
2. **Pre-commit the metrics.** Primary (decides the winner — usually the OMTM), secondary (monitoring), guardrails (must not degrade: the counter-metric, revenue per visitor, support contact rate, page performance).
3. **Compute sample size before starting** from baseline rate and minimum detectable effect at 95% significance and 80% power (any standard calculator). If the required sample exceeds ~4 weeks of traffic, the test as designed is untestable — make the change bolder (bigger MDE) or use method 7 below.
4. **Size the guardrail too, not just the primary.** A guardrail measured further down the funnel has a fraction of the primary's volume and usually cannot reach power inside the primary's window (a trial→paid counter-metric at 180/week may need 20+ weeks to detect a 3-point drop). When it can't, say so explicitly and split the role: keep the deep metric as *monitored, not gating*, with a directional revert trigger ("revert if it falls more than X points over the test window"), and pick a fast, high-volume proxy near the change — next-step completion, support-contact rate, refund requests — as the gating guardrail. A guardrail nobody sized is decorative.
5. **Run at least one full business cycle** — 1-2 weeks minimum, covering weekdays and weekends — even if significance arrives earlier.
6. **Never peek to stop.** Optional stopping inflates false positives severalfold; decide duration up front and report whatever the pre-set test returns. Never rerun until you like the answer; never bury an inconclusive result — a failed test that teaches you something beats a win you don't understand.
7. **Low traffic playbook (choose explicitly, and write down which):**
   - Sequential before/after: 2-4 weeks each side, same seasonality, plus qualitative confirmation (session recordings, survey deltas).
   - Reversible bet: ship the fix behind an easy revert, define the trigger that reverts it ("if week-over-week completion drops 10%, revert").
   - Test bolder: dramatic changes reach significance on far smaller samples than timid ones.
8. **Gate rollout on practical significance.** A statistically significant 0.1% lift may not pay for its complexity; pre-state the minimum lift worth keeping.
9. **Close the loop.** Winner becomes the new control; record the learning (Test, Hypothesis, Result, Learning, Applicable-to) and scale the insight to adjacent surfaces (ads, emails, other steps). Update the OMTM baseline and re-enter §1 for the next leak.

**Output check:** every shipped change is an Experiment Card with pre-committed metric, sample size, duration, and decision rule — and a recorded verdict.
