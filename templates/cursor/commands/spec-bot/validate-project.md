# Validate Project

Run end-to-end validation of the full project: test suite, lint checks, acceptance criteria cross-check, and produce a final status report.

## Important Guidelines

- **The AI runs all checks autonomously** — no user input needed until the final report.
- **Only ask the user** when validation is complete (to report results) or if a critical blocker is found.
- **Always use AskUserQuestion tool** when asking the user anything.

## When to Run

- After `/implement-all` completes
- After all tasks have been individually tested with `/test-task`
- As a final gate before considering the project "done"

## Process

### Step 1: Load full context

Read all of the following:

- `spec-bot/state.json` — tasks, features, testResults, phase
- `spec-bot/product/tech-stack.md` — test command, lint command, build command
- `spec-bot/product/mission.md` — to validate the product meets its stated goals
- `spec-bot/product/roadmap.md` — to verify MVP scope is covered

### Step 2: Run the full test suite

Execute the project's test command (detected from `tech-stack.md` and project root):

- `npm test` / `npx jest` / `npx vitest run`
- `pytest`
- `go test ./...`
- `cargo test`

Capture: exit code, total tests, passed, failed, output.

If the test command fails to execute (not found, config error), attempt to fix the config and retry once.

### Step 3: Run lint/type checks

If the project has a linter or type checker configured, run it:

- `npx eslint .` or `npm run lint`
- `npx tsc --noEmit` (TypeScript)
- `flake8` / `ruff` / `mypy` (Python)
- `cargo clippy` (Rust)
- `go vet ./...` (Go)

Capture: error count, warning count. If warnings only (no errors), that's a pass.

If no linter is configured, skip this step and note it.

### Step 4: Run build check

If the project has a build step, run it:

- `npm run build`
- `cargo build --release`
- `go build ./...`

Verify it completes without errors. If no build step exists, skip.

### Step 5: Cross-check acceptance criteria

For each task in `state.tasks`:

1. Read the task's `acceptanceCriteria`.
2. Check if there's a passing test result in `testResults` for this task.
3. For each criterion, verify it's covered by:
   - A passing test, OR
   - Implemented code that demonstrably satisfies it (read the relevant source files).

Produce a coverage matrix:

```
Acceptance Criteria Coverage:

  t1 — Implement login form
    [pass] Login form renders with email and password fields
    [pass] Form validates email format
    [pass] Submitting calls the auth API
    [gap]  Error message shown on invalid credentials

  t2 — Add session persistence
    [pass] Session token stored after login
    [pass] User stays logged in on refresh
```

### Step 6: Check feature completeness

For each feature in `state.features`:

1. Are all its tasks `"done"` or `"verified"`?
2. Does the feature's scope (from the description and any related spec) appear to be fully covered?

### Step 7: Compile the validation report

Produce a comprehensive report and use AskUserQuestion:

```
Validation Report
=================

Test Suite:    [PASS/FAIL] — [X]/[Y] tests passing
Lint Check:    [PASS/FAIL/SKIPPED] — [N] errors, [M] warnings
Build Check:   [PASS/FAIL/SKIPPED]
Acceptance:    [X]/[Y] criteria covered ([Z] gaps)

Feature Status:
  [done]     f1 — Authentication (3/3 tasks verified)
  [done]     f2 — Dashboard (2/2 tasks verified)
  [partial]  f3 — Settings (1/2 tasks verified, 1 blocked)

Issues Found:
  1. [issue description — e.g. "t4 acceptance criterion 2 has no test coverage"]
  2. [issue description]

Overall: [PASS / FAIL — N issues to resolve]

Options:
1. Fix the issues (I'll address them now)
2. Accept as-is — mark project as done
3. Show detailed output for failing checks
```

### Step 8: Fix issues (if requested)

If the user picks **1**:

1. For each issue, determine the fix (missing test, implementation gap, lint error).
2. Apply fixes.
3. Re-run the failing checks.
4. Update the report.

### Step 9: Finalize

When the user accepts (or all issues are fixed):

- Set `phase` to `"done"` in `state.json`
- Set all verified tasks' features to `"done"` (if not already)
- Update `updatedAt`
- Update `spec-bot/context.md`:

```
Phase: done
Product: [one-line description]
Features: [N] features complete
Tasks: [N] tasks verified
Validation: Passed on [date]
```

Use AskUserQuestion:

```
Project validated and marked as done.

Summary: [N] features, [M] tasks, [X] tests passing.

To continue development:
  - Run /plan-product to update the roadmap for Phase 2
  - Run /feature-breakdown to add new features
  - Run /store-task to generate tasks for new features
```
