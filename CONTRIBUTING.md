# Contributing to LazyDev (Zenode)

Thank you for contributing. This repository is a **monorepo** — always confirm which workspace your issue targets before opening a PR.

## Branch workflow

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready releases |
| `staging` | Integration branch — **open all PRs here** |
| `dev` | Active development; merges into `staging` |

```text
feature/your-change  →  staging  →  main
```

1. Branch from **`staging`** (or `dev` if coordinating with the core team).
2. Open the PR against **`staging`**.
3. Maintainers merge `staging` → `main` for releases.

## Monorepo layout

```text
zenode/
├── frontend/                 # Turborepo (pnpm)
│   ├── apps/
│   │   ├── landing/        @zenode/landing   http://localhost:3000
│   │   ├── app/              @zenode/app       http://localhost:3001  ← main product UI
│   │   └── docs/             @zenode/docs      http://localhost:3002
│   └── packages/
│       └── ui/               @zenode/ui        shared components & styles
├── contract/                 Foundry / Solidity
└── issues/                   Local backlog markdown (reference only)
```

### Where to work

| Work type | Path | Package |
|-----------|------|---------|
| Dashboard, playground, wallet, API routes | `frontend/apps/app/` | `@zenode/app` |
| Marketing / landing pages | `frontend/apps/landing/` | `@zenode/landing` |
| Product documentation site | `frontend/apps/docs/` | `@zenode/docs` |
| Shared nav, footer, UI primitives | `frontend/packages/ui/` | `@zenode/ui` |
| Smart contracts | `contract/` | — |

Legacy paths like `frontend/src/...` in old notes refer to **`frontend/apps/app/src/...`** after the monorepo split.

## Local setup

From the repo root (requires Node ≥ 20.9, pnpm, optional [just](https://github.com/casey/just)):

```bash
just install          # or: pnpm install (from frontend/)
just app dev          # http://localhost:3001
just landing dev      # http://localhost:3000
just docs dev         # http://localhost:3002
```

Copy `frontend/apps/app/.env.example` → `frontend/apps/app/.env` for wallet and API keys.

### Quality checks (pre-commit)

Husky runs on commit:

```bash
pnpm turbo run lint typecheck build --filter=...[HEAD]
```

Run manually from `frontend/`:

```bash
pnpm check
```

### Contracts

```bash
cd contract
forge build
forge test --no-match-path 'lib/**'
```

## Pull requests

- **Base branch:** `staging`
- Link the GitHub issue (`Fixes #123` or `Closes #123`)
- Keep changes scoped to one workspace when possible
- Do not commit `.env`, `.next/`, `node_modules/`, or `issues/.sync-state.json`
- Update docs in `frontend/apps/docs/` only for user-facing product changes

## Issues

GitHub issues are tracked in [Taida-Debu/zenode](https://github.com/Taida-Debu/zenode/issues). Each issue should name the monorepo workspace (`@zenode/app`, `contract/`, etc.). If an issue lists outdated paths, follow the table above.

Questions: open a GitHub issue or discussion on the repo.
