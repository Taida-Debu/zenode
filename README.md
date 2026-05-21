# LazyDev

**Gamified open-source contributions with real rewards**

LazyDev is a platform that turns open-source work into structured daily challenges and pays contributors in **USDC** and **LZD tokens**. Whether you are new to open source or an experienced maintainer, LazyDev helps you learn, ship meaningful work, and earn while contributing to real projects.

## What is LazyDev?

LazyDev makes contributing to open source easier, more rewarding, and community-driven by combining:

- **Daily open-source challenges**
- **Incentives** in USDC and LZD tokens
- **Verida AI-powered project matching**
- **Verifiable contribution history**
- **Anonymous participation**
- **DAO governance** for transparency and fairness

## Smart matching with Verida AI

LazyDev uses **Verida AI** to connect developers with relevant open-source opportunities:

- Automatically **matches your skills** and availability with real projects
- Suggests tasks aligned with your **learning goals and experience level**
- Refines recommendations based on your activity over time

Instead of browsing GitHub issues manually, LazyDev surfaces best-fit work for you through **Verida’s secure data ecosystem**.

## Privacy and identity with Verida

With **Verida**, LazyDev supports:

- **Anonymous participation** via secure, decentralized identity
- Full control over personal data and contribution history
- Verifiable credentials that prove skills and work without exposing unnecessary personal information

## Community governance (DAO)

LazyDev is governed by a **DAO** that supports:

- Transparent, democratic challenge curation
- Fair distribution of rewards
- Community involvement in platform direction and growth

## How it works

1. **Sign in anonymously** via Verida Connect
2. Receive **AI-suggested challenges** based on your skills and goals
3. **Complete tasks** and submit your work
4. **Earn rewards** in USDC and LZD tokens
5. **Build a portfolio** of verifiable, real-world contributions

## Why LazyDev?

| Feature | Benefit |
|--------|---------|
| Verida AI matching | Skill-based project recommendations |
| Token rewards | Compensation in USDC and LZD |
| Anonymous identity | Private, secure contribution model |
| Verifiable portfolio | Credentials backed by decentralized identity |
| DAO governance | Transparent, community-led platform |
| Open-source focus | Measurable impact through real contributions |

## Resources

- [Verida Developer Docs](https://developer.verida.io)
- LazyDev DAO (coming soon)
- Submit a challenge or project (coming soon)

## Monorepo structure

Frontend lives under **`frontend/`** (Turborepo + pnpm):

| App | Path | Package | Port |
|-----|------|---------|------|
| Landing | `frontend/apps/landing` | `@zenode/landing` | 3000 |
| App | `frontend/apps/app` | `@zenode/app` | 3001 |
| Docs | `frontend/apps/docs` | `@zenode/docs` | 3002 |

Shared UI: `frontend/packages/ui` (`@zenode/ui`).

**Docs site** (`apps/docs`, port 3002) is for people **using** LazyDev—challenges, GitHub, rewards—not for cloning the repo. Engineering setup stays in this README and `AGENTS.md`.

### Run locally

With [just](https://github.com/casey/just) (recommended):

```bash
just install
just landing dev    # http://localhost:3000
just app dev        # http://localhost:3001
just docs dev       # http://localhost:3002
just dev            # all three via Turbo
```

Or pnpm from repo root:

```bash
pnpm install
pnpm dev:landing
pnpm dev:app
pnpm dev:docs
```

Copy `frontend/apps/app/.env.example` to `frontend/apps/app/.env`. Cross-app URLs: `NEXT_PUBLIC_LANDING_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_DOCS_URL`.

### Pre-commit checks (Husky)

`pnpm install` enables [Husky](https://typicode.github.io/husky/) via the `prepare` script. Every commit runs **lint**, **typecheck**, and **build** on changed `@zenode/*` packages (full workspace on the first commit).

```bash
pnpm check          # run all three manually (entire frontend)
just check          # same via just
```

To skip hooks temporarily (not recommended): `git commit --no-verify`.

Smart contracts remain in `contract/` (Foundry). See `AGENTS.md` for agent-oriented commands.

## Contributing

We welcome contributors and collaborators who want to improve LazyDev or propose projects for challenges. Open an issue in this repository or reach out to the maintainers.

For questions, partnerships, or feedback, contact the project maintainers via GitHub issues.

---

**LazyDev** — Open-source contributions with AI matching, privacy-preserving identity, and on-chain rewards.
