# Zenode issue backlog

Source-of-truth markdown for GitHub issues:

- `frontend-issues.md` — 100 frontend tasks (`@zenode/app`)
- `smart-contract-issues.md` — 100 contract tasks (`contract/`)

## Sync to GitHub

Requires [GitHub CLI](https://cli.github.com/) (`gh auth login`). The sync script lives under `scripts/` (gitignored, local only). Copy or keep it locally if you need to re-run:

```bash
# Preview what would be created (no API writes)
node scripts/sync-github-issues.mjs --dry-run

# Create issues (skips IDs in sync-config.json excluded list)
node scripts/sync-github-issues.mjs

# Force re-create even if local sync state exists
node scripts/sync-github-issues.mjs --force
```

Labels are mapped to GitHub as:

| Backlog type | GitHub labels |
|--------------|---------------|
| Bug / fix | `bug`, `fix` |
| New feature | `enhancement`, `new feature` |
| Smart contract work | `smart-contract`, `contract` |
| Frontend work | `frontend` |

Issues are created **without assignees** — assign people on GitHub manually when ready.

Each issue includes a **Monorepo workspace** block and **Pull requests → `staging`** note. Paths use `frontend/apps/app/src/...` (not legacy `frontend/src/...`).

To refresh GitHub bodies after editing markdown locally:

```bash
node scripts/normalize-issue-markdown.mjs
node scripts/push-issue-bodies-to-github.mjs
```

## Excluded (already implemented)

See `sync-config.json` → `excluded.frontend` for issue numbers removed from sync because the work already landed in the monorepo.

Re-audit before each sync; update exclusions when scope is only partially done.

## Git hygiene

- **Do not** gitignore `.husky/` — hooks must be committed so `pnpm prepare` / pre-commit works for everyone. Ignoring Husky breaks pre-commit for every clone; only `node_modules/` (where the `husky` package lives) stays ignored.
- **Do** gitignore `.next/`, `node_modules/`, `.pnpm-store/` (see root `.gitignore`).
- **Git LFS** (optional): install once with `brew install git-lfs && git lfs install`, then commit `.gitattributes`. Not required for normal JS/Solidity work.

## After changing exclusions

Edit `sync-config.json`, then re-run the sync script. Already-created GitHub issues are tracked in `issues/.sync-state.json` (gitignored); use `--force` only if you intend to duplicate issues.
