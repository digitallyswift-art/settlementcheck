# conversion-optimization artifact templates

Skeletons for every docs/ file this journey writes. Read the file before writing: if it is missing, create it from the full skeleton below (all section headings), then fill only the sections your phase names; if it exists, extend it — add or update your sections and preserve everyone else's. Creating a file from a partial set of headings is the drift these skeletons exist to prevent.

## Tracker: docs/CONVERSION-OPTIMIZATION-PLAN.md

Created on the first run (Intake). Never shared with another journey.

```markdown
# Conversion Optimization Plan

## Context
Intake answers, date started, the flow and its ONE action, project specifics.
Mode: skills-installed | fallback (Briefs + references/methods.md) — set at the first phase, so a
resumed session knows whether earlier artifacts are skill-grade or Brief-grade.

## Phase Status
| Phase | Skill | Status | Artifact | Date |
|---|---|---|---|---|
| 1 | lean-analytics | pending | METRICS.md | |
| 2 | cro-methodology | pending | FUNNEL.md, EXPERIMENTS.md | |
| 3 | storybrand-messaging | pending | POSITIONING.md, FUNNEL.md, EXPERIMENTS.md | |
| 4 | hundred-million-offers | pending | OFFER.md, EXPERIMENTS.md | |
| 5 | influence-psychology | pending | FUNNEL.md, EXPERIMENTS.md | |
| 6 | design-everyday-things | pending | FUNNEL.md, DESIGN.md, EXPERIMENTS.md | |
| 7 | cro-methodology | pending | EXPERIMENTS.md, METRICS.md | |
Statuses: pending · in-progress · awaiting-evidence · done · deferred: <reason> · skipped: <reason>
A phase parked at `awaiting-evidence` carries a Next Actions row naming the evidence owed, its owner,
and the date — otherwise the next session cannot tell what it is waiting for.

## Key Decisions
| Date | Phase | Decision | Rationale |
|---|---|---|---|

## Next Actions
- [ ] action (owner, due)
```

## docs/FUNNEL.md

One conversion flow end to end — its steps, why people drop, and what answers each doubt. Creates: conversion-optimization.

```markdown
# Conversion Flow

## Flow Map & ONE Action
Flow scope (entry → conversion), the single action each step drives, competing CTAs cut.
| Step | ONE action | Current message/CTA | Proposed message/CTA | Notes |
|---|---|---|---|---|

## Leak Diagnosis
Why each step loses people. METRICS.md `## Funnel` stays canonical for the conversion numbers; this
table adds the researched reason and severity, and cites those numbers rather than restating them.
| Stage | Baseline | Benchmark | Evidence for why | Severity |
|---|---|---|---|---|

## Objections & Counters (O/CO)
| Objection (Big 5) | Evidence (customer words) | Counter | Placement | Status |
|---|---|---|---|---|

## Proof Inventory
| Asset | Type | Placement | Status |
|---|---|---|---|

## Flow Friction Audit
| Step | Issue | Severity (0-4) | Fix | Status |
|---|---|---|---|---|
```

## docs/METRICS.md

What we measure and current baselines.

```markdown
# Metrics

## Stage & One Metric That Matters
OMTM · counter-metric · why now.

## KPI Definitions
| Metric | Definition | Actionable ratio? | Owner |
|---|---|---|---|

## Baselines & Targets
| Metric | Baseline (date) | Target | Line in the sand (miss response) |
|---|---|---|---|

## Funnel
| Stage | Conversion | Benchmark | Bottleneck? |
|---|---|---|---|

## Cohort Notes
```

## docs/EXPERIMENTS.md

Every test we run, with pre-committed criteria.

```markdown
# Experiments

## Experiment Cards
### EXP-001 — [name]
- Hypothesis: We believe [outcome] if [who] [does what] because [reason]
- Type: sprint / smoke test / concierge / painted door / A-B
- Primary metric & threshold (pre-committed):
- Guardrail metric:
- Decision rule (pivot / persevere / iterate):
- Result & verdict:

## Experiment Backlog
| Idea | ICE (impact/confidence/ease) | Status |
|---|---|---|
```

## docs/POSITIONING.md

How the market should understand us — positioning canvas and messaging in one file.

```markdown
# Positioning & Messaging

## Competitive Alternatives

## Unique Attributes → Value Themes
| Attribute | Value ("so what") | Proof |
|---|---|---|

## Best-Fit Customer

## Market Category
Choice (existing / subcategory / new) and rationale.

## One-Liner

## Brand Script (StoryBrand)
Character · Problem (external/internal/philosophical) · Guide · Plan · Call to action · Failure · Success.

## Key Messages
| Surface | Message | Status |
|---|---|---|
```

## docs/OFFER.md

What we sell and at what price.

```markdown
# Offer & Pricing

## Offer Stack
| Element | Description | Honest value | Objection it kills |
|---|---|---|---|
Core offer · Bonuses · Guarantee · Scarcity/urgency (real only) · Name.
"Honest value" is what someone would pay for that element standalone; for per-seat software an
element that has no standalone price is recorded as `n/a — bundled`, never an invented figure.

## Willingness-to-Pay Evidence
| Segment | Acceptable | Expensive | Prohibitive | Source |
|---|---|---|---|---|

## Leader / Filler / Killer Features
| Feature | Class | Tier placement |
|---|---|---|

## Tiers (Good / Better / Best)

## Price Metric
What we charge per, and why.
```

## docs/DESIGN.md

Visual and interaction system.

```markdown
# Design System

## Design Direction
Signature moment, personality, references.

## Typography
Typefaces, scale, measure, line height, loading strategy.

## Tokens
Spacing scale · color palette (shades, tinted grays) · shadows.

## Components
| Component | Decision | Status |
|---|---|---|

## UX Audit Findings
| Issue | Heuristic | Severity (0-4) | Fix | Status |
|---|---|---|---|---|

## Microinteraction Inventory
| Interaction | Trigger/Rules/Feedback/Loops | Fix | Status |
|---|---|---|---|
```
