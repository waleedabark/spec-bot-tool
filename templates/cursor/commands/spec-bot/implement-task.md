# Implement Task

Pick (or auto-select) a task from `spec-bot/state.json` and implement it fully: code, tests, and verification.

## Important Guidelines

- **The AI drives implementation autonomously** — read all context, plan the approach, write the code, run the tests.
- **Only ask the user for confirmation** before starting a task, or when a decision has multiple valid approaches and the right choice isn't clear from context.
- **Always use AskUserQuestion tool** when asking the user anything.
- **Read before writing** — understand the codebase structure, tech stack, standards, and specs before touching any code.

## Process

### Step 1: Load context and select task

Read all of the following (skip any that are missing):

- `spec-bot/state.json` — tasks, features, phase
- `spec-bot/product/tech-stack.md` — languages, frameworks, test runner, package manager
- `spec-bot/product/mission.md` — product goals (to understand intent)
- `spec-bot/product/roadmap.md` — scope boundaries
- `spec-bot/specs/` — any relevant spec `plan.md`, `shape.md`, `standards.md` files

If `state.tasks` is empty or missing:

```
No tasks found. Run /store-task to generate tasks first.
```

**Auto-select the next pending task** — pick the first task with `status: "pending"`, preferring tasks whose `featureId` matches a feature that is already `"in-progress"` (to finish one feature before starting another).

If the user passed a specific task id (e.g. `/implement-task t3`), use that task instead.

Show the selected task and use AskUserQuestion:

```
Next task: **t1 — [Name]** (feature: [featureId] — [feature name])

Description: [description]
Use case: [useCase]
Acceptance criteria:
  1. [criterion 1]
  2. [criterion 2]
  ...

Proceed? (yes / pick a different task / skip to t[N])
```

### Step 2: Scan existing codebase

Before writing any code, understand what already exists:

1. **Check project root** — look for dependency files (`package.json`, `requirements.txt`, `Cargo.toml`, `go.mod`, etc.), config files, and existing source directories.
2. **Scan source folders** — list existing files and folders to understand the project's directory conventions (e.g. `src/`, `app/`, `lib/`, `tests/`).
3. **Read related files** — if previous tasks for the same feature have been implemented, read those files to follow established patterns.
4. **Check for relevant standards** — read any standard files referenced in specs that apply to this task (API format, error handling, naming, etc.).

Do NOT ask the user about project structure — infer it from what exists. If this is the very first task being implemented and no codebase exists yet, run `/scaffold-project` first (or create the minimal structure needed).

### Step 3: Plan the implementation

Before coding, produce a brief plan (output this to the user, no confirmation needed unless the approach is ambiguous):

```
Implementation plan for t1:

Files to create:
  - src/components/LoginForm.tsx
  - src/components/LoginForm.test.tsx

Files to modify:
  - src/routes/index.tsx (add login route)

Approach:
  - [1-2 sentences on the approach]

Dependencies needed:
  - [any new packages, or "none"]
```

If there are multiple valid architectural approaches and the context doesn't make the right choice clear, use AskUserQuestion to let the user decide. Otherwise, proceed.

### Step 4: Set task status to in-progress

Update `spec-bot/state.json`:
- Set this task's `status` to `"in-progress"`
- If the parent feature's `status` is `"pending"`, set it to `"in-progress"`
- Update `updatedAt`

### Step 5: Implement — tests first, then code

Follow a test-driven approach:

1. **Install dependencies** — if the task requires new packages, install them using the project's package manager (from `tech-stack.md`).

2. **Write tests first** — use the `testCases` from the task as a skeleton. Expand them into complete, runnable test files using the project's test framework. Tests should cover:
   - The happy path from the `useCase`
   - Each acceptance criterion
   - Key edge cases (empty input, invalid data, unauthorized access, etc.)

3. **Write the implementation** — create or modify source files to make the tests pass. Follow:
   - The project's existing directory structure and naming conventions
   - Any standards from `spec-bot/standards/` that apply
   - Patterns established by previously implemented tasks in the same feature

4. **Run tests** — execute the project's test command (from `tech-stack.md`). For example:
   - Node/JS: `npm test` or `npx jest [testfile]`
   - Python: `pytest [testfile]`
   - Go: `go test ./...`
   - Rust: `cargo test`

### Step 6: Fix failures (retry loop)

If tests fail:

1. **Read the error output** — identify which tests failed and why.
2. **Fix the code** — update the implementation (not the tests, unless the test itself has a bug).
3. **Re-run the tests**.
4. **Repeat up to 3 times.** If tests still fail after 3 attempts:
   - Save the current state (don't throw away work)
   - Set task status to `"blocked"`
   - Use AskUserQuestion:

```
Task t1 is blocked — tests are failing after 3 fix attempts.

Failing tests:
  - [test name]: [brief error]

Options:
1. Show me the full error output so I can help
2. Skip this task for now, move to the next one
3. Mark as done anyway (tests incomplete)
```

### Step 7: Validate against acceptance criteria

After all tests pass, cross-check each acceptance criterion:

- Go through the `acceptanceCriteria` list one by one
- Verify each is covered by either a test or the implementation logic
- If any criterion is NOT satisfied, go back and implement it before proceeding

### Step 8: Update state

Update `spec-bot/state.json`:

- Set this task's `status` to `"done"`
- Update `updatedAt`
- Check if **all tasks** for this task's feature are now `"done"` — if so, set the feature's `status` to `"done"`

### Step 9: Update context.md

Update `spec-bot/context.md` to reflect current progress: tasks completed, features completed, what's next.

### Step 10: Suggest next step

Use AskUserQuestion:

```
Task t1 — [Name] implemented and verified.

Progress: [X]/[total] tasks done, [Y]/[total] features complete.

Next pending task: t2 — [Name]

Options:
1. Implement next task (t2)
2. Run /test-task to do a deeper test pass
3. Run /list-tasks to see full status
4. Stop here
```

If the user picks **1**, loop back to Step 1 with the next task (no need to re-read all context — just load the next task).
