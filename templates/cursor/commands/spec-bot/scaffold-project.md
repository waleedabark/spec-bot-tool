# Scaffold Project

Generate the initial project structure — directories, config files, dependency manifests, and boilerplate — based on the tech stack and features.

## Important Guidelines

- **The AI generates the scaffold autonomously** from `tech-stack.md`, features, and the roadmap.
- **Only ask the user for confirmation** before creating files, or when a structural decision has multiple valid approaches.
- **Always use AskUserQuestion tool** when asking the user anything.
- **Never overwrite existing files** — if a project already has structure, augment it, don't replace it.

## When to Run

- After `/store-task` and before the first `/implement-task`
- When `/implement-task` detects no project structure exists
- Manually, when the user wants to reset or extend the project skeleton

## Process

### Step 1: Load context

Read all of the following:

- `spec-bot/product/tech-stack.md` — languages, frameworks, test libraries, package manager
- `spec-bot/product/mission.md` — product type (web app, API, CLI, library, etc.)
- `spec-bot/product/roadmap.md` — scope of MVP features
- `spec-bot/state.json` — features and tasks (to inform directory structure)
- `spec-bot/specs/` — any spec files with architectural decisions

If `tech-stack.md` is missing or just has placeholders, stop:

```
No tech stack defined. Run /plan-product first to set up the tech stack, then re-run /scaffold-project.
```

### Step 2: Scan existing project

Check the workspace root for existing project files:

- Dependency manifests (`package.json`, `requirements.txt`, `pyproject.toml`, `Cargo.toml`, `go.mod`, etc.)
- Config files (`.eslintrc`, `tsconfig.json`, `.prettierrc`, `pytest.ini`, etc.)
- Source directories (`src/`, `app/`, `lib/`, `tests/`, etc.)
- Git files (`.gitignore`)

If a project structure already exists, note what's there and only generate what's missing.

### Step 3: Plan the scaffold

Based on the tech stack, generate a project structure plan. Adapt to the specific stack:

**Example for a Node.js/React project:**

```
Project scaffold plan:

  package.json          — dependencies, scripts (dev, build, test, lint)
  tsconfig.json         — TypeScript configuration
  .gitignore            — node_modules, dist, .env, etc.
  .eslintrc.json        — linting rules
  .prettierrc           — formatting rules

  src/
    index.ts            — entry point
    app.ts              — app setup (Express/Fastify/etc. if backend)
    routes/             — API routes (one file per resource)
    components/         — React components (if frontend)
    lib/                — shared utilities
    types/              — TypeScript type definitions

  tests/
    setup.ts            — test configuration
    (test files mirror src/ structure)

  .env.example          — environment variable template (no secrets)

Already exists (will not overwrite):
  - [list any existing files]

New files to create: [N]
```

**Example for a Python project:**

```
Project scaffold plan:

  pyproject.toml        — project metadata, dependencies
  requirements.txt      — pinned dependencies
  .gitignore            — __pycache__, .venv, .env, etc.

  src/
    __init__.py
    main.py             — entry point
    routes/             — API routes (if web)
    models/             — data models
    services/           — business logic
    utils/              — shared utilities

  tests/
    conftest.py         — pytest fixtures
    __init__.py

  .env.example          — environment variable template
```

Adjust the structure based on:
- The framework being used (Next.js vs Express vs Django vs Flask, etc.)
- Whether it's frontend, backend, fullstack, CLI, or library
- The features defined in state.json (create feature-specific directories if appropriate)

### Step 4: Confirm with user

Use AskUserQuestion to present the plan:

```
Here's the project scaffold based on your tech stack ([stack summary]):

[structure plan from Step 3]

Options:
1. Create all files
2. Let me review the details first (shows file contents)
3. Adjust (tell me what to change)
4. Cancel
```

- If **1**, proceed to Step 5.
- If **2**, show the proposed content for each file, then ask "Create all / Adjust / Cancel."
- If **3**, use AskUserQuestion to get feedback, adjust the plan, re-confirm.
- If **4**, stop.

### Step 5: Create the scaffold

Create each file with sensible defaults:

**Dependency manifest** — include:
- The framework and core libraries from tech-stack.md
- Test framework as a dev dependency
- Linter/formatter as dev dependencies
- Scripts for dev, build, test, lint

**Config files** — use standard/recommended settings for the chosen framework. Keep configs minimal — don't over-configure.

**Source files** — create minimal entry points and placeholder modules. Each file should:
- Have the correct imports/exports for the framework
- Be syntactically valid and runnable
- Contain minimal boilerplate (not full feature code — that's for `/implement-task`)

**Test setup** — configure the test framework so `npm test` / `pytest` / etc. works out of the box, even if no real tests exist yet.

**.gitignore** — appropriate ignores for the language and framework.

**.env.example** — list expected environment variables with placeholder values. NEVER put real secrets in this file.

### Step 6: Install dependencies

Run the package manager's install command:

- `npm install` (Node.js)
- `pip install -r requirements.txt` or `pip install -e .` (Python)
- `cargo build` (Rust)
- `go mod tidy` (Go)

Verify the install succeeds. If it fails, fix the dependency manifest and retry.

### Step 7: Verify the scaffold

Run a basic smoke test to verify the scaffold works:

1. **Syntax check** — does the project compile/parse without errors?
2. **Test runner** — does the test command execute (even with 0 tests)?
3. **Dev server** — does the dev command start without crashing? (start and immediately stop — don't leave it running)

If any check fails, fix the issue before proceeding.

### Step 8: Update state

Update `spec-bot/state.json`:
- Set `phase` to `"implementing"` (scaffold is the bridge between tasks and implementation)
- Update `updatedAt`

Update `spec-bot/context.md` with: "Project scaffolded with [stack]. Ready for implementation."

### Step 9: Confirm and suggest next step

Use AskUserQuestion:

```
Project scaffolded successfully.

Created [N] files. Test runner verified.

Next: Run /implement-task to start building, or /list-tasks to review what to implement first.
```
