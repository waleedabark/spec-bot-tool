# List Tasks

Show a progress dashboard of all tasks from `spec-bot/state.json`, optionally filtered by feature.

## Process

### Step 1: Read state

Read `spec-bot/state.json`. If missing or no `tasks` array, report:

```
No tasks yet. Run /store-task to generate tasks, or /feature-breakdown first to define features.
```

Also read `spec-bot/state.json` → `features` and `testResults` to provide full context.

### Step 2: Show progress summary

Output a dashboard header with overall progress:

```
Project Progress
================

Phase: [current phase]
Features: [done]/[total] complete
Tasks:    [done]/[total] complete ([verified] verified, [blocked] blocked)

  [====>           ] 30%
```

The progress bar is a simple ASCII visualization: `=` for completed, `>` for current position, spaces for remaining.

### Step 3: Optional filter

If the user passed an argument (e.g. `/list-tasks f1`), filter tasks where `task.featureId` matches. Otherwise list all.

### Step 4: Show tasks grouped by feature

Output tasks grouped by feature with clear status indicators:

```
[f1] Authentication — in-progress (2/3 tasks done)
  [done]     t1  Implement login form
  [done]     t2  Add session persistence
  [pending]  t3  Password reset flow

[f2] Dashboard — pending (0/2 tasks done)
  [pending]  t4  Build dashboard layout
  [pending]  t5  Add data widgets

[f3] Settings — done (2/2 tasks done)
  [verified] t6  User profile editing
  [verified] t7  Notification preferences
```

Status indicators:
- `[pending]` — not started
- `[in-progress]` — currently being implemented
- `[done]` — implemented, awaiting test verification
- `[verified]` — implemented and tests passing
- `[blocked]` — failed after retries, needs attention
- `[failed]` — tests failing

### Step 5: Highlight blockers

If any tasks have status `"blocked"` or `"failed"`, call them out:

```
Needs attention:
  t3 [blocked] — Password reset flow (failed after 3 retries)
  t5 [failed]  — Add data widgets (tests failing)
```

### Step 6: Suggest next step

Based on the current state, suggest the most useful action:

- If pending tasks exist and scaffold exists: "Run /implement-task to work on [next pending task], or /implement-all to build everything."
- If pending tasks exist but no scaffold: "Run /scaffold-project first, then /implement-all."
- If done tasks need testing: "Run /test-task to verify [task]."
- If blocked tasks exist: "Run /implement-task [blocked task id] to retry."
- If all verified: "All tasks verified. Run /validate-project for final checks."
