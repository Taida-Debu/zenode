# Frontend (Turborepo)

All web apps live under this directory:

```
frontend/
├── apps/
│   ├── landing/   @zenode/landing   → http://localhost:3000
│   ├── app/       @zenode/app       → http://localhost:3001
│   └── docs/      @zenode/docs      → http://localhost:3002
└── packages/
    └── ui/        @zenode/ui        shared components & styles
```

## Commands (from repo root)

Using [just](https://github.com/casey/just):

```bash
just install
just landing dev
just app dev
just docs dev
just dev          # all three via Turbo
```

Or pnpm:

```bash
pnpm install
pnpm dev:landing
pnpm dev:app
pnpm dev:docs
```

Copy `apps/app/.env.example` → `apps/app/.env` for API keys and wallet config.

## Documentation site (`apps/docs`)

Product guides for contributors and maintainers (getting started, features, challenges, GitHub, FAQ) at port **3002**. Repo setup and env vars stay in the root `README.md` / `AGENTS.md`, not on the docs site.
