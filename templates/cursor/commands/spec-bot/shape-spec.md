# Shape Spec

Gather context and create a structured spec for a significant piece of work. Use this for complex features that benefit from upfront planning before implementation.

## Important Guidelines

- **Always use AskUserQuestion tool** when asking the user anything.
- **Minimize round trips** — batch related questions, use context to fill gaps, only ask what you genuinely can't infer.
- **Keep it lightweight** — this is shaping, not exhaustive documentation.
- **Offer suggestions** — present options the user can confirm or adjust.

## Process

### Step 1: Determine scope

Use AskUserQuestion with a combined prompt:

```
What are we building? Describe the feature or change.

Include any of these if relevant:
- What's the expected outcome?
- Are there mockups, screenshots, or examples?
- Is there similar code in this codebase to reference?

(Be as detailed or brief as you like — I'll fill in the gaps.)
```

Based on their response:
- If the scope is clear enough to proceed, move to Step 2.
- If genuinely ambiguous (could mean two very different things), ask **one** focused clarifying question, then move on.

### Step 2: Load context automatically

Read the following without asking the user — gather context from what exists:

1. **Product docs** — `spec-bot/product/mission.md`, `roadmap.md`, `tech-stack.md` (to align the spec with the product).
2. **Existing state** — `spec-bot/state.json` (to see related features/tasks).
3. **Standards index** — `spec-bot/standards/index.yml` (to identify relevant standards).
4. **Reference code** — if the user mentioned similar code or files, read those. If they didn't but you can infer likely references from the codebase structure, scan them.

### Step 3: Generate the spec folder name

Create a folder name:

```
YYYY-MM-DD-HHMM-{feature-slug}/
```

Where:
- Date/time is the current timestamp
- Feature slug is derived from the description (lowercase, hyphens, max 40 chars)

Example: `2026-02-22-1430-user-comment-system/`

### Step 4: Draft the full spec

Based on everything gathered, draft all spec documents and present the **complete plan** to the user in one shot. This includes:

**Task 1 is always "Save spec documentation"** — creating the spec folder and files themselves.

Use AskUserQuestion to present:

```
Here's the spec for [Feature Name]:

## Spec folder: spec-bot/specs/[folder-name]/

### plan.md — Implementation plan

Task 1: Save spec documentation (this spec)
Task 2: [First implementation task] — [description]
Task 3: [Next task] — [description]
...

### shape.md — Shaping notes

Scope: [what we're building]
Decisions: [key architectural choices]
References: [code references studied]
Product alignment: [how it fits the mission/roadmap]

### standards.md — Applicable standards

[List which standards apply and why]

### references.md — Reference implementations

[List code references and what patterns to borrow]

---

Options:
1. Save this spec
2. Adjust (tell me what to change)
3. Cancel
```

### Step 5: Save the spec

Create `spec-bot/specs/{folder-name}/` with these files:

#### plan.md

```markdown
# [Feature Name] — Plan

## Task 1: Save Spec Documentation

Create spec folder with plan, shape, standards, and references.

## Task 2: [Implementation task]

[Description, approach, key decisions]

## Task 3: [Next task]

...
```

#### shape.md

```markdown
# [Feature Name] — Shaping Notes

## Scope

[What we're building]

## Decisions

- [Key decisions made during shaping]
- [Constraints or requirements noted]

## Context

- **Visuals:** [List of visuals provided, or "None"]
- **References:** [Code references studied]
- **Product alignment:** [How this fits the mission/roadmap]

## Standards Applied

- [standard/name] — [why it applies]
```

#### standards.md

Include the full content of each relevant standard:

```markdown
# Standards for [Feature Name]

The following standards apply to this work.

---

## [standard/name]

[Full content of the standard file]

---
```

#### references.md

```markdown
# References for [Feature Name]

## Similar Implementations

### [Reference name]

- **Location:** `src/features/[path]/`
- **Relevance:** [Why this is relevant]
- **Key patterns:** [What to borrow]
```

If visuals were provided, create a `visuals/` subfolder and note file paths.

### Step 6: Confirm and suggest next step

```
Spec saved to spec-bot/specs/[folder-name]/.

Next steps:
- Run /feature-breakdown to add this as a feature (if not already tracked)
- Run /store-task to generate implementation tasks from this spec
- Edit the spec files directly to refine
```

## Tips

- **Keep shaping fast** — capture enough to start, refine as you build.
- **Visuals are optional** — not every feature needs mockups.
- **Standards guide, not dictate** — they inform the plan but aren't always mandatory.
- **Specs are discoverable** — months later, someone can find this spec and understand what was built and why.
