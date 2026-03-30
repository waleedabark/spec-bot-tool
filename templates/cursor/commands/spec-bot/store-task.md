# Store Task

Auto-generate tasks for all features based on product context (mission, roadmap, tech stack, specs, and features) and store them in `spec-bot/state.json`.

## Important Guidelines

- **The AI generates all tasks automatically** — do NOT ask the user for task names, descriptions, use cases, acceptance criteria, or test cases.
- **Only ask the user for confirmation** before saving, or when genuine ambiguity needs resolving.
- **Always use AskUserQuestion tool** when asking the user anything.
- Read existing `spec-bot/state.json` so you don't overwrite other data.

## Process

### Step 1: Load product context

Read all of the following (skip any that are missing):

- `spec-bot/product/mission.md` — problem, target users, solution
- `spec-bot/product/roadmap.md` — MVP and post-launch features
- `spec-bot/product/tech-stack.md` — languages, frameworks, test libraries
- `spec-bot/state.json` — existing features, tasks, phase
- `spec-bot/specs/` — any spec `plan.md` or `shape.md` files for additional detail

If `state.json` is missing, create a minimal state: `{ "version": 1, "phase": "tasks", "updatedAt": "<ISO>", "features": [], "tasks": [], "testResults": [] }`.

If `state.features` is empty, stop and report:

```
No features found. Run /feature-breakdown first to define features, then re-run /store-task.
```

### Step 2: Generate tasks for each feature

Using the loaded product context, generate tasks for **every feature** in `state.features`. For each feature, derive one or more tasks that together fully implement the feature.

For each generated task, include:

- **name** — short, action-oriented (e.g. "Implement email login form")
- **description** — what the task involves, referencing the tech stack
- **useCase** — a user-facing scenario (e.g. "User can log in with their email and password")
- **acceptanceCriteria** — concrete, testable criteria (list of strings)
- **testCases** — skeleton test code using the project's test framework (from `tech-stack.md`); include test descriptions and key assertions

Guidelines for generating tasks:

- Keep tasks small and focused — one logical unit of work per task.
- Cover the full scope of each feature: UI, logic, API, validation, edge cases as needed.
- Acceptance criteria should be specific and verifiable, not vague.
- Test cases should use the actual test framework from `tech-stack.md` (e.g. Jest, Pytest, RSpec).
- Link each task to its feature via `featureId`.

### Step 3: Assign ids

Assign sequential ids starting after the highest existing task id. If no tasks exist yet, start at `t1`. E.g. if `t3` exists, new tasks start at `t4`.

### Step 4: Present tasks for confirmation

Show the user the full list of generated tasks grouped by feature, using AskUserQuestion:

```
I've generated [N] tasks across [M] features:

**[f1] Feature Name**
  t1 — Task name
       Use case: ...
       Acceptance: [count] criteria | Tests: [framework] skeleton included

  t2 — Task name
       ...

**[f2] Feature Name**
  t3 — ...

Options:
1. Save all tasks
2. Let me review the details first (shows full details including acceptance criteria and test cases)
3. Regenerate (provide feedback on what to change)
4. Cancel
```

- If the user picks **1**, proceed to Step 5.
- If the user picks **2**, show full details for all tasks (description, use case, acceptance criteria, test case code) and then ask: "Save all / Edit specific tasks (list task ids) / Regenerate / Cancel".
  - If they say "Edit specific tasks", use AskUserQuestion to ask what to change for each listed task id, apply edits, and re-confirm.
- If the user picks **3**, use AskUserQuestion to ask for feedback, then regenerate from Step 2 with the feedback applied.
- If the user picks **4**, stop.

### Step 5: Write state

Append all confirmed tasks to `state.tasks`. Each task object:

```json
{
  "id": "t1",
  "featureId": "f1",
  "name": "Task name",
  "description": "...",
  "useCase": "...",
  "acceptanceCriteria": ["criterion 1", "criterion 2"],
  "testCases": "describe('...', () => { ... });",
  "status": "pending"
}
```

Write the full `spec-bot/state.json` with updated `tasks`, `phase: "tasks"`, and `updatedAt` (current ISO).

### Step 6: Update context.md

Update `spec-bot/context.md` with a summary of all tasks grouped by feature, e.g.:

```
Phase: tasks
Features: f1: Auth, f2: Dashboard
Tasks: t1 [f1]: Implement login form; t2 [f1]: Add session persistence; t3 [f2]: Build dashboard layout
```

### Step 7: Confirm

Use AskUserQuestion:

```
[N] tasks saved to spec-bot/state.json.

Use /list-tasks to view them, or /implement-task to start working on one.
```
