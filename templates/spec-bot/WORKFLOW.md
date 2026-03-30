# Spec-bot Workflow Reference

This is the detailed reference for the spec-bot workflow. The `.cursor/rules/spec-bot-workflow.mdc` file is the concise version that the AI reads on every chat. This file provides full detail for anyone reviewing the process.

## Pipeline overview

```
/plan-product → /feature-breakdown → /store-task → /scaffold-project → /implement-all → /validate-project
```

Each step builds on the previous. The AI follows this pipeline to go from a product idea to a working, tested codebase.

## Phases

The `phase` field in `spec-bot/state.json` tracks progress:

```
planning → features → tasks → implementing → qa → done
```

| Phase | What happened | What's next |
|-------|--------------|-------------|
| `planning` | Product docs created (mission, roadmap, tech stack) | /feature-breakdown |
| `features` | Features defined in state.json | /store-task |
| `tasks` | Tasks auto-generated for all features | /scaffold-project |
| `implementing` | Project scaffolded, tasks being built | /implement-task or /implement-all |
| `qa` | All tasks implemented, running tests/validation | /test-task, /validate-project |
| `done` | All tasks verified, project complete | Ship it or plan Phase 2 |

## Commands and prerequisites

| Command | Purpose | Requires |
|---------|---------|----------|
| /start-spec-bot | Entry point — detects phase, suggests next step | (none) |
| /plan-product | Define mission, roadmap, tech stack | (none) |
| /shape-spec | Create detailed spec for a complex feature | (none, but product docs help) |
| /feature-breakdown | Convert product idea into features | Product docs |
| /store-task | Auto-generate tasks for all features | Features in state |
| /scaffold-project | Generate project structure from tech stack | tech-stack.md |
| /list-tasks | Show tasks with progress dashboard | (none) |
| /implement-task | Implement one task (auto-selects next pending) | Tasks + scaffold |
| /implement-all | Implement all pending tasks autonomously | Tasks + scaffold |
| /test-task | Run and verify tests for a task | At least one "done" task |
| /validate-project | End-to-end validation | At least one "done" task |
| /inject-standards | Add standards to context | Standards exist |
| /discover-standards | Extract codebase patterns into standards | Existing codebase |
| /index-standards | Rebuild the standards index | Standards files exist |

## State schema

`spec-bot/state.json`:

```json
{
  "version": 1,
  "phase": "planning",
  "updatedAt": "2026-02-22T12:00:00.000Z",
  "features": [
    { "id": "f1", "name": "Feature name", "description": "...", "status": "pending" }
  ],
  "tasks": [
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
  ],
  "testResults": [
    {
      "taskId": "t1",
      "passed": true,
      "runAt": "2026-02-22T12:00:00.000Z",
      "testsRun": 5,
      "testsPassed": 5,
      "coverageGaps": [],
      "output": "..."
    }
  ]
}
```

### Status values

**Features:** `pending` → `in-progress` → `done`

**Tasks:** `pending` → `in-progress` → `done` → `verified` (or `blocked` / `failed`)

## File structure

```
spec-bot/
├── state.json              # Source of truth for phase, features, tasks, results
├── context.md              # Short summary for cross-chat context
├── WORKFLOW.md             # This file
├── product/
│   ├── mission.md          # Problem, users, solution
│   ├── roadmap.md          # MVP and post-launch features
│   └── tech-stack.md       # Languages, frameworks, test runner
├── specs/
│   └── YYYY-MM-DD-HHMM-slug/
│       ├── plan.md         # Implementation plan
│       ├── shape.md        # Shaping notes and decisions
│       ├── standards.md    # Applicable standards
│       ├── references.md   # Code references
│       └── visuals/        # Mockups, screenshots
└── standards/
    ├── index.yml           # Standard descriptions for quick matching
    └── [folder]/[name].md  # Individual standard files
```

## SDLC roles

The AI applies these roles when relevant:

- **Project Manager** — during /plan-product, /feature-breakdown (scoping, prioritization)
- **Solution Architect** — during /shape-spec, /scaffold-project (technical decisions)
- **Developer** — during /implement-task, /implement-all (writing code)
- **QA** — during /test-task, /validate-project (testing and verification)
- **Designer** — when specs include UI/UX considerations
