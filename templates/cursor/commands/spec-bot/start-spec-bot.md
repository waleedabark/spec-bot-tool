# Start Spec-Bot

**Entry point when the user says `/start-spec-bot`.** Detects the current project phase, shows a status summary, and recommends the next step.

## Process

### Step 1: Load project state

Read the following (skip any that are missing):

- `spec-bot/state.json`
- `spec-bot/context.md`
- `spec-bot/product/mission.md`
- `spec-bot/product/roadmap.md`
- `spec-bot/product/tech-stack.md`

### Step 2: Detect phase and recommend

Based on what exists, determine the project's current state and recommend the logical next action.

**If no product docs exist** (no `spec-bot/product/mission.md`):

```
Welcome to spec-bot. No product documentation found yet — let's start from the beginning.

Recommended: /plan-product — Define your product's mission, roadmap, and tech stack.

Or pick a different starting point:
  2. /feature-breakdown — Jump straight to defining features
  3. /inject-standards — Set up coding standards first
```

**If product docs exist but no features** (`state.features` is empty or missing):

```
Product docs found: mission, roadmap, tech stack.

Recommended: /feature-breakdown — Convert your product idea into features.

Other options:
  2. /plan-product — Update existing product docs
  3. /shape-spec — Create a detailed spec for a feature
```

**If features exist but no tasks** (`state.features` has items, `state.tasks` is empty):

```
[N] features defined. No tasks yet.

Recommended: /store-task — Auto-generate tasks for all features.

Other options:
  2. /list-tasks — View current state
  3. /feature-breakdown — Modify features
```

**If tasks exist but no project scaffold** (tasks in state, but no source files or dependency manifest in project root):

```
[N] tasks ready across [M] features. No project structure detected.

Recommended: /scaffold-project — Generate the initial project structure.

Other options:
  2. /implement-task — Start implementing (will create files as needed)
  3. /list-tasks — Review tasks first
```

**If tasks exist and project is scaffolded** (pending tasks remain):

```
Project status: [X]/[total] tasks done, [Y]/[total] features complete.

Recommended: /implement-task — Implement the next pending task ([tN] — [name]).
             /implement-all — Implement all [Z] remaining tasks autonomously.

Other options:
  3. /list-tasks — See full task list with status
  4. /test-task — Test a completed task
```

**If all tasks are done** (no pending tasks, some may need testing):

```
All [N] tasks implemented. [X] verified, [Y] awaiting tests.

Recommended: /test-task all — Run the full test suite.
             /validate-project — End-to-end validation.

Other options:
  3. /list-tasks — See full status
  4. /store-task — Generate additional tasks
```

**If everything is verified:**

```
Project complete. All [N] tasks verified across [M] features.

Options:
  1. /validate-project — Run a final end-to-end check
  2. /store-task — Add more tasks for new features
  3. /plan-product — Update the roadmap for the next phase
```

### Step 3: Handle user choice

- If they pick the recommended action, run that command's flow.
- If they pick a different option, run that command's flow.
- If they're not sure, explain the workflow briefly:

```
The spec-bot workflow is:
  1. /plan-product → 2. /feature-breakdown → 3. /store-task → 4. /scaffold-project → 5. /implement-all → 6. /validate-project

You're currently at step [N]. The recommended next action is [command].
```
