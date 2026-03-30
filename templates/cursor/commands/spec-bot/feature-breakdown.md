# Feature Breakdown

Convert the product idea into a list of features and store them in `spec-bot/state.json`.

## Important Guidelines

- **The AI generates features autonomously** from the product docs — do NOT ask the user to list features.
- **Only ask the user for confirmation** before saving.
- **Always use AskUserQuestion tool** when asking the user anything.
- Keep features high-level and scoped (one capability per feature).

## Process

### Step 1: Load product context

Read `spec-bot/product/mission.md`, `spec-bot/product/roadmap.md`, and `spec-bot/product/tech-stack.md` if they exist.

If none exist or all are placeholders:

```
No product docs found. Run /plan-product first to define the product, then re-run /feature-breakdown.
```

Also read `spec-bot/specs/` for any spec files that inform feature scope.

### Step 2: Load or init state

Read `spec-bot/state.json`. If it doesn't exist or has no `features` array, treat existing features as `[]`.

If features already exist, note them — the AI should avoid duplicates and can extend the list.

### Step 3: Generate features

Using the product context (especially the roadmap's MVP section), generate a list of features. Each feature should be:

- **One capability** — not a full epic, not a tiny sub-task
- **User-facing** — described in terms of what the user can do
- **Implementable** — can be broken into 2-6 tasks by `/store-task`

Assign ids: `f1`, `f2`, ... (continuing after any existing features).

### Step 4: Confirm with user

Use AskUserQuestion to present the features:

```
Based on your product docs, I've identified [N] features:

  f1 — [Feature name] — [one-line description]
  f2 — [Feature name] — [one-line description]
  f3 — [Feature name] — [one-line description]
  ...

Options:
1. Save all
2. Adjust (tell me what to add, remove, or change)
3. Cancel
```

- If **1**, proceed to Step 5.
- If **2**, use AskUserQuestion to get feedback, apply changes, and re-confirm.
- If **3**, stop.

### Step 5: Write state

Update `spec-bot/state.json`:

- Set `features` to the full array (merge with existing if extending).
- Set `phase` to `"features"`.
- Set `updatedAt` to current ISO timestamp.

Each feature:

```json
{ "id": "f1", "name": "Feature name", "description": "One-line description", "status": "pending" }
```

Status: `pending` | `in-progress` | `done`.

### Step 6: Update context.md

Write a short summary in `spec-bot/context.md`: phase, product idea (one line), and "Features: f1: Name; f2: Name; ...".

### Step 7: Confirm and chain

Use AskUserQuestion:

```
[N] features saved to spec-bot/state.json.

Next: Run /store-task to auto-generate tasks for all features.

Want me to run /store-task now? (yes / no — I'll review features first)
```

If the user says yes, proceed directly into the `/store-task` flow.
