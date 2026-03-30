# Plan Product

Establish foundational product documentation. Creates mission, roadmap, and tech stack files in `spec-bot/product/`.

## Important Guidelines

- **Always use AskUserQuestion tool** when asking the user anything.
- **Minimize round trips** — offer a single combined prompt first; only fall back to individual questions if the response is too sparse.
- **Keep it lightweight** — gather enough to create useful docs without over-documenting.

## Process

### Step 1: Check for existing product docs

Check if `spec-bot/product/` exists and contains any of these files:
- `mission.md`
- `roadmap.md`
- `tech-stack.md`

**If any files exist with real content** (not just placeholders), use AskUserQuestion:

```
I found existing product documentation:
- mission.md: [exists with content / placeholder / missing]
- roadmap.md: [exists with content / placeholder / missing]
- tech-stack.md: [exists with content / placeholder / missing]

Would you like to:
1. Start fresh (replace all)
2. Update specific files
3. Cancel

(Choose 1, 2, or 3)
```

If option 2, ask which files to update and only gather info for those.
If option 3, stop here.

**If no files exist or all are placeholders**, proceed to Step 2.

### Step 2: Gather product vision (combined prompt)

Use AskUserQuestion with a single combined prompt:

```
Let's define your product. Tell me about it in as much detail as you'd like:

- What problem does it solve?
- Who is it for?
- What makes your approach unique?
- What are the must-have features for MVP?
- What tech stack are you using? (frontend, backend, database, test framework)

You can answer all at once in a paragraph, or just describe your product idea and I'll ask follow-ups for anything I'm missing.
```

### Step 3: Extract or follow up

After the user responds, analyze their answer:

**If their response covers most areas** (problem, users, features, tech), extract all fields and proceed to Step 4. No need to ask more questions.

**If their response is sparse** (e.g. just "a todo app in React"), ask targeted follow-ups — but batch related questions. Use AskUserQuestion:

```
Got it — [restate what you understood]. A few more details I need:

- Who are the target users? (e.g. developers, general public, enterprise teams)
- What are the must-have features for the first version?
- What's the backend/database? (or is this frontend-only?)
```

At most **one follow-up round**. If the user is still brief, fill in reasonable defaults and note them in the files as assumptions.

### Step 4: Check for tech stack standard

Check if `spec-bot/standards/global/tech-stack.md` exists.

**If it exists**, read it and compare with the user's stated tech stack. If they match, use the standard as-is. If they differ, use the user's stated preferences.

### Step 5: Generate files

Create the `spec-bot/product/` directory if it doesn't exist.

Generate each file based on the information gathered:

#### mission.md

```markdown
# Product Mission

## Problem

[What problem this product solves — from user's response]

## Target Users

[Who this product is for — from user's response]

## Solution

[What makes the solution unique — from user's response]
```

#### roadmap.md

```markdown
# Product Roadmap

## Phase 1: MVP

[Must-have features for launch — from user's response, formatted as a list]

## Phase 2: Post-Launch

[Planned future features, or "To be determined"]
```

#### tech-stack.md

```markdown
# Tech Stack

## Frontend

[Frontend technologies, or "N/A"]

## Backend

[Backend technologies, or "N/A"]

## Database

[Database choice, or "N/A"]

## Testing

[Test framework and test runner — e.g. "Jest with React Testing Library"]

## Other

[Other tools, hosting, services — omit if nothing mentioned]
```

Include a `## Testing` section — this is critical for `/implement-task` and `/test-task` to know which test framework to use.

### Step 6: Update state

If `spec-bot/state.json` exists, update `phase` to `"planning"` and `updatedAt`. If it doesn't exist, create it:

```json
{
  "version": 1,
  "phase": "planning",
  "updatedAt": "<ISO>",
  "features": [],
  "tasks": [],
  "testResults": []
}
```

### Step 7: Confirm and suggest next step

After creating all files, output:

```
Product documentation created:

  spec-bot/product/mission.md
  spec-bot/product/roadmap.md
  spec-bot/product/tech-stack.md

Next: Run /feature-breakdown to convert your roadmap into features, or review the files first.
```

## Tips

- If the user provides very brief answers, fill in reasonable defaults and mark them as assumptions — the docs can be refined later.
- The `## Testing` section in tech-stack.md is critical — downstream commands depend on it to run tests.
- The `/feature-breakdown` command reads these files, so having them populated with real content enables better auto-generated features.
