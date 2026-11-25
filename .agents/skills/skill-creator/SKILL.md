---
name: skill-creator
description: >-
  Creates, audits, or refactors Antigravity Agent Skills (.agents/skills/<name>/SKILL.md)
  from scratch or from a completed session. Use when the user asks to create a new skill,
  "skillify" a workflow, or slim down a bloated skill. Do NOT use for general coding,
  editing non-skill docs, or creating runtime agents in lib/agentic-engine/.
---

# Antigravity Skill Creator

Build lean, non-overlapping skills that trigger reliably without bloating context windows.

## 1. Pre-Flight Gate (Answer Before Writing)

1. **Right Primitive?**
   * **Always-on rule** (brand, style, naming, coding invariants) → put in `.agents/rules/` or `AGENTS.md`, not a skill.
   * **Production runtime behavior** (LLM calls, cron workers, APIs) → belongs in `lib/agentic-engine/`, not `.agents/skills/`.
   * **Repeatable on-demand workflow/runbook** → proceed as a skill.
2. **Overlap Check:** Scan `.agents/skills/` first. If an existing skill already owns this domain, add a file to its `references/` or `scripts/` folder instead of creating a competing skill.

## 2. Determine the Mode

* **Mode A — From Scratch:** Ask up to 3 targeted clarifying questions (inputs, expected output, constraints/edge cases) before writing files.
* **Mode B — Skillify Current Session:** When asked to "turn this into a skill" or "skillify what we just did," extract the exact tools used, step sequence, output format, and **every correction the user made**. Do not ask redundant questions.
* **Mode C — Audit / Refactor Existing Skill:** Trim bloated `SKILL.md` files by moving static tables, templates, and long checklists into `references/`, `examples/`, `resources/`, or `scripts/`. Never strip or weaken compliance disclaimers or SRA/FCA guardrails during a refactor.

## 3. Architecture & Quality Rules

1. **Target Path:**
   * Project skills (default): `.agents/skills/<kebab-case-name>/SKILL.md`
   * Global skills (only if explicitly requested): `~/.gemini/config/skills/<kebab-case-name>/SKILL.md`
2. **YAML Frontmatter:**
   * `name`: lowercase `kebab-case`, matching the folder name.
   * `description`: under 100 tokens, third-person, stating **what** it does, **when** to use it, and **when NOT** to use it.
3. **Size Ceiling:** Keep `SKILL.md` under 500 lines (aim for under 150 lines). Offload bulky material to `references/`, `examples/`, `resources/`, or `scripts/`.
4. **1-Hop Relative Links Only:** Link supporting files directly from `SKILL.md` (e.g. `[checklist](./references/checklist.md)`). Never chain File A → File B.
5. **Antigravity-Native & Repo-Safe:**
   * No Claude-only syntax (`$ARGUMENTS`, `CLAUDE.md`).
   * Never embed hardcoded vanity metrics or contradict `.agents/rules/` (`brand-standards.md`, `engineering-standards.md`, `audit-naming-standards.md`).
   * Any skill touching user-facing copy, calculator outputs, or legal/financial framing **must** defer to `.agents/rules/brand-standards.md` (descriptive-not-prescriptive language, SRA/FCA boundaries).

## 4. Execution & Verification

1. Draft and write `.agents/skills/<name>/SKILL.md` and any supporting `references/`, `examples/`, `resources/`, or `scripts/` files.
2. If a new project skill is created, propose adding its `@<name>` entry to `AGENTS.md` (Section 1 & Section 2).
3. **Self-Audit:** Confirm `description` < 100 tokens with trigger + anti-trigger, `SKILL.md` < 500 lines, zero overlap with existing skills, compliance guardrails intact, and 1-hop relative links only.
4. **Verify:** Offer to dry-run the new or refactored skill immediately on one real task in the repo.
