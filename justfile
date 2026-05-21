# LazyDev monorepo — run from repo root
# Usage: just app dev | just landing dev | just docs build

set shell := ["bash", "-cu"]

default:
    @just --list

# --- Workspace ---

install:
    pnpm install

dev:
    pnpm dev

build:
    pnpm build

lint:
    pnpm lint

typecheck:
    pnpm typecheck

check:
    pnpm check

# --- Per-app commands (mode: dev | build | start | lint) ---

app mode:
    pnpm --filter @zenode/app {{mode}}

landing mode:
    pnpm --filter @zenode/landing {{mode}}

docs mode:
    pnpm --filter @zenode/docs {{mode}}

# --- Contracts (Foundry) ---

contract-build:
    cd contract && forge build

contract-test:
    cd contract && forge test --no-match-path 'lib/**'

anvil:
    cd contract && anvil
