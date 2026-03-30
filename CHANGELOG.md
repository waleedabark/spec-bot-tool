# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-02-22

### Added

- **Entry point:** `/start-spec-bot` — Single command that asks what to do and routes to plan product, shape spec, feature breakdown, list/store/implement/test task, or inject standards.
- **Workflow commands** (Cursor): `feature-breakdown.md`, `list-tasks.md`, `store-task.md`, `implement-task.md`, `test-task.md` in `templates/cursor/commands/spec-bot/`.
- Workflow rule updated with "Entry point and commands" section referencing `/start-spec-bot` and the full command list.

## [0.3.0] - 2026-02-22

### Changed

- **CLI only copies templates.** Removed `plan`, `spec`, `features`, `task`, `test`, `status` commands. Planning, specs, features, tasks, and tests are done by the AI using the copied .md files.
- `spec-bot init` and `spec-bot generate` only copy from `templates/` (no state loading or dynamic rule generation).
- Workflow rule is a static template; AI reads `spec-bot/state.json` and `spec-bot/context.md` for state.

### Added

- `templates/spec-bot/` — product/, specs/, standards/, state.json, context.md, WORKFLOW.md so the AI has the full structure and instructions.
- Static `templates/cursor/rules/spec-bot-workflow.mdc` (no embedded state).

### Removed

- src/planner.ts, features.ts, specs.ts, tasks.ts, test.ts, state.ts.

## [0.2.0] - 2026-02-22

### Added

- `spec-bot init` (Cursor): full scaffold from templates — `.cursor/rules/README.md` and `.cursor/commands/spec-bot/` with shape-spec, plan-product, inject-standards, index-standards, discover-standards
- `templates/cursor/` shipped in package so init works after `npm install -g spec-bot`

## [0.1.0] - 2026-02-22

### Added

- CLI: `spec-bot init` — select AI tool (Cursor, Claude, GitHub Copilot, .agent) and scaffold folder
- CLI: `spec-bot generate` — regenerate context-aware rules; writes `spec-bot/context.md`
- CLI: `spec-bot plan` — capture product idea (interactive or `--summary` / `--details`)
- CLI: `spec-bot spec [name]` — create spec folder under `spec-bot/specs/`
- CLI: `spec-bot features` — add or list features (`--list`, `--name`, `--description`)
- CLI: `spec-bot task add` / `spec-bot task list` — tasks with use case, acceptance criteria, test cases
- CLI: `spec-bot test` — run project tests and record result; `test record` for manual QA; `test list`
- CLI: `spec-bot status` — show phase and state summary
- File-based state in `spec-bot/state.json` (phase, product idea, features, tasks, test results)
- Cursor rule generation (`.cursor/rules/spec-bot-workflow.mdc`) with embedded state summary
- Project config `.spec-bot.json` (selected AI tool) for non-interactive generate

[Unreleased]: https://github.com/waleedahmad-dev/spec-bot/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/waleedahmad-dev/spec-bot/releases/tag/v0.4.0
[0.3.0]: https://github.com/waleedahmad-dev/spec-bot/releases/tag/v0.3.0
[0.2.0]: https://github.com/waleedahmad-dev/spec-bot/releases/tag/v0.2.0
[0.1.0]: https://github.com/waleedahmad-dev/spec-bot/releases/tag/v0.1.0
