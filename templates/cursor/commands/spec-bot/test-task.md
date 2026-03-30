# Test Task

Run tests for a task (or all tasks), validate against acceptance criteria, and record results in `spec-bot/state.json`.

## Important Guidelines

- **The AI drives testing autonomously** — detect the test framework, run the right command, analyze results, attempt fixes on failure.
- **Only ask the user** when tests fail repeatedly and the AI cannot resolve the issue.
- **Always use AskUserQuestion tool** when asking the user anything.

## Process

### Step 1: Load context

Read all of the following:

- `spec-bot/state.json` — tasks, features, testResults
- `spec-bot/product/tech-stack.md` — to determine the test framework and test command

**Detect the test command** from `tech-stack.md` and the project root:

| Indicator | Test command |
|-----------|-------------|
| `package.json` with jest/vitest/mocha | `npm test` or `npx jest` / `npx vitest` |
| `pytest.ini` / `pyproject.toml` / Python project | `pytest` |
| `Cargo.toml` | `cargo test` |
| `go.mod` | `go test ./...` |
| `Gemfile` with rspec | `bundle exec rspec` |

If the test command cannot be determined, use AskUserQuestion:

```
I couldn't detect your test framework. What command runs your tests?
(e.g. npm test, pytest, go test ./...)
```

### Step 2: Select task to test

**Default behavior:** Auto-select the most recently implemented task — the task with `status: "done"` that does NOT yet have a passing entry in `testResults`, or the task that was just implemented in the current session.

If the user passed an argument:
- `/test-task t3` — test task t3 specifically
- `/test-task all` — run the full test suite

If no "done" tasks exist without test results, use AskUserQuestion:

```
All implemented tasks already have test results. What would you like to do?

1. Re-test a specific task (t1, t2, ...)
2. Run the full test suite
3. Cancel
```

### Step 3: Run tests

**For a specific task:**

1. Read the task's `testCases` field to identify the test file or test names.
2. Run the test command scoped to that task's tests. Examples:
   - Jest: `npx jest --testPathPattern="[test-file]"`
   - Pytest: `pytest [test-file] -v`
   - Go: `go test -run [TestName] ./...`
3. If no `testCases` or test file path is stored, search for test files related to the task name and run those.

**For "all":**

Run the full test suite command (e.g. `npm test`, `pytest`, `go test ./...`).

Capture: exit code, stdout, stderr. Truncate output if longer than 200 lines (keep last 200).

### Step 4: Analyze results

**If tests pass (exit code 0):**

1. Cross-check against the task's `acceptanceCriteria`:
   - For each criterion, verify it is covered by at least one passing test or is demonstrably satisfied by the implementation.
   - If a criterion is NOT covered by any test, note it as a gap.

2. If all criteria are covered, proceed to Step 6 (record results).
3. If gaps exist, report them:

```
Tests pass but these acceptance criteria lack test coverage:
  - [criterion without a test]

Options:
1. Add missing tests and re-run
2. Accept as-is (criteria met by implementation, not by test)
3. Skip for now
```

If the user picks **1**, write the missing tests, run them, and loop back.

**If tests fail:**

Proceed to Step 5.

### Step 5: Fix and retry (up to 3 attempts)

On test failure:

1. **Analyze the error output** — identify which tests failed and the root cause (wrong assertion, missing function, import error, runtime error, etc.).
2. **Determine if it's a test bug or implementation bug:**
   - If the test expectation is wrong (doesn't match the acceptance criteria), fix the test.
   - If the implementation is wrong, fix the implementation.
3. **Apply the fix** and re-run the tests.
4. **Repeat up to 3 times.**

If tests still fail after 3 attempts:

- Set the task's `status` to `"failed"`
- Use AskUserQuestion:

```
Tests for t[X] are still failing after 3 fix attempts.

Last failure:
  [test name]: [brief error message]

Full output saved to testResults.

Options:
1. Show full error output so I can investigate further
2. Skip this task, continue to next
3. I'll fix it manually — mark as needs-review
```

### Step 6: Record results

Read `spec-bot/state.json`. Ensure `testResults` is an array. Append (or update if an entry for this taskId already exists):

```json
{
  "taskId": "t1",
  "passed": true,
  "runAt": "2026-02-22T12:00:00.000Z",
  "testsRun": 5,
  "testsPassed": 5,
  "coverageGaps": [],
  "output": "optional truncated output (last 50 lines if long)"
}
```

For "all" runs, use `taskId: "_full_suite"`.

Update state:
- Set `updatedAt` to current ISO timestamp
- Set `phase` to `"qa"`
- If the task passed, set its `status` to `"verified"`
- If all tasks across all features are `"verified"`, set `phase` to `"done"`

### Step 7: Update context.md

Update `spec-bot/context.md` with test progress: "QA: X/Y tasks verified, Z failing."

### Step 8: Report and suggest next step

Use AskUserQuestion:

```
Test results for t1 — [Name]: PASSED ([N] tests)

Progress: [X]/[total] tasks verified

Next: [suggest based on state]
  - If more tasks need testing: "Run /test-task to test the next task (t[N])"
  - If all tasks verified: "All tasks verified! Run /validate-project for final checks."
  - If some tasks still pending implementation: "Run /implement-task to continue building."
```
