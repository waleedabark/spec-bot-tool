# Contributing to spec-bot

Thanks for your interest in contributing.

## Development setup

1. Fork and clone the repo.
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Run the CLI: `node dist/cli.js --help` or `npm link` to use your clone as the global `spec-bot`.

## Making changes

- Use TypeScript; keep the code in `src/`.
- Add or update tests if you add behavior (test setup can be added later).
- Run `npm run build` before committing to ensure the project compiles.

## Submitting changes

- Open an issue first for larger changes to discuss the approach.
- Use a feature branch and open a pull request against the default branch.
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Release

Maintainers: bump version in `package.json`, update `CHANGELOG.md`, then tag and publish.
