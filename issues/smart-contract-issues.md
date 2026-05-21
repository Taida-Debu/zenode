# Smart Contract Issues — LazyDev Platform

This document contains 100 tracked issues for the LazyDev smart contract system. Contracts are built with Solidity 0.8.28, Foundry (forge/anvil), OpenZeppelin, and LayerZero v2.

---

### Issue #1: Uninitialized `claim` Variable in Entry Contract

**Labels:** `smart-contract`, `priority: critical`, `bug`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The `Entry` contract declares `ClaimLogic claim;` but never assigns it in the constructor or elsewhere. When `claimXp()` is called, the low-level `.call()` targets `address(0)`, which silently succeeds without executing any logic, allowing users to arbitrarily inflate their XP.

**Scope:**
- Initialize `claim` in the `Entry` constructor by deploying or passing a `ClaimLogic` address
- Add a zero-address check to prevent calls to unset `claim`

**Acceptance Criteria:**
- [ ] `claim` is assigned a valid address during construction
- [ ] Calling `claimXp()` before `claim` is set reverts with a descriptive error
- [ ] Unit test confirms XP is only added after successful claim logic execution

**Files likely affected:**
- `contract/src/core/entry.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #2: Copy-Paste Bug in CreationFactory — Challenges Pushed to Competitions Array

**Labels:** `smart-contract`, `priority: critical`, `bug`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
In `CreationFactory.cloneChallenge()`, the newly cloned challenge address is pushed into `competitions` instead of `challenges`. This means `lookUpChallenge()` returns stale/empty data, and `competitions` contains mixed contract types.

**Scope:**
- Change `competitions.push(newChallenge)` to `challenges.push(newChallenge)` on line 41
- Add a test that verifies challenges and competitions arrays are properly separated

**Acceptance Criteria:**
- [ ] `cloneChallenge()` pushes to the `challenges` array
- [ ] `lookUpChallenge(_id)` returns the correct challenge address
- [ ] Existing `lookUpCompetition()` is unaffected

**Files likely affected:**
- `contract/src/core/CreationFactory.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #3: `entry` Never Assigned in ChallengeImplementation.initialize()

**Labels:** `smart-contract`, `priority: critical`, `bug`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`ChallengeImplementation` declares `Entry entry;` but the `initialize()` function only sets `id` and `owner`. When a user solves a challenge, `entry.addToUserXP()` will revert with an EVM call to `address(0)`, permanently breaking reward distribution.

**Scope:**
- Add `address _entry` parameter to `initialize()`
- Assign `entry = Entry(_entry)` in the function body
- Update `CreationFactory` to pass the entry address when initializing clones

**Acceptance Criteria:**
- [ ] `initialize()` accepts and sets the `entry` address
- [ ] `submitChallengeFlag()` successfully calls `entry.addToUserXP()`
- [ ] Factory passes a valid entry address during clone initialization

**Files likely affected:**
- `contract/src/core/challenge.sol`
- `contract/src/core/CreationFactory.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #4: `entry` and `xpToken` Never Wired in CompetitionImplementation

**Labels:** `smart-contract`, `priority: critical`, `bug`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`CompetitionImplementation` has `Entry entry;` and `LD xpToken;` that are only set in the constructor, but cloned proxies never call the constructor. The `initialize()` function does not set these references, so `submitFlag()` and XP rewards will always revert on clones.

**Scope:**
- Add `address _entry` and `address _xpToken` parameters to `initialize()`
- Assign both in the function body
- Update `CreationFactory.cloneCompetition()` to pass these addresses

**Acceptance Criteria:**
- [ ] Cloned competitions have valid `entry` and `xpToken` references
- [ ] `submitFlag()` can call `entry.addToUserXP()` without reverting
- [ ] XP token transfers work in competition clones

**Files likely affected:**
- `contract/src/core/competition.sol`
- `contract/src/core/CreationFactory.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #5: Inverted Threshold Check in Dao.executeProposal()

**Labels:** `smart-contract`, `priority: critical`, `bug`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`executeProposal()` requires `proposal.voteCount < MAX_NEEDED_TO_EXECUTE`, meaning proposals can only execute if they have *fewer* votes than the threshold. This inverts the intended governance logic — proposals with sufficient support are rejected while unsupported proposals pass.

**Scope:**
- Change the require to `proposal.voteCount >= MAX_NEEDED_TO_EXECUTE`
- Add descriptive error message to the require statement

**Acceptance Criteria:**
- [ ] Proposals execute only when voteCount >= threshold
- [ ] Proposals with insufficient votes revert with a clear message
- [ ] Unit test confirms both cases

**Files likely affected:**
- `contract/src/core/Dao.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #6: LD Token Constructor Never Mints Despite Taking `initialMintAmount`

**Labels:** `smart-contract`, `priority: critical`, `bug`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The `LD` contract constructor accepts `uint256 initialMintAmount` but the function body is empty — no `_mint()` call is made. The deploy script passes a large mint amount that is silently ignored, resulting in zero token supply at deployment.

**Scope:**
- Add `_mint(_delegate, initialMintAmount)` inside the constructor body
- Add a post-deployment assertion in the deploy script

**Acceptance Criteria:**
- [ ] LD token has `initialMintAmount` supply after deployment
- [ ] Tokens are minted to the delegate address
- [ ] Deploy script logs confirm non-zero total supply

**Files likely affected:**
- `contract/src/core/LD.sol`
- `contract/script/deploycontracts.s.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #7: Unchecked ERC20 Transfers in CompetitionImplementation

**Labels:** `smart-contract`, `priority: critical`, `bug`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`CompetitionImplementation` uses `usdc.transferFrom()` without checking the return value or using SafeERC20. Many ERC20 tokens (including some USDC implementations) return false on failure instead of reverting, which would silently fail prize distribution.

**Scope:**
- Import and use OpenZeppelin's `SafeERC20` library
- Replace all `usdc.transferFrom()` calls with `usdc.safeTransferFrom()`
- Replace `xpToken.transferFrom()` with safe variant

**Acceptance Criteria:**
- [ ] All ERC20 transfers use SafeERC20 wrappers
- [ ] Failed transfers revert instead of silently succeeding
- [ ] No unchecked `.transfer()` or `.transferFrom()` calls remain

**Files likely affected:**
- `contract/src/core/competition.sol`
- `contract/src/core/challenge.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #8: Interface Mismatch — IChallengeImplementation Does Not Match ChallengeImplementation

**Labels:** `smart-contract`, `priority: critical`, `bug`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`IChallengeImplementation` declares `submitFlag(bytes32)` but the actual implementation has `submitChallengeFlag(bytes32)`. The interface also exposes `owner()` as a function but it's a private state variable. ConnectLogic uses this interface to call `challenge()` which returns a tuple, but the struct getter returns differently.

**Scope:**
- Rename `submitChallengeFlag` to `submitFlag` in the implementation, or update the interface
- Fix the `owner()` visibility or remove it from the interface
- Ensure `challenge()` getter return signature matches the interface

**Acceptance Criteria:**
- [ ] Interface function signatures exactly match implementation
- [ ] ConnectLogic can successfully call through IChallengeImplementation
- [ ] Compilation succeeds without warnings

**Files likely affected:**
- `contract/src/interface/IChallengeImpl.sol`
- `contract/src/core/challenge.sol`
- `contract/src/Lib/ConnectLogic.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #9: `LDGov` Token Never Initialized in Dao Constructor

**Labels:** `smart-contract`, `priority: critical`, `bug`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The `Dao` contract declares `IERC20 LDGov;` but never assigns it. The `vote()` function calls `LDGov.transferFrom()` which will revert on address(0). Users cannot vote on any proposal, completely breaking governance.

**Scope:**
- Add `address _ldGov` parameter to the Dao constructor
- Assign `LDGov = IERC20(_ldGov)` in the constructor body
- Update deploy script to pass the governance token address

**Acceptance Criteria:**
- [ ] `LDGov` is set to a valid ERC20 address at deployment
- [ ] `vote()` successfully transfers governance tokens
- [ ] Deploy script passes governance token address to Dao constructor

**Files likely affected:**
- `contract/src/core/Dao.sol`
- `contract/script/deploycontracts.s.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #10: Competition `rewardCompetition()` Uses `transferFrom` Instead of `transfer`

**Labels:** `smart-contract`, `priority: critical`, `bug`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`rewardCompetition()` uses `usdc.transferFrom(address(this), winner, amount)` but the contract cannot approve itself for transferFrom. The contract already holds the USDC (deposited during `createCompetition`), so it should use `transfer()` or the contract needs to self-approve, which is non-standard.

**Scope:**
- Replace `usdc.transferFrom(address(this), winner, amount)` with `usdc.transfer(winner, amount)`
- Use SafeERC20 `safeTransfer` for safety
- Apply same fix in `submitFlag()` for xpToken

**Acceptance Criteria:**
- [ ] Prize distribution uses `transfer` or `safeTransfer` from contract balance
- [ ] Winners successfully receive USDC prizes
- [ ] No self-approval pattern needed

**Files likely affected:**
- `contract/src/core/competition.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #11: ConnectLogic Constructor Initializes Interface with address(0)

**Labels:** `smart-contract`, `priority: critical`, `bug`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`ConnectLogic` constructor sets `startChallenge = IChallengeImplementation(startConnectAddress)` but `startConnectAddress` defaults to `address(0)` at that point. Any call to `startConnectChallenge()` will revert or behave unpredictably since it calls an interface at the zero address.

**Scope:**
- Remove the constructor assignment or accept the address as a constructor parameter
- Gate `startConnectChallenge()` with a require that `startConnectAddress != address(0)`
- Ensure `setConnectChallenge()` also updates the `startChallenge` interface reference

**Acceptance Criteria:**
- [ ] `startChallenge` is only callable when pointing to a valid contract
- [ ] `setConnectChallenge()` updates both `startConnectAddress` and `startChallenge`
- [ ] Clear revert message when challenge address is not configured

**Files likely affected:**
- `contract/src/Lib/ConnectLogic.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #12: `submitChallengeFlag` Compares Solution Against Uninitialized Submission Hash

**Labels:** `smart-contract`, `priority: critical`, `bug`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
In `ChallengeImplementation.submitChallengeFlag()`, the code compares `_solutionHash == submission[msg.sender].solutionHash`. But a first-time submitter has `solutionHash = 0x0`, so the comparison checks the user's *previously stored* hash, not the actual solution. It should compare against the private `solution` variable.

**Scope:**
- Change the comparison to `_solutionHash == solution`
- Remove or repurpose the stale submission hash comparison
- Add tests for first-time and repeat submissions

**Acceptance Criteria:**
- [ ] Solution verification compares against the stored `solution` hash
- [ ] First-time submitters can successfully solve challenges
- [ ] Repeat submissions are properly handled

**Files likely affected:**
- `contract/src/core/challenge.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #13: Competition `submitFlag` Pushes to Winners on Failure Path

**Labels:** `smart-contract`, `priority: critical`, `bug`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
In `CompetitionImplementation.submitFlag()`, the `winners.push(msg.sender)` is executed in the else/fallthrough path (when the solution is wrong), meaning only failed submissions get added to the winners array. Correct solvers return early before being added.

**Scope:**
- Move `winners.push(msg.sender)` inside the success branch (before the return)
- Add a cap on winners array length matching the prize array length
- Add event emission for successful solutions

**Acceptance Criteria:**
- [ ] Only correct solvers are added to the winners array
- [ ] Winners array does not exceed prize slot count
- [ ] Failed submissions do not pollute the winners list

**Files likely affected:**
- `contract/src/core/competition.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #14: SPDX License Typo in dataTypes.sol

**Labels:** `smart-contract`, `priority: medium`, `bug`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`dataTypes.sol` has `//SPDX-Lisence-Identifier:MIT` which is a typo of "License". While this doesn't affect compilation, it breaks tooling that scans for SPDX identifiers and may cause issues with license compliance scanners and verification tools.

**Scope:**
- Fix the typo to `// SPDX-License-Identifier: MIT`
- Ensure consistent SPDX header formatting across all source files

**Acceptance Criteria:**
- [ ] All `.sol` files have valid `// SPDX-License-Identifier:` headers
- [ ] License scanners correctly identify the license
- [ ] `forge build` produces no SPDX warnings

**Files likely affected:**
- `contract/src/Data_Structures/dataTypes.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #15: Deploy Script Uses Uninitialized `usdc` and `lzEndpoint` Addresses

**Labels:** `smart-contract`, `priority: critical`, `bug`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The deploy script declares `IERC20 public usdc;` and `address lzEndpoint;` without assigning values, defaulting to `address(0)`. This means `CompetitionImplementation` is deployed with a null USDC address, and the LD token is deployed with a null LayerZero endpoint, making both contracts non-functional.

**Scope:**
- Define actual deployment addresses or read them from environment variables
- Add pre-deployment validation that all addresses are non-zero
- Create separate config for testnet vs mainnet addresses

**Acceptance Criteria:**
- [ ] Deploy script uses valid USDC and LZ endpoint addresses
- [ ] Script reverts if any required address is zero
- [ ] Addresses are configurable per network

**Files likely affected:**
- `contract/script/deploycontracts.s.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #16: Create Test Directory and Base Test Infrastructure

**Labels:** `smart-contract`, `priority: high`, `testing`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The project has no `test/` directory at all. A complete test infrastructure needs to be set up with base contracts, helper utilities, mock tokens, and Foundry test configuration to enable systematic testing of all contracts.

**Scope:**
- Create `contract/test/` directory with proper structure
- Create a `BaseTest.sol` with common setup (deploy all contracts, create mock tokens)
- Create mock ERC20 for USDC and helper contracts for LayerZero endpoint
- Configure `foundry.toml` test settings (fuzz runs, verbosity)

**Acceptance Criteria:**
- [ ] `contract/test/` directory exists with organized structure
- [ ] `BaseTest.sol` deploys all core contracts in correct order
- [ ] Mock USDC and mock LZ endpoint are available for testing
- [ ] `forge test` runs successfully with base setup

**Files likely affected:**
- `contract/test/BaseTest.sol`
- `contract/test/mocks/MockUSDC.sol`
- `contract/test/mocks/MockLZEndpoint.sol`
- `contract/foundry.toml`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #17: Unit Tests for Entry Contract

**Labels:** `smart-contract`, `priority: high`, `testing`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The Entry contract has no tests. Unit tests are needed for user connection, XP management, challenge/competition creation gating, and the `claimXp` flow to ensure core user onboarding works correctly.

**Scope:**
- Test `connect()` with valid username (happy path)
- Test `connect()` reverts for duplicate registration
- Test `createCompetition()` and `createChallenge()` XP gating
- Test `claimXp()` with valid and invalid selectors
- Test `addToUserXP()` access control

**Acceptance Criteria:**
- [ ] All public functions in Entry have at least one passing test
- [ ] Edge cases (zero address, empty username, duplicate connect) are covered
- [ ] XP balance changes are verified with assertions

**Files likely affected:**
- `contract/test/Entry.t.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #18: Unit Tests for CreationFactory Contract

**Labels:** `smart-contract`, `priority: high`, `testing`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
CreationFactory's clone mechanism needs tests to verify that EIP-1167 minimal proxies are created correctly, initialized with proper parameters, and tracked in the correct arrays.

**Scope:**
- Test `cloneCompetition()` creates a valid proxy and initializes it
- Test `cloneChallenge()` creates a valid proxy and initializes it
- Test `lookUpCompetition()` and `lookUpChallenge()` return correct addresses
- Test onlyOwner access control on clone functions
- Test that cloned contracts are independently functional

**Acceptance Criteria:**
- [ ] Clone creation is verified via address checks
- [ ] Initialization parameters are correctly set on clones
- [ ] Array indices match returned IDs
- [ ] Unauthorized callers are rejected

**Files likely affected:**
- `contract/test/CreationFactory.t.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #19: Unit Tests for ChallengeImplementation Contract

**Labels:** `smart-contract`, `priority: high`, `testing`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The challenge system needs comprehensive tests covering the full lifecycle: creation, solution submission by owner, flag submission by users, XP rewards, and edge cases around re-submission.

**Scope:**
- Test `initialize()` sets id and owner correctly
- Test `createChallenge()` stores params and increments ID
- Test `submitSolution()` only callable by creator
- Test `submitChallengeFlag()` for correct and incorrect solutions
- Test that XP is awarded on correct flag submission

**Acceptance Criteria:**
- [ ] Full challenge lifecycle is tested end-to-end
- [ ] Access control on `submitSolution()` is verified
- [ ] Both success and failure paths of `submitChallengeFlag()` are covered
- [ ] Double-solve prevention is tested

**Files likely affected:**
- `contract/test/Challenge.t.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #20: Unit Tests for CompetitionImplementation Contract

**Labels:** `smart-contract`, `priority: high`, `testing`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Competition functionality including USDC prize deposit, solution submission, flag verification, winner tracking, and reward distribution needs comprehensive test coverage.

**Scope:**
- Test `initialize()` sets id and owner
- Test `createCompetition()` transfers USDC and stores params
- Test `submitSolution()` access control
- Test `submitFlag()` correct/incorrect paths
- Test `rewardCompetition()` distributes prizes after deadline

**Acceptance Criteria:**
- [ ] USDC deposit during creation is verified
- [ ] Prize distribution to winners is correct
- [ ] Time-based restrictions (stopTime) are enforced
- [ ] Double-claim prevention works

**Files likely affected:**
- `contract/test/Competition.t.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #21: Unit Tests for Dao Contract

**Labels:** `smart-contract`, `priority: high`, `testing`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The governance system needs tests for proposal creation, voting mechanics, power calculation, proposal execution thresholds, and token minting based on XP.

**Scope:**
- Test `makeProposal()` creates proposal with correct deadline
- Test `vote()` transfers governance tokens and increments count
- Test `vote()` prevents double voting
- Test `executeProposal()` threshold and timing requirements
- Test `mintToken()` power calculations

**Acceptance Criteria:**
- [ ] Proposal lifecycle (create → vote → execute) is fully tested
- [ ] Voting deadline enforcement is verified
- [ ] Governance token transfer during voting works
- [ ] Power calculation from XP is accurate

**Files likely affected:**
- `contract/test/Dao.t.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #22: Unit Tests for Proposal Contract

**Labels:** `smart-contract`, `priority: high`, `testing`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The Proposal contract's creation, approval, joining, and acceptance flows need test coverage to verify access control and deadline enforcement work correctly.

**Scope:**
- Test `createProposal()` with various configurations (private/public)
- Test `setApproval()` and `setApprovals()` owner-only restriction
- Test `joinProposal()` for public proposals and rejection for private
- Test `acceptProposal()` contributor validation
- Test deadline enforcement across all functions

**Acceptance Criteria:**
- [ ] Public and private proposal flows are distinguished correctly
- [ ] Only proposal owners can set approvals
- [ ] Deadline-expired proposals reject new actions
- [ ] `isContributor()` returns correct state after each action

**Files likely affected:**
- `contract/test/Proposal.t.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #23: Unit Tests for Contribution Contract

**Labels:** `smart-contract`, `priority: high`, `testing`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The Contribution contract needs tests for the contribute-validate flow including validator registration, contribution submission, validation counting, and access control through the onlyValidator modifier.

**Scope:**
- Test `addValidator()` adds to validator set
- Test `contribute()` creates contribution records
- Test `validate()` updates valid/invalid counts
- Test `onlyValidator` modifier rejects non-validators
- Test double-validation prevention

**Acceptance Criteria:**
- [ ] Validator management is tested (add, check, prevent duplicate)
- [ ] Contribution records are correctly stored with proposal linkage
- [ ] Validation counts increment correctly
- [ ] Double-validation by same validator is blocked

**Files likely affected:**
- `contract/test/Contribution.t.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #24: Unit Tests for ConnectLogic Library

**Labels:** `smart-contract`, `priority: high`, `testing`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
ConnectLogic handles username registration and profile management. Tests are needed to verify username uniqueness, profile creation, and the connect challenge flow.

**Scope:**
- Test `_connect()` creates profile with correct data
- Test username uniqueness enforcement
- Test `getProfile()` returns correct data
- Test `startConnectChallenge()` deadline logic
- Test `setConnectChallenge()` and `setDuration()`

**Acceptance Criteria:**
- [ ] Username collision is properly rejected
- [ ] Profile data matches input parameters
- [ ] Challenge deadline prevents immediate re-attempts
- [ ] Configuration setters update state correctly

**Files likely affected:**
- `contract/test/ConnectLogic.t.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #25: Unit Tests for LD Token (OFT)

**Labels:** `smart-contract`, `priority: high`, `testing`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The LD token contract needs tests for minting, standard ERC20 operations, and LayerZero OFT cross-chain functionality to ensure the token behaves correctly as both a standard token and an omnichain fungible token.

**Scope:**
- Test constructor mints initial supply (after fix)
- Test `transfer()` and `transferFrom()` overrides work correctly
- Test ERC20 standard compliance (approve, allowance, balanceOf)
- Test OFT-specific functionality with mock LZ endpoint

**Acceptance Criteria:**
- [ ] Initial mint allocates tokens to delegate
- [ ] Transfer and transferFrom work as expected
- [ ] ERC20 interface compliance is complete
- [ ] OFT send/receive can be tested with mock endpoint

**Files likely affected:**
- `contract/test/LD.t.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #26: Integration Test — Full User Onboarding Flow

**Labels:** `smart-contract`, `priority: high`, `testing`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
An integration test is needed that exercises the complete user journey: connect → earn XP → create challenge → solve challenge → claim rewards. This verifies cross-contract interactions work correctly.

**Scope:**
- Deploy all contracts with proper linking
- Test: user connects, earns initial XP
- Test: user creates a challenge via Entry → Factory → Clone
- Test: another user solves the challenge and receives XP
- Verify XP balances update correctly across contracts

**Acceptance Criteria:**
- [ ] Full user flow from connect to reward works end-to-end
- [ ] Cross-contract calls (Entry → Factory → Challenge → Entry) succeed
- [ ] XP state is consistent across all participating contracts
- [ ] Events are emitted at each step

**Files likely affected:**
- `contract/test/integration/UserFlow.t.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #27: Integration Test — Competition Lifecycle

**Labels:** `smart-contract`, `priority: high`, `testing`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
An integration test covering the complete competition lifecycle: creation with USDC deposit, participant submissions, winner determination, and prize distribution after deadline.

**Scope:**
- Deploy competition infrastructure with mock USDC
- Test: creator deposits prize pool during creation
- Test: participants submit flags, winners array populated
- Test: after deadline, `rewardCompetition()` distributes prizes
- Verify USDC balances change correctly

**Acceptance Criteria:**
- [ ] USDC flows correctly from creator → contract → winners
- [ ] Time-based logic (start/stop) is enforced
- [ ] Multiple winners receive correct prize amounts
- [ ] Cannot claim rewards before competition ends

**Files likely affected:**
- `contract/test/integration/CompetitionFlow.t.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #28: Integration Test — DAO Governance Flow

**Labels:** `smart-contract`, `priority: high`, `testing`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
An integration test for the governance lifecycle: user earns XP → mints governance tokens → creates proposal → votes → proposal executes after threshold is met and deadline passes.

**Scope:**
- Deploy Entry, LD, and Dao contracts with proper linking
- Test: user accumulates XP through Entry
- Test: user mints governance tokens based on XP power
- Test: proposal creation, voting, and execution
- Verify token transfers during voting

**Acceptance Criteria:**
- [ ] XP-to-governance-token conversion works end-to-end
- [ ] Voting power is correctly calculated and deducted
- [ ] Proposals execute only when threshold + deadline conditions are met
- [ ] Full governance cycle completes without reverts

**Files likely affected:**
- `contract/test/integration/GovernanceFlow.t.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #29: Fuzz Tests for Critical Numeric Operations

**Labels:** `smart-contract`, `priority: medium`, `testing`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Foundry fuzz tests are needed for functions involving arithmetic operations that could overflow, underflow, or produce unexpected results with edge-case inputs: XP calculations, prize distribution splits, and governance power math.

**Scope:**
- Fuzz `Dao.mintToken()` with random amounts to find overflow/underflow
- Fuzz `Competition.createCompetition()` prize array with various splits
- Fuzz `Entry.claimXp()` with random values
- Fuzz `Dao.calculateUserLDT()` with extreme XP values

**Acceptance Criteria:**
- [ ] Fuzz tests run with minimum 1000 iterations without failure
- [ ] No arithmetic overflow/underflow discovered
- [ ] Edge cases (zero, max uint256) are handled gracefully
- [ ] Foundry fuzz config is set in foundry.toml

**Files likely affected:**
- `contract/test/fuzz/DaoFuzz.t.sol`
- `contract/test/fuzz/CompetitionFuzz.t.sol`
- `contract/foundry.toml`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #30: Invariant Tests for XP System State

**Labels:** `smart-contract`, `priority: medium`, `testing`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Invariant tests should verify system-wide properties that must always hold: total XP distributed never exceeds token supply, user XP is non-negative, and competition prize pools always match deposited USDC.

**Scope:**
- Define invariant: sum of all user XP <= xpToken.totalSupply()
- Define invariant: competition contract USDC balance >= unclaimed prizes
- Define invariant: challenges array length == total challenges created
- Set up invariant test harness with handler contracts

**Acceptance Criteria:**
- [ ] Invariant tests pass after 10,000+ calls
- [ ] No state violation is discovered
- [ ] Handler contracts cover all state-changing functions
- [ ] Broken invariants would catch the existing bugs

**Files likely affected:**
- `contract/test/invariant/XPInvariant.t.sol`
- `contract/test/invariant/handlers/EntryHandler.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #31: Fix Challenge Initialization to Accept All Required Dependencies

**Labels:** `smart-contract`, `priority: high`, `challenge-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`ChallengeImplementation.initialize()` currently only accepts `_id` and `_owner` but the contract depends on `entry` and `xpToken` for reward distribution. The initialization must be expanded to wire all dependencies for cloned instances.

**Scope:**
- Add `address _entry` and `address _xpToken` parameters to `initialize()`
- Set `entry = Entry(_entry)` and `xpToken = LD(_xpToken)`
- Add an `initialized` boolean guard to prevent re-initialization
- Update the constructor to be a no-op for the implementation contract

**Acceptance Criteria:**
- [ ] `initialize()` sets all four state variables (id, owner, entry, xpToken)
- [ ] Re-initialization is prevented by a guard
- [ ] Cloned instances have functional reward distribution

**Files likely affected:**
- `contract/src/core/challenge.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #32: Add Difficulty Levels to Challenge System

**Labels:** `smart-contract`, `priority: medium`, `challenge-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Challenges currently have a flat `score` field with no difficulty classification. The `DataTypes.Level` enum exists but is unused. Integrating difficulty levels would allow tiered XP rewards and better categorization.

**Scope:**
- Add a `Level difficulty` field to `ChallengeParams` struct
- Map difficulty levels to XP multipliers (LEVEL001=10x, LEVEL002=5x, LEVEL003=1x)
- Update `createChallenge()` to accept difficulty parameter
- Adjust XP rewards based on difficulty in `submitChallengeFlag()`

**Acceptance Criteria:**
- [ ] Challenges have an assigned difficulty level
- [ ] XP rewards scale with difficulty
- [ ] Existing DataTypes.Level enum is utilized
- [ ] Challenge details include difficulty in getter

**Files likely affected:**
- `contract/src/core/challenge.sol`
- `contract/src/Data_Structures/dataTypes.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #33: Add Deadline/Expiry to Challenges

**Labels:** `smart-contract`, `priority: medium`, `challenge-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Challenges currently have no time constraint — they remain open indefinitely. Adding a deadline would enable time-limited challenges, prevent stale challenges from awarding XP, and align with the competition system's time-based design.

**Scope:**
- Add `uint256 deadline` field to `ChallengeParams`
- Accept deadline in `createChallenge()` parameters
- Add time check in `submitChallengeFlag()`: `require(block.timestamp <= deadline)`
- Add a function for the owner to extend the deadline

**Acceptance Criteria:**
- [ ] Challenges have configurable deadlines
- [ ] Expired challenges reject flag submissions
- [ ] Owner can extend deadline before expiry
- [ ] Challenges without deadline (0) remain perpetually open

**Files likely affected:**
- `contract/src/core/challenge.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #34: Implement Proper Solution Verification in Challenge

**Labels:** `smart-contract`, `priority: high`, `challenge-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The current `submitChallengeFlag()` incorrectly compares against the user's own previously stored submission hash rather than the actual solution. The comparison logic needs to verify against the private `solution` variable set by the challenge owner.

**Scope:**
- Fix comparison: `if (_solutionHash == solution)` instead of `submission[msg.sender].solutionHash`
- Add a require that `solution != bytes32(0)` (solution must be set first)
- Store the user's attempt hash for audit trail regardless of correctness

**Acceptance Criteria:**
- [ ] Flag verification checks against owner-set solution
- [ ] Submissions before solution is set are rejected
- [ ] Both correct and incorrect attempts are recorded
- [ ] First correct submission triggers reward

**Files likely affected:**
- `contract/src/core/challenge.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #35: Add Multi-Submission Support for Challenges

**Labels:** `smart-contract`, `priority: medium`, `challenge-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The current mapping `mapping(address => Submission)` only stores one submission per user. For challenges that allow multiple attempts before solving, we need submission history and attempt counting for analytics and rate limiting.

**Scope:**
- Change to `mapping(address => Submission[])` or add attempt counter
- Add maximum attempts configuration per challenge
- Track submission timestamps for rate limiting
- Emit events for each submission attempt

**Acceptance Criteria:**
- [ ] Users can make multiple attempts until solving or hitting limit
- [ ] Attempt count is tracked per user per challenge
- [ ] Rate limiting prevents brute-force attempts
- [ ] Events log each attempt with timestamp

**Files likely affected:**
- `contract/src/core/challenge.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #36: Separate Challenge Creator Permission from Solution Submitter

**Labels:** `smart-contract`, `priority: medium`, `challenge-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`submitSolution()` requires `_challenge.creator == msg.sender` but uses the challenge params struct. For cloned challenges, the `owner` (set in initialize) should be the authority, not `challenge.creator` (set in createChallenge). These could be different addresses.

**Scope:**
- Use `owner` as the authority for `submitSolution()`
- Separate the roles: initializer (platform) vs creator (content author)
- Add modifier `onlyOwner` for administrative functions
- Document the role distinction

**Acceptance Criteria:**
- [ ] `submitSolution()` checks `msg.sender == owner`
- [ ] Challenge creator and clone owner roles are clearly separated
- [ ] Authorization is consistent across all privileged functions

**Files likely affected:**
- `contract/src/core/challenge.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #37: Add Challenge Categories Enumeration

**Labels:** `smart-contract`, `priority: low`, `challenge-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Challenge categories are stored as free-form strings (`string memory _category`) which provides no validation and makes on-chain filtering impossible. Converting to an enum or validated set would improve data quality and enable category-based queries.

**Scope:**
- Define a `ChallengeCategory` enum (e.g., CTF, Puzzle, Code, Audit, Gas)
- Replace string category with enum in `ChallengeParams`
- Update `createChallenge()` parameter type
- Add a category-based lookup or filter capability

**Acceptance Criteria:**
- [ ] Categories are restricted to predefined enum values
- [ ] Invalid categories are rejected at creation time
- [ ] Existing challenge struct is updated
- [ ] Frontend can enumerate available categories

**Files likely affected:**
- `contract/src/core/challenge.sol`
- `contract/src/Data_Structures/dataTypes.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #38: Add XP Reward Distribution Events to Challenge

**Labels:** `smart-contract`, `priority: medium`, `challenge-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The challenge contract has no events for key state transitions like challenge creation, solution submission, or successful solves. Events are essential for frontend indexing, analytics, and off-chain tracking.

**Scope:**
- Add `event ChallengeCreated(uint256 indexed id, address creator, uint256 score)`
- Add `event SolutionSet(uint256 indexed id, address owner)`
- Add `event ChallengeSolved(uint256 indexed id, address solver, uint256 xpAwarded)`
- Emit events at appropriate points in each function

**Acceptance Criteria:**
- [ ] All state-changing functions emit events
- [ ] Events include indexed fields for efficient filtering
- [ ] Events contain enough data for frontend reconstruction
- [ ] Event emission is tested in unit tests

**Files likely affected:**
- `contract/src/core/challenge.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #39: Implement Challenge Hint System

**Labels:** `smart-contract`, `priority: low`, `challenge-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Add a hint system where challenge creators can store encrypted hints that users can unlock by spending XP. This adds engagement mechanics and gives creators more tools for progressive difficulty.

**Scope:**
- Add `bytes32[] hints` array to ChallengeParams
- Add `uint256 hintCost` configurable per challenge
- Implement `unlockHint(uint256 hintIndex)` that deducts XP and reveals hint
- Track which hints each user has unlocked

**Acceptance Criteria:**
- [ ] Creators can add multiple hints during challenge creation
- [ ] Users spend XP to unlock hints sequentially
- [ ] Unlocked hints are tracked per user
- [ ] XP cost is deducted from user balance

**Files likely affected:**
- `contract/src/core/challenge.sol`
- `contract/src/core/entry.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #40: Add Challenge Solver Leaderboard Tracking

**Labels:** `smart-contract`, `priority: medium`, `challenge-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
There's no on-chain tracking of who solved challenges or how quickly. Adding solver records enables leaderboards, achievement systems, and time-based bonus XP for early solvers.

**Scope:**
- Add `address[] solvers` array to track all who solved the challenge
- Record solve timestamp: `mapping(address => uint256) solveTime`
- Add `getSolverCount()` and `getSolvers()` view functions
- Implement early-solver bonus (first N solvers get extra XP)

**Acceptance Criteria:**
- [ ] All solvers are recorded on-chain with timestamps
- [ ] Solver count is queryable for leaderboard ranking
- [ ] Early-solver bonus XP is configurable and distributed
- [ ] View functions support pagination for large solver sets

**Files likely affected:**
- `contract/src/core/challenge.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #41: Implement Challenge Verification with Commit-Reveal Scheme

**Labels:** `smart-contract`, `priority: high`, `challenge-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The current solution verification is vulnerable to front-running: miners or MEV bots can observe submitted flag hashes in the mempool and front-run with the same hash. A commit-reveal pattern would prevent this.

**Scope:**
- Add commit phase: user submits `keccak256(solution + salt + msg.sender)`
- Add reveal phase: user reveals solution and salt after commit
- Add minimum commit-reveal delay to prevent same-block reveal
- Update `submitChallengeFlag` to use two-step verification

**Acceptance Criteria:**
- [ ] Users must commit before revealing their solution
- [ ] Commit hashes are binding (include msg.sender to prevent copying)
- [ ] Minimum delay between commit and reveal is enforced
- [ ] Front-running the commit hash is not profitable

**Files likely affected:**
- `contract/src/core/challenge.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #42: Add Challenge Pause/Unpause Functionality

**Labels:** `smart-contract`, `priority: medium`, `challenge-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
There's no way to pause a challenge if a bug is found in the solution, the solution leaks, or the challenge needs to be updated. Adding pause functionality protects the integrity of the challenge system.

**Scope:**
- Add `bool paused` state variable
- Add `pause()` and `unpause()` functions restricted to owner
- Add `whenNotPaused` modifier to `submitChallengeFlag()`
- Emit events for pause/unpause state changes

**Acceptance Criteria:**
- [ ] Owner can pause and unpause challenges
- [ ] Paused challenges reject all flag submissions
- [ ] Challenge details remain viewable when paused
- [ ] Events track pause state changes

**Files likely affected:**
- `contract/src/core/challenge.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #43: Fix ChallengeImplementation Constructor for Clone Pattern

**Labels:** `smart-contract`, `priority: high`, `challenge-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`ChallengeImplementation` has a constructor that sets `xpToken = LD(xpTokenAddr)`, but EIP-1167 clones don't execute constructors. The constructor should only be used for the implementation contract's self-destruct guard, and all state setup must happen in `initialize()`.

**Scope:**
- Remove state initialization from constructor (or make constructor set a `initialized = true` guard on the impl)
- Move `xpToken` setup into `initialize()`
- Add `initializer` modifier pattern to prevent double-initialization
- Document the clone-pattern constraints

**Acceptance Criteria:**
- [ ] Constructor doesn't set clone-relevant state
- [ ] All state is initialized via `initialize()` for clones
- [ ] Implementation contract cannot be re-initialized
- [ ] Clone pattern is documented in NatSpec

**Files likely affected:**
- `contract/src/core/challenge.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #44: Add Challenge Reward Pool Mechanism

**Labels:** `smart-contract`, `priority: medium`, `challenge-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Currently challenges only reward XP from the Entry contract. Adding the ability for challenge creators to deposit token rewards (like LD tokens) would incentivize participation and allow community-funded challenge prizes.

**Scope:**
- Add `uint256 rewardPool` to ChallengeParams
- Add `fundChallenge(uint256 amount)` for depositing rewards
- Distribute rewards proportionally or to first N solvers
- Handle unclaimed rewards return after deadline

**Acceptance Criteria:**
- [ ] Creators can deposit LD tokens as challenge rewards
- [ ] Rewards are distributed to solvers based on configurable rules
- [ ] Unclaimed rewards are returnable after challenge expires
- [ ] Token balances are correctly managed

**Files likely affected:**
- `contract/src/core/challenge.sol`
- `contract/src/core/LD.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #45: Implement Challenge Templates and Versioning

**Labels:** `smart-contract`, `priority: low`, `challenge-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
All challenges use the same implementation contract. As the platform evolves, new challenge types (multi-step, team-based, time-trial) will need different logic. Adding a versioned template system allows upgrading challenge types without breaking existing ones.

**Scope:**
- Add version field to ChallengeImplementation
- Create interface for challenge template registration in Factory
- Allow Factory to maintain multiple implementation versions
- Add `challengeType` parameter to `cloneChallenge()`

**Acceptance Criteria:**
- [ ] Factory supports multiple challenge implementation templates
- [ ] New challenge types can be registered without redeployment
- [ ] Existing challenges continue working with their original version
- [ ] Version is queryable per challenge instance

**Files likely affected:**
- `contract/src/core/CreationFactory.sol`
- `contract/src/core/challenge.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #46: Fix Competition Prize Array Hardcoded to 3 Winners

**Labels:** `smart-contract`, `priority: high`, `competition-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`createCompetition()` hardcodes `_prize[0] + _prize[1] + _prize[2]` and `rewardCompetition()` loops only `i < 2` (which is only 2 winners). This breaks for competitions with different numbers of prize tiers and causes array-out-of-bounds if fewer than 3 prizes are provided.

**Scope:**
- Use `_prize.length` to calculate total prize dynamically
- Update reward loop to iterate over all prizes: `i < competition.prize.length`
- Add validation that winners array length >= prize array length before distributing
- Handle case where fewer winners than prizes exist

**Acceptance Criteria:**
- [ ] Variable number of prize tiers is supported
- [ ] Total prize calculation handles any array length
- [ ] Reward distribution covers all prize positions
- [ ] Edge case of insufficient winners is handled gracefully

**Files likely affected:**
- `contract/src/core/competition.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #47: Add Entry Fee Mechanism to Competitions

**Labels:** `smart-contract`, `priority: medium`, `competition-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Competitions currently have no participation cost. Adding an optional entry fee (in USDC or LD tokens) would allow self-funding prize pools and create skin-in-the-game for participants.

**Scope:**
- Add `uint256 entryFee` to CompetitionParams
- Add `enterCompetition()` function that collects entry fee
- Track registered participants in a mapping
- Only registered participants can submit flags

**Acceptance Criteria:**
- [ ] Competitions can set an optional entry fee
- [ ] Entry fees are collected and added to prize pool or held separately
- [ ] Only registered (paid) participants can submit solutions
- [ ] Zero entry fee allows free participation

**Files likely affected:**
- `contract/src/core/competition.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #48: Add Time-Based Competition Phases

**Labels:** `smart-contract`, `priority: high`, `competition-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The competition has `startTime` and `stopTime` but doesn't enforce them. `submitFlag()` and `createCompetition()` have no time checks, so solutions can be submitted before start or after end, undermining fair competition.

**Scope:**
- Add `require(block.timestamp >= competition.startTime)` to `submitFlag()`
- Add `require(block.timestamp <= competition.stopTime)` to `submitFlag()`
- Add registration period before startTime
- Add grace period handling for edge-case submissions

**Acceptance Criteria:**
- [ ] Submissions are rejected before competition starts
- [ ] Submissions are rejected after competition ends
- [ ] Registration period is enforced separately from solving period
- [ ] Time boundaries are inclusive and well-defined

**Files likely affected:**
- `contract/src/core/competition.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #49: Fix Competition Winner Selection Logic

**Labels:** `smart-contract`, `priority: high`, `competition-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The `winners` array in CompetitionImplementation is pushed to on the *failure* path of `submitFlag()`, and correct solvers return early without being added. Additionally, there's no ranking mechanism — winners should be ordered by solve time or score.

**Scope:**
- Move `winners.push(msg.sender)` to the success branch
- Add winner cap: `require(winners.length < competition.prize.length)`
- Winners are naturally ordered by submission time (first come, first ranked)
- Add view function to get current winners list

**Acceptance Criteria:**
- [ ] Only successful solvers are added to winners
- [ ] Winners array is capped at prize tier count
- [ ] Winner order reflects solve order (first = 1st place)
- [ ] Full winners list is queryable

**Files likely affected:**
- `contract/src/core/competition.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #50: Add Participant Tracking and Leaderboard to Competition

**Labels:** `smart-contract`, `priority: medium`, `competition-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Competitions don't track who participated, how many attempts were made, or provide any leaderboard data. Adding participant tracking enables rich UX and fair competition analytics.

**Scope:**
- Add `mapping(address => bool) public participants` for registration
- Add `address[] public participantList` for enumeration
- Add `uint256 participantCount` for quick queries
- Add `getParticipants()` with pagination support

**Acceptance Criteria:**
- [ ] All participants are tracked upon first submission
- [ ] Participant count is queryable without iteration
- [ ] Duplicate registrations are prevented
- [ ] Pagination works for large participant sets

**Files likely affected:**
- `contract/src/core/competition.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #51: Implement Competition Cancellation and Refunds

**Labels:** `smart-contract`, `priority: medium`, `competition-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
There's no mechanism for a competition creator to cancel a competition and reclaim deposited USDC if no participants join or if an error is discovered. This locks funds permanently in failed competitions.

**Scope:**
- Add `cancelCompetition()` callable only by owner before any submissions
- Implement refund logic that returns USDC to creator
- Add `CompetitionStatus` enum (Active, Cancelled, Completed)
- Prevent actions on cancelled competitions

**Acceptance Criteria:**
- [ ] Creator can cancel before submissions begin
- [ ] Full USDC refund is sent to creator on cancellation
- [ ] Cancelled competitions reject all further actions
- [ ] Status is queryable by participants

**Files likely affected:**
- `contract/src/core/competition.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #52: Add Competition XP Rewards for Participation

**Labels:** `smart-contract`, `priority: medium`, `competition-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Currently only winners receive prizes. Adding base XP rewards for participation incentivizes engagement even without winning, and aligns with the platform's XP-driven progression system.

**Scope:**
- Add `uint256 participationXP` to CompetitionParams
- Award participation XP to all who submit at least one flag attempt
- Call `entry.addToUserXP()` for participants during reward distribution
- Scale XP based on placement (higher XP for higher rank)

**Acceptance Criteria:**
- [ ] All participants receive base participation XP
- [ ] Winners receive additional XP on top of USDC prizes
- [ ] XP rewards are configurable per competition
- [ ] Entry contract XP balances reflect competition rewards

**Files likely affected:**
- `contract/src/core/competition.sol`
- `contract/src/core/entry.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #53: Fix `submitFlag` Solution Comparison Logic

**Labels:** `smart-contract`, `priority: critical`, `competition-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`CompetitionImplementation.submitFlag()` compares `solution == userSub.solutionHash` — checking the stored solution against the user's *previous* submission, not their current one. This means a user must submit twice (first to store, then to match), and the comparison is logically inverted.

**Scope:**
- Fix to compare `_solutionHash == solution` (current submission against stored solution)
- Remove dependency on previously stored user submission for verification
- Ensure single-submission solving works correctly

**Acceptance Criteria:**
- [ ] First-time submitters can solve in one transaction
- [ ] Comparison is between user input and stored solution
- [ ] Correct solution returns true and awards prizes
- [ ] Incorrect solution returns false without reward

**Files likely affected:**
- `contract/src/core/competition.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #54: Add Competition Description and Rules Storage

**Labels:** `smart-contract`, `priority: low`, `competition-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Competition params store only basic metadata. Adding structured rules storage (max team size, allowed tools, submission format) and an IPFS URI for extended description would improve competition clarity.

**Scope:**
- Add `string rulesURI` field for IPFS-stored detailed rules
- Add `uint256 maxParticipants` for capacity limiting
- Add `bool teamBased` and `uint256 maxTeamSize` for team competitions
- Update creation function and events

**Acceptance Criteria:**
- [ ] Competitions can store extended rules via URI
- [ ] Participant caps are enforced
- [ ] Team-based configuration is stored on-chain
- [ ] All new fields are included in events and getters

**Files likely affected:**
- `contract/src/core/competition.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #55: Implement Gradual Prize Release (Milestone Payouts)

**Labels:** `smart-contract`, `priority: low`, `competition-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Currently all prizes are distributed in one `rewardCompetition()` call. For longer competitions, milestone-based payouts (e.g., weekly prizes for ongoing leaderboard positions) would maintain engagement.

**Scope:**
- Add milestone timestamps array to CompetitionParams
- Implement `claimMilestone(uint256 milestoneIndex)` for periodic rewards
- Track which milestones have been paid out
- Allow partial prize distribution at each milestone

**Acceptance Criteria:**
- [ ] Competitions can define multiple payout milestones
- [ ] Each milestone distributes a configured portion of the prize pool
- [ ] Milestones can only be claimed after their timestamp passes
- [ ] Final reward distributes remaining pool

**Files likely affected:**
- `contract/src/core/competition.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #56: Add Competition Solution Update Protection

**Labels:** `smart-contract`, `priority: high`, `competition-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The competition owner can call `submitSolution()` multiple times, changing the answer while participants are submitting. This allows manipulation where the owner changes the solution to match a preferred winner's submission.

**Scope:**
- Add `bool solutionLocked` state variable
- Allow solution submission only once, or only before `startTime`
- Add `lockSolution()` that permanently prevents changes
- Emit event when solution is set and locked

**Acceptance Criteria:**
- [ ] Solution can only be set once or before competition starts
- [ ] Attempts to change a locked solution revert
- [ ] Solution lock status is publicly queryable
- [ ] Event logs solution commitment

**Files likely affected:**
- `contract/src/core/competition.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #57: Implement Emergency Withdrawal for Competition Funds

**Labels:** `smart-contract`, `priority: medium`, `competition-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
If the competition contract has a bug in reward distribution, USDC could become permanently locked. An emergency withdrawal mechanism with appropriate timelocking and multi-sig requirements would protect deposited funds.

**Scope:**
- Add time-locked emergency withdrawal (e.g., 30 days after stopTime with no claims)
- Require owner signature for emergency withdraw
- Emit emergency event for transparency
- Return funds to creator address only

**Acceptance Criteria:**
- [ ] Emergency withdraw is available only after extended timeout
- [ ] Only the competition creator can trigger emergency withdrawal
- [ ] Funds go exclusively to the original creator address
- [ ] Emergency withdrawal emits a distinct event for monitoring

**Files likely affected:**
- `contract/src/core/competition.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #58: Add Competition Status View and Active Competition Registry

**Labels:** `smart-contract`, `priority: medium`, `competition-system`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
There's no way to query whether a competition is in registration, active, ended, or rewarded state. The Factory also doesn't distinguish active from completed competitions. Adding status tracking improves frontend integration.

**Scope:**
- Add `CompetitionStatus` enum: Created, Active, Ended, Rewarded, Cancelled
- Add `getStatus()` view function with time-based logic
- Add active competition filter capability in Factory
- Emit status change events

**Acceptance Criteria:**
- [ ] Competition status is derivable from on-chain state
- [ ] Status transitions follow valid state machine
- [ ] Factory can return filtered lists by status
- [ ] Frontend can efficiently query active competitions

**Files likely affected:**
- `contract/src/core/competition.sol`
- `contract/src/core/CreationFactory.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #59: Fix LD Token to Mint Initial Supply in Constructor

**Labels:** `smart-contract`, `priority: critical`, `token-rewards`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The `LD` constructor accepts `initialMintAmount` but has an empty body — no tokens are ever minted. The entire token economy (XP rewards, governance) depends on LD tokens existing, making the system non-functional at deployment.

**Scope:**
- Add `_mint(_delegate, initialMintAmount)` to the constructor body
- Verify total supply equals initialMintAmount after deployment
- Ensure delegate has full balance for initial distribution
- Update deploy script with reasonable initial supply

**Acceptance Criteria:**
- [ ] LD tokens are minted to delegate during construction
- [ ] `totalSupply()` returns `initialMintAmount` after deploy
- [ ] `balanceOf(delegate)` equals `initialMintAmount`
- [ ] Deploy script uses appropriate supply (e.g., 1 billion with 18 decimals)

**Files likely affected:**
- `contract/src/core/LD.sol`
- `contract/script/deploycontracts.s.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #60: Implement XP Token as Separate Non-Transferable Token

**Labels:** `smart-contract`, `priority: high`, `token-rewards`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The system conflates XP (a non-transferable reputation score in `Entry.xp` mapping) with the LD token (a transferable OFT). XP should be a soulbound/non-transferable token to prevent XP trading and maintain reputation integrity.

**Scope:**
- Create `XPToken.sol` as a non-transferable ERC20 (override transfer to revert)
- Use XPToken for `Entry.xp` tracking instead of a raw mapping
- Keep LD as the transferable/tradeable utility token
- Update all contracts referencing `xpToken` to use the correct token type

**Acceptance Criteria:**
- [ ] XP token exists as a non-transferable ERC20
- [ ] Transfer and transferFrom revert for XP token
- [ ] Entry contract uses XP token for reputation tracking
- [ ] LD token remains separately transferable and cross-chain capable

**Files likely affected:**
- `contract/src/core/entry.sol`
- `contract/src/core/challenge.sol`
- `contract/src/core/competition.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #61: Implement ClaimLogic Contract Functions

**Labels:** `smart-contract`, `priority: high`, `token-rewards`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`ClaimLogic` is almost entirely empty stubs with no actual logic. The Entry contract delegates claim calls to it via low-level `.call()` but there's nothing to execute. All claim functions need proper implementation.

**Scope:**
- Implement `automatedXp()` with proper automater validation
- Implement `contributionXp()` with contribution contract integration
- Implement `projectSpecificXp()` with configurable reward amounts
- Add proper `onlyAutomater` modifier logic with authorized address

**Acceptance Criteria:**
- [ ] All claim functions have working implementations
- [ ] `onlyAutomater` modifier validates caller against a stored address
- [ ] Each claim function returns the XP amount to be awarded
- [ ] Entry contract successfully delegates to ClaimLogic

**Files likely affected:**
- `contract/src/Lib/ClaimLogic.sol`
- `contract/src/core/entry.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #62: Replace Low-Level Call in Entry.claimXp with Direct Function Calls

**Labels:** `smart-contract`, `priority: high`, `token-rewards`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`Entry.claimXp()` uses `address(claim).call(_selector)` with arbitrary calldata, which is dangerous — any function on ClaimLogic can be called by any user. The `_value` parameter for XP is user-supplied, allowing arbitrary XP inflation regardless of claim result.

**Scope:**
- Replace low-level call with specific typed function calls on ClaimLogic
- Remove user-supplied `_value` parameter — XP amount should come from ClaimLogic
- Add function-specific claim methods: `claimChallengeXp()`, `claimCompetitionXp()`
- Add access control to prevent unauthorized claiming

**Acceptance Criteria:**
- [ ] No low-level `.call()` for claim operations
- [ ] XP amounts are determined by ClaimLogic, not the user
- [ ] Each claim type has a dedicated function with proper validation
- [ ] Users cannot arbitrarily inflate XP

**Files likely affected:**
- `contract/src/core/entry.sol`
- `contract/src/Lib/ClaimLogic.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #63: Add Token Vesting Schedule for LD Token

**Labels:** `smart-contract`, `priority: medium`, `token-rewards`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The LD token has no vesting mechanism for team allocations, advisors, or early contributors. A vesting contract is needed to ensure controlled token release and align long-term incentives.

**Scope:**
- Create `LDVesting.sol` contract with linear vesting
- Support multiple beneficiaries with different schedules
- Implement cliff period before any tokens vest
- Add `release()` function for beneficiaries to claim vested tokens

**Acceptance Criteria:**
- [ ] Vesting contract holds LD tokens for beneficiaries
- [ ] Tokens vest linearly after cliff period
- [ ] Beneficiaries can only claim vested (not unvested) tokens
- [ ] Admin can revoke unvested tokens for terminated beneficiaries

**Files likely affected:**
- `contract/src/core/LDVesting.sol`
- `contract/src/core/LD.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #64: Implement XP-to-LD Token Conversion Mechanism

**Labels:** `smart-contract`, `priority: medium`, `token-rewards`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
There's no mechanism for users to convert their earned XP into tradeable LD tokens. The Dao's `mintToken` attempts this but the math is broken (division by user amount creates wrong ratios). A clear conversion mechanism is needed.

**Scope:**
- Define XP-to-LD conversion rate (configurable by governance)
- Implement `convertXPtoLD(uint256 xpAmount)` in Entry or a dedicated contract
- Burn/deduct XP upon conversion to prevent double-spending
- Add rate limiting to prevent token supply manipulation

**Acceptance Criteria:**
- [ ] Users can convert XP to LD at a defined rate
- [ ] XP is deducted upon conversion
- [ ] Conversion rate is governable
- [ ] Rate limiting prevents excessive conversions

**Files likely affected:**
- `contract/src/core/entry.sol`
- `contract/src/core/LD.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #65: Fix Dao.mintToken Division Math

**Labels:** `smart-contract`, `priority: high`, `token-rewards`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`Dao.mintToken()` calculates `amountTomint = (totalSupply() * PRECISION) / _amount`. When totalSupply is 0 (fresh deploy), this produces 0 tokens. When supply is non-zero, minting more tokens for *less* input (`_amount`) creates a perverse incentive. The formula is economically broken.

**Scope:**
- Redesign the minting formula based on XP power: `amountToMint = _amount` (1:1) or bonding curve
- Remove the `totalSupply * PRECISION / _amount` calculation
- Ensure minting works when totalSupply is 0
- Add maximum mint cap per transaction

**Acceptance Criteria:**
- [ ] Minting works correctly when totalSupply is 0
- [ ] More XP power results in more governance tokens (not inverse)
- [ ] Minting formula is economically sound and documented
- [ ] Per-transaction and per-user caps prevent governance attacks

**Files likely affected:**
- `contract/src/core/Dao.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #66: Add Staking Mechanism for LD Tokens

**Labels:** `smart-contract`, `priority: medium`, `token-rewards`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
There's no staking mechanism for LD tokens. Staking would incentivize long-term holding, provide yield to participants, and could serve as a mechanism for governance power accumulation beyond XP.

**Scope:**
- Create `LDStaking.sol` with deposit/withdraw functionality
- Implement reward distribution (from platform fees or inflation)
- Add time-locked staking tiers for higher APY
- Integrate staking balance with governance power calculation

**Acceptance Criteria:**
- [ ] Users can stake LD tokens and earn rewards
- [ ] Longer lock periods provide higher yield
- [ ] Unstaking respects lock period constraints
- [ ] Staked balance contributes to governance power

**Files likely affected:**
- `contract/src/core/LDStaking.sol`
- `contract/src/core/Dao.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #67: Implement Platform Fee Collection for Reward Distribution

**Labels:** `smart-contract`, `priority: medium`, `token-rewards`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The platform has no fee mechanism to sustain development. Adding a small platform fee on competition prize pools and challenge rewards would fund continued development and staking rewards.

**Scope:**
- Add configurable fee percentage (e.g., 2.5%) to competitions
- Deduct fee during `createCompetition()` USDC deposit
- Route fees to a treasury address (governable)
- Add fee exemption for governance-approved competitions

**Acceptance Criteria:**
- [ ] Platform fee is deducted from prize pool deposits
- [ ] Fee percentage is configurable via governance
- [ ] Fees accumulate in a treasury contract
- [ ] Fee is clearly shown in competition creation events

**Files likely affected:**
- `contract/src/core/competition.sol`
- `contract/src/core/entry.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #68: Add Token Approval Management for Challenge/Competition Rewards

**Labels:** `smart-contract`, `priority: high`, `token-rewards`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`ChallengeImplementation` calls `xpToken.transferFrom(address(this), ...)` but cloned contracts never receive token approvals or token balances. The reward distribution model needs a redesign to either pre-fund clones or use a central reward distributor.

**Scope:**
- Option A: Fund clones with tokens after creation, use `transfer()` not `transferFrom()`
- Option B: Create central RewardDistributor that clones call to distribute rewards
- Ensure clones have sufficient balance or authorization for rewards
- Add balance checking before reward attempts

**Acceptance Criteria:**
- [ ] Challenge clones can successfully distribute token rewards
- [ ] No `transferFrom` on self without approval
- [ ] Reward distribution has sufficient balance validation
- [ ] Failed rewards don't silently succeed

**Files likely affected:**
- `contract/src/core/challenge.sol`
- `contract/src/core/competition.sol`
- `contract/src/core/entry.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #69: Fix Dao Proposal Struct Initialization (Wrong Field Order)

**Labels:** `smart-contract`, `priority: high`, `governance`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
In `makeProposal()`, the Proposal struct is initialized with positional arguments: `Proposal(proposalCount, _description, 0, block.timestamp + votingDuration, false)`. The 3rd field `0` maps to `voteCount`, but this is fragile — if struct fields are reordered, values silently map to wrong fields. Also, the 0 might be misread as the deadline.

**Scope:**
- Use named struct initialization: `Proposal({id: ..., description: ..., ...})`
- Verify all fields map correctly to their intended values
- Add NatSpec documentation to the Proposal struct fields

**Acceptance Criteria:**
- [ ] Proposal initialization uses named fields
- [ ] All field assignments are correct and explicit
- [ ] Adding new fields won't silently break existing initialization
- [ ] Struct fields are documented

**Files likely affected:**
- `contract/src/core/Dao.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #70: Add Quorum Requirement to Dao Proposals

**Labels:** `smart-contract`, `priority: high`, `governance`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`executeProposal()` only checks `voteCount` against a threshold but doesn't consider what percentage of total governance token holders voted. Without quorum, a small minority could pass proposals when most holders are inactive.

**Scope:**
- Add `uint256 public quorumPercentage` (e.g., 10% of total supply must vote)
- Calculate quorum based on total governance token supply at proposal creation
- Add quorum snapshot at proposal creation time
- Require both vote threshold AND quorum for execution

**Acceptance Criteria:**
- [ ] Proposals require minimum quorum participation to execute
- [ ] Quorum is calculated as percentage of total governance supply
- [ ] Quorum percentage is governable
- [ ] Insufficient quorum prevents execution even with high vote count

**Files likely affected:**
- `contract/src/core/Dao.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #71: Implement Vote Weight Based on Token Amount

**Labels:** `smart-contract`, `priority: high`, `governance`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The current `vote()` function increments `voteCount` by 1 regardless of how many tokens the voter stakes. The `_power` parameter transfers tokens but doesn't affect vote weight. Governance should be token-weighted for fair representation.

**Scope:**
- Change `proposal.voteCount++` to `proposal.voteCount += _power`
- Ensure vote weight equals tokens staked for that proposal
- Add minimum vote power requirement to prevent dust votes
- Update threshold comparison to account for weighted votes

**Acceptance Criteria:**
- [ ] Vote weight equals governance tokens committed
- [ ] More tokens = more influence on proposal outcome
- [ ] Minimum vote power prevents spam
- [ ] Execution threshold accounts for total weighted votes

**Files likely affected:**
- `contract/src/core/Dao.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #72: Add Proposal Types and Executable Actions

**Labels:** `smart-contract`, `priority: medium`, `governance`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The Dao's `executeProposal()` only emits an event — it doesn't actually execute anything on-chain. For true governance, proposals should encode callable actions (e.g., changing parameters, transferring treasury funds, upgrading contracts).

**Scope:**
- Add `address target`, `bytes calldata data`, and `uint256 value` to Proposal struct
- Execute the encoded action upon successful proposal
- Add timelock between passing and execution for security
- Support multi-action proposals (batch calls)

**Acceptance Criteria:**
- [ ] Passed proposals execute their encoded actions on-chain
- [ ] Timelock provides delay before execution
- [ ] Failed executions revert the entire proposal
- [ ] Multi-action proposals execute atomically

**Files likely affected:**
- `contract/src/core/Dao.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #73: Add Vote Delegation to Dao

**Labels:** `smart-contract`, `priority: medium`, `governance`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Users who hold governance tokens but don't actively monitor proposals should be able to delegate their voting power to trusted representatives without transferring token ownership.

**Scope:**
- Add `delegate(address delegatee)` function
- Track delegated power: `mapping(address => address) public delegates`
- Calculate effective voting power including delegated tokens
- Allow delegation revocation at any time

**Acceptance Criteria:**
- [ ] Token holders can delegate voting power
- [ ] Delegatees vote with combined power
- [ ] Delegation is revocable
- [ ] Self-delegation is the default

**Files likely affected:**
- `contract/src/core/Dao.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #74: Add Proposal Cancellation Mechanism

**Labels:** `smart-contract`, `priority: medium`, `governance`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Once a proposal is created, there's no way to cancel it — even if it contains errors or becomes irrelevant. The proposer should be able to cancel before the voting deadline, and governance should be able to cancel malicious proposals.

**Scope:**
- Add `cancelProposal(uint256 _id)` callable by proposer before deadline
- Add emergency cancel by governance for malicious proposals
- Return staked governance tokens to voters on cancellation
- Add `cancelled` field to Proposal struct

**Acceptance Criteria:**
- [ ] Proposer can cancel their own proposal before deadline
- [ ] Governance multi-sig can emergency cancel any proposal
- [ ] Voter tokens are returned upon cancellation
- [ ] Cancelled proposals cannot be executed

**Files likely affected:**
- `contract/src/core/Dao.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #75: Fix Dao Vote Token Return After Proposal Ends

**Labels:** `smart-contract`, `priority: high`, `governance`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
When users vote, their governance tokens are transferred to the Dao contract via `LDGov.transferFrom()`. However, there's no mechanism to return these tokens after the proposal concludes (executed or expired). Tokens are permanently locked.

**Scope:**
- Implement `withdrawVote(uint256 _proposalId)` callable after deadline
- Track per-user voting amounts per proposal: `mapping(uint256 => mapping(address => uint256))`
- Return tokens after proposal is executed or expired
- Prevent withdrawal before proposal concludes

**Acceptance Criteria:**
- [ ] Voters can reclaim tokens after proposal deadline passes
- [ ] Correct amount is returned per voter
- [ ] Cannot withdraw before proposal concludes
- [ ] Token balance in Dao decreases after withdrawals

**Files likely affected:**
- `contract/src/core/Dao.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #76: Add Proposal Discussion Period Before Voting

**Labels:** `smart-contract`, `priority: low`, `governance`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Proposals jump directly to voting without a discussion period. Adding a configurable discussion phase allows community feedback before voting begins, leading to better-informed governance decisions.

**Scope:**
- Add `uint256 discussionPeriod` to Dao configuration
- Proposals enter discussion state before voting opens
- Voting only starts after discussion period ends
- Allow proposal amendments during discussion (by proposer only)

**Acceptance Criteria:**
- [ ] Proposals have a mandatory discussion period before voting
- [ ] Voting is rejected during discussion phase
- [ ] Discussion period is configurable
- [ ] Proposer can amend during discussion

**Files likely affected:**
- `contract/src/core/Dao.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #77: Implement Governance Parameter Change Proposals

**Labels:** `smart-contract`, `priority: medium`, `governance`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Key platform parameters (minCreationXp, votingDuration, fee percentage) currently lack proper governance control — many have `onlyOwner` commented out. These should be changeable only through governance proposals.

**Scope:**
- Create parameter change proposal type
- Map governable parameters: minCreationXp, votingDuration, platform fee, quorum
- Auto-execute parameter updates when proposal passes
- Validate parameter ranges to prevent destructive changes

**Acceptance Criteria:**
- [ ] Platform parameters are only changeable via governance
- [ ] Parameter proposals auto-execute on passing
- [ ] Value bounds prevent dangerous settings (e.g., 0% quorum)
- [ ] Current parameter values are publicly queryable

**Files likely affected:**
- `contract/src/core/Dao.sol`
- `contract/src/core/entry.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #78: Add Voting Snapshot to Prevent Flash-Loan Governance Attacks

**Labels:** `smart-contract`, `priority: high`, `governance`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The Dao uses live token balance for voting power via `calculateUserLDT()` which queries current XP. An attacker could flash-loan XP-generating actions, vote with inflated power, and unwind — all in one transaction. Snapshot-based voting prevents this.

**Scope:**
- Snapshot governance token balances at proposal creation block
- Use snapshot balance for voting power instead of live balance
- Implement ERC20Votes or similar checkpoint mechanism
- Prevent same-block voting after balance increase

**Acceptance Criteria:**
- [ ] Voting power is based on balance at proposal creation time
- [ ] Balance changes after proposal creation don't affect voting
- [ ] Flash-loan attacks cannot inflate voting power
- [ ] Checkpoints are gas-efficient

**Files likely affected:**
- `contract/src/core/Dao.sol`
- `contract/src/core/LD.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #79: Fix Contribution Contract's `isContributor` Check Using msg.sender Context

**Labels:** `smart-contract`, `priority: high`, `contributions`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
In `Contribution.contribute()`, it calls `proposal.isContributor(_id)` which checks `_isContributor[msg.sender][_id]`. But when called from Contribution contract, `msg.sender` in Proposal is the Contribution contract address, not the actual user. The contributor check always fails.

**Scope:**
- Pass the actual contributor address to the check: `isContributor(_id, _contributor)`
- Update Proposal's `isContributor` to accept an address parameter
- Or use `tx.origin` (less preferred) or pass caller explicitly

**Acceptance Criteria:**
- [ ] Contributor eligibility check validates the actual user, not the calling contract
- [ ] `contribute()` works for approved contributors
- [ ] Non-contributors are still properly rejected
- [ ] Cross-contract caller context is handled correctly

**Files likely affected:**
- `contract/src/core/contribution.sol`
- `contract/src/core/proposalContract.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #80: Add GitHub Verification Oracle for Contribution Validation

**Labels:** `smart-contract`, `priority: medium`, `contributions`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Contributions currently rely on manual validator review. Integrating a GitHub oracle (via Chainlink or custom off-chain worker) would enable automated verification of pull requests, commits, and code contributions referenced by URI.

**Scope:**
- Design oracle interface for GitHub contribution verification
- Create `IGitHubOracle.sol` interface with verify callback
- Implement request/fulfill pattern for async verification
- Add auto-validation path alongside manual validation

**Acceptance Criteria:**
- [ ] Oracle interface defined for GitHub verification requests
- [ ] Contributions can be auto-validated via oracle callback
- [ ] Manual and automated validation paths coexist
- [ ] Oracle failure falls back to manual validation

**Files likely affected:**
- `contract/src/core/contribution.sol`
- `contract/src/interface/IGitHubOracle.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #81: Fix Validator Linear Search Gas Issue

**Labels:** `smart-contract`, `priority: medium`, `contributions`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`Contribution.isValidator()` iterates through the entire `validators` array to check membership. With many validators, this becomes extremely expensive (O(n) per call). The `onlyValidator` modifier runs this on every validation call.

**Scope:**
- Add `mapping(address => bool) public isValidatorMap` for O(1) lookups
- Update `addValidator()` to set the mapping
- Change `isValidator()` to use the mapping
- Keep the array for enumeration only

**Acceptance Criteria:**
- [ ] Validator checks are O(1) via mapping
- [ ] Gas cost of `validate()` is constant regardless of validator count
- [ ] `addValidator` maintains both array and mapping
- [ ] `isValidator()` returns same results as before

**Files likely affected:**
- `contract/src/core/contribution.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #82: Add Contribution Scoring and Quality Metrics

**Labels:** `smart-contract`, `priority: medium`, `contributions`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Contributions have valid/invalid counts but no scoring system. Adding a quality score based on validation consensus, validator reputation, and contribution history would enable merit-based XP rewards.

**Scope:**
- Calculate contribution score: `score = validCounts / (validCounts + inValidCounts) * 100`
- Weight validator votes by their reputation (validation history accuracy)
- Set minimum validations required before score is finalized
- Trigger XP reward when score exceeds threshold

**Acceptance Criteria:**
- [ ] Contributions have a calculated quality score
- [ ] Score accounts for validator consensus
- [ ] Minimum validation threshold prevents premature finalization
- [ ] High-quality contributions trigger proportional XP rewards

**Files likely affected:**
- `contract/src/core/contribution.sol`
- `contract/src/core/entry.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #83: Implement Proposal Reward Pool Distribution to Contributors

**Labels:** `smart-contract`, `priority: medium`, `contributions`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`ProposalParam` has a `rewardPool` field but no mechanism to deposit tokens or distribute them to approved contributors. The reward pool is tracked as a number without any corresponding token flow.

**Scope:**
- Accept token deposit during `createProposal()` matching `rewardPool` amount
- Implement `distributeRewards(uint256 _id)` callable by proposal owner
- Distribute proportionally based on contribution scores
- Allow owner to specify custom distribution weights

**Acceptance Criteria:**
- [ ] Reward pool tokens are deposited during proposal creation
- [ ] Distribution sends tokens to validated contributors
- [ ] Proportional distribution based on contribution quality
- [ ] Unclaimed/undistributed rewards return to owner after deadline

**Files likely affected:**
- `contract/src/core/proposalContract.sol`
- `contract/src/core/contribution.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #84: Add Proposal Deadline Extension Mechanism

**Labels:** `smart-contract`, `priority: low`, `contributions`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Once a proposal's deadline passes, all actions (joining, accepting, contributing) are blocked. The owner should be able to extend the deadline if the project needs more time, provided there's active participation.

**Scope:**
- Add `extendDeadline(uint256 _id, uint256 newDeadline)` callable by owner
- New deadline must be after current deadline
- Add maximum extension cap to prevent indefinite proposals
- Emit event for deadline changes

**Acceptance Criteria:**
- [ ] Proposal owner can extend deadline
- [ ] New deadline must be in the future and after current
- [ ] Maximum extension limit is enforced
- [ ] Contributors are notified via event

**Files likely affected:**
- `contract/src/core/proposalContract.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #85: Add Validator Reward and Penalty System

**Labels:** `smart-contract`, `priority: medium`, `contributions`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The `ValidatorParam` struct has `reward` and `penalty` fields that are always set to 0. Validators need economic incentives for honest validation and penalties for malicious/lazy behavior.

**Scope:**
- Reward validators with XP/tokens when their validation aligns with consensus
- Penalize validators whose validations consistently disagree with majority
- Track validator accuracy over time
- Implement slashing for clearly malicious validators

**Acceptance Criteria:**
- [ ] Validators earn rewards for consensus-aligned validations
- [ ] Penalties are applied for consistent disagreement with majority
- [ ] Validator reputation score affects future validation weight
- [ ] Severe penalties can lead to validator removal

**Files likely affected:**
- `contract/src/core/contribution.sol`
- `contract/src/core/entry.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #86: Implement Proposal Privacy with Commit-Reveal for Private Proposals

**Labels:** `smart-contract`, `priority: low`, `contributions`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Private proposals use a simple `approved` mapping, but proposal details are still visible on-chain to anyone who reads storage directly. True privacy requires encrypting proposal details and revealing them only to approved contributors.

**Scope:**
- Store encrypted details for private proposals (off-chain encryption, on-chain hash)
- Add `revealDetails(uint256 _id, string memory details)` to verify hash matches
- Gate detail access through access control in getter function
- Use commit-reveal for contributor applications to private proposals

**Acceptance Criteria:**
- [ ] Private proposal details are stored as hashes on-chain
- [ ] Full details are only accessible to approved contributors
- [ ] Hash verification ensures integrity of revealed details
- [ ] Non-approved users see only metadata

**Files likely affected:**
- `contract/src/core/proposalContract.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #87: Add Contribution Dispute Resolution Mechanism

**Labels:** `smart-contract`, `priority: medium`, `contributions`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
When validators disagree on a contribution's validity (split vote), there's no tiebreaking or escalation mechanism. A dispute resolution process would handle contested contributions fairly.

**Scope:**
- Define dispute threshold (e.g., 40-60% split triggers dispute)
- Implement escalation to higher-tier validators or DAO vote
- Add dispute period before contribution is finalized
- Allow contributor to provide additional evidence during dispute

**Acceptance Criteria:**
- [ ] Contested contributions enter dispute state automatically
- [ ] Escalation path exists for unresolved disputes
- [ ] Contributors can respond during dispute period
- [ ] Final resolution is binding and triggers appropriate rewards/penalties

**Files likely affected:**
- `contract/src/core/contribution.sol`
- `contract/src/core/Dao.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #88: Fix Proposal `getProposal` Revert for Non-Approved Users on Private Proposals

**Labels:** `smart-contract`, `priority: medium`, `contributions`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
`getProposal()` reverts with "ProposalContract_Must_Be_Approved" for non-approved users on private proposals. This is a poor UX — it should return empty/minimal data or a boolean indicating privacy, not revert. Reverts make batch queries fail entirely.

**Scope:**
- Return a minimal struct (just id and isPrivate=true) for non-approved callers
- Or add a separate `canViewProposal(uint256 _id)` check function
- Don't revert on view functions for access control — return empty data
- Add `exists(uint256 _id)` helper function

**Acceptance Criteria:**
- [ ] `getProposal()` never reverts for valid proposal IDs
- [ ] Non-approved users see redacted data for private proposals
- [ ] Batch queries don't fail due to private proposal access
- [ ] Existence check is available without revert risk

**Files likely affected:**
- `contract/src/core/proposalContract.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #89: Add Reentrancy Guards to All State-Changing Functions

**Labels:** `smart-contract`, `priority: high`, `security`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
None of the contracts use reentrancy protection. Functions like `submitChallengeFlag()`, `rewardCompetition()`, and `claimXp()` perform external calls before state changes, creating classic reentrancy vulnerabilities.

**Scope:**
- Import OpenZeppelin's `ReentrancyGuard` for all core contracts
- Add `nonReentrant` modifier to all functions with external calls
- Apply checks-effects-interactions pattern where possible
- Audit call order in competition reward distribution

**Acceptance Criteria:**
- [ ] All contracts with external calls inherit ReentrancyGuard
- [ ] All state-changing functions with external calls have `nonReentrant`
- [ ] Checks-effects-interactions pattern is followed
- [ ] No reentrancy vectors remain

**Files likely affected:**
- `contract/src/core/entry.sol`
- `contract/src/core/challenge.sol`
- `contract/src/core/competition.sol`
- `contract/src/core/Dao.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #90: Add Access Control to All Privileged Functions

**Labels:** `smart-contract`, `priority: high`, `security`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Multiple functions have commented-out `onlyOwner` modifiers (Entry.setMinCreationXp, ConnectLogic.setConnectChallenge, ConnectLogic.setDuration) and no access control at all (Entry.addToUserXP, Contribution.addValidator). Any address can call these.

**Scope:**
- Uncomment and implement `onlyOwner` on configuration setters
- Add access control to `addToUserXP()` — only challenges/competitions should call it
- Add role-based access control to `addValidator()`
- Implement OpenZeppelin's `AccessControl` for multi-role management

**Acceptance Criteria:**
- [ ] All configuration setters require owner/admin role
- [ ] `addToUserXP()` is restricted to authorized contracts
- [ ] `addValidator()` requires admin role
- [ ] No privileged function is callable by arbitrary addresses

**Files likely affected:**
- `contract/src/core/entry.sol`
- `contract/src/Lib/ConnectLogic.sol`
- `contract/src/core/contribution.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #91: Implement SafeERC20 Across All Token Interactions

**Labels:** `smart-contract`, `priority: high`, `security`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
All ERC20 interactions use raw `transfer()` and `transferFrom()` without SafeERC20. Tokens that don't revert on failure (returning false instead) would silently fail, and tokens that don't return a value (like USDT) would revert unexpectedly.

**Scope:**
- Import `SafeERC20` from OpenZeppelin in all contracts using IERC20
- Replace all `token.transfer()` with `token.safeTransfer()`
- Replace all `token.transferFrom()` with `token.safeTransferFrom()`
- Replace all `token.approve()` with `token.safeApprove()` or `forceApprove()`

**Acceptance Criteria:**
- [ ] All ERC20 calls use SafeERC20 wrappers
- [ ] Non-standard tokens (no return value) work correctly
- [ ] Tokens returning false on failure properly revert
- [ ] No raw ERC20 calls remain in the codebase

**Files likely affected:**
- `contract/src/core/competition.sol`
- `contract/src/core/challenge.sol`
- `contract/src/core/Dao.sol`
- `contract/src/core/entry.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #92: Add Input Validation to All Public Functions

**Labels:** `smart-contract`, `priority: medium`, `security`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Many functions lack basic input validation: empty strings for usernames/descriptions, zero addresses, zero amounts, and array length mismatches. This leads to invalid state that's expensive to fix later.

**Scope:**
- Add `require(_username.length > 0)` in connect functions
- Add `require(addr != address(0))` for all address parameters
- Add `require(amount > 0)` for all value parameters
- Validate array lengths match in competition prize/winner operations

**Acceptance Criteria:**
- [ ] Empty string parameters are rejected
- [ ] Zero address inputs are rejected
- [ ] Zero amount inputs are rejected where inappropriate
- [ ] Array length mismatches are caught before execution

**Files likely affected:**
- `contract/src/core/entry.sol`
- `contract/src/core/competition.sol`
- `contract/src/core/challenge.sol`
- `contract/src/Lib/ConnectLogic.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #93: Gas Optimization — Replace Storage Arrays with Mappings Where Possible

**Labels:** `smart-contract`, `priority: medium`, `gas-optimization`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The `validators` array in Contribution and `winners` array in Competition are used primarily for existence checks (O(n) iteration). Replacing with mappings + counters would significantly reduce gas costs for frequent operations.

**Scope:**
- Replace `address[] validators` linear search with `mapping(address => bool)`
- Keep arrays only where enumeration is needed
- Add counter variables for length tracking
- Benchmark gas savings with forge test --gas-report

**Acceptance Criteria:**
- [ ] Validator existence checks are O(1) via mapping
- [ ] Gas cost reduction is measurable via forge gas reports
- [ ] Enumeration capability is preserved where needed
- [ ] No functionality regression

**Files likely affected:**
- `contract/src/core/contribution.sol`
- `contract/src/core/competition.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #94: Gas Optimization — Pack Structs for Storage Efficiency

**Labels:** `smart-contract`, `priority: low`, `gas-optimization`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Structs like `ChallengeParams`, `CompetitionParams`, and `Userparam` aren't packed efficiently. Booleans, small integers, and addresses could share storage slots to reduce SSTORE costs.

**Scope:**
- Reorder `CompetitionParams`: group `bool claimed` with `address creator` (same slot)
- Pack `Submission` struct: `bool solved` with `bytes32 solutionHash` isn't packable but document why
- Group `uint256` fields that could be `uint128` or smaller
- Run gas comparison before and after optimization

**Acceptance Criteria:**
- [ ] Struct field ordering is optimized for slot packing
- [ ] Gas savings are measured and documented
- [ ] No functional changes result from reordering
- [ ] Smaller uint types are used where value range allows

**Files likely affected:**
- `contract/src/core/competition.sol`
- `contract/src/core/challenge.sol`
- `contract/src/Lib/ConnectLogic.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #95: Add Event Indexing and Gas-Efficient Logging

**Labels:** `smart-contract`, `priority: medium`, `gas-optimization`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Several events are missing indexed parameters or aren't being emitted at all. Proper indexing enables efficient off-chain filtering, and missing events make it impossible to reconstruct state from logs.

**Scope:**
- Add `indexed` to all address and ID fields in events
- Add missing events to Entry (connect, XP change), Challenge (solve), ConnectLogic
- Remove redundant data from events that can be derived from indexed fields
- Ensure every state change has a corresponding event

**Acceptance Criteria:**
- [ ] All events have at least one indexed parameter
- [ ] All state-changing functions emit events
- [ ] No more than 3 indexed parameters per event (EVM limit)
- [ ] Events enable complete state reconstruction from logs

**Files likely affected:**
- `contract/src/core/entry.sol`
- `contract/src/core/challenge.sol`
- `contract/src/core/competition.sol`
- `contract/src/core/Dao.sol`
- `contract/src/core/contribution.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #96: Fix Deploy Script — Add Real USDC and LZ Endpoint Addresses

**Labels:** `smart-contract`, `priority: high`, `deployment`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The deploy script uses `address(usdc)` which is uninitialized (zero address), and `address(lzEndpoint)` also zero. The script also uses `vm.rpcUrl("anvil")` which may not be configured in `foundry.toml`. All deployment dependencies must be properly configured.

**Scope:**
- Define USDC addresses per network (mainnet, testnet, local mock)
- Define LayerZero endpoint addresses per network
- Use environment variables or foundry.toml for configuration
- Add `anvil` RPC URL to foundry.toml or use fork URL parameter
- Deploy mock USDC on local network

**Acceptance Criteria:**
- [ ] Deploy script works on local anvil with mock contracts
- [ ] Network-specific addresses are configurable
- [ ] `forge script` completes without errors on local network
- [ ] Console output shows valid non-zero addresses

**Files likely affected:**
- `contract/script/deploycontracts.s.sol`
- `contract/foundry.toml`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #97: Add Multi-Chain Deployment Configuration for LayerZero

**Labels:** `smart-contract`, `priority: medium`, `deployment`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The LD token inherits OFT for cross-chain functionality, but there's no multi-chain deployment script that configures peers, sets trusted remotes, and validates cross-chain message paths for LayerZero v2.

**Scope:**
- Create deployment scripts per target chain (Ethereum, Arbitrum, Base, etc.)
- Add peer configuration script that links OFT deployments across chains
- Configure DVN (Decentralized Verifier Network) settings
- Add script to verify cross-chain connectivity

**Acceptance Criteria:**
- [ ] Deployment scripts exist for each target chain
- [ ] Peer configuration connects all chain deployments
- [ ] DVN security settings are configured
- [ ] Cross-chain send can be tested on testnet

**Files likely affected:**
- `contract/script/DeployLD.s.sol`
- `contract/script/ConfigurePeers.s.sol`
- `contract/foundry.toml`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #98: Add Contract Verification Scripts for Block Explorers

**Labels:** `smart-contract`, `priority: medium`, `deployment`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
There are no verification scripts for Etherscan/Basescan/Arbiscan. Verified contracts are essential for user trust, frontend ABI generation, and debugging. The deploy script should output verification commands or auto-verify.

**Scope:**
- Add `--verify` flag to forge script deployment
- Configure API keys for block explorers in foundry.toml
- Create standalone verification script for already-deployed contracts
- Handle verification of EIP-1167 clones (verify implementation only)

**Acceptance Criteria:**
- [ ] Deployed contracts are automatically verified on explorers
- [ ] API keys are securely configured via environment variables
- [ ] Verification works for proxy/clone pattern
- [ ] Verification status is logged post-deployment

**Files likely affected:**
- `contract/script/deploycontracts.s.sol`
- `contract/foundry.toml`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #99: Implement Upgradability Pattern for Core Contracts

**Labels:** `smart-contract`, `priority: medium`, `deployment`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
Core contracts (Entry, Dao) are not upgradeable. Since the system is early-stage with known bugs, adding UUPS or Transparent proxy patterns would allow fixing bugs without redeploying and migrating all state.

**Scope:**
- Convert Entry contract to UUPS upgradeable pattern
- Convert Dao contract to UUPS upgradeable pattern
- Add upgrade authorization (governance-controlled)
- Create upgrade scripts with proper proxy admin management
- Note: Challenge/Competition clones already use proxy pattern via EIP-1167

**Acceptance Criteria:**
- [ ] Entry and Dao are deployed behind UUPS proxies
- [ ] Upgrade path is governance-controlled
- [ ] Storage layout is documented and compatible
- [ ] Upgrade scripts work on testnet

**Files likely affected:**
- `contract/src/core/entry.sol`
- `contract/src/core/Dao.sol`
- `contract/script/UpgradeEntry.s.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #100: Add Comprehensive Deployment Documentation and Runbook

**Labels:** `smart-contract`, `priority: medium`, `deployment`

**Monorepo workspace:** `contract/` — Foundry (Solidity 0.8.28). Run `forge build` and `forge test` from `contract/`.

**Description:**
The project lacks deployment documentation. A runbook covering pre-deployment checklist, deployment order, post-deployment verification, and rollback procedures is essential for safe mainnet launches.

**Scope:**
- Document deployment order (dependencies between contracts)
- Create pre-deployment checklist (audit, test pass, config review)
- Document post-deployment steps (verify, configure peers, fund contracts)
- Add emergency procedures (pause, upgrade, migrate)
- Include environment setup instructions for operators

**Acceptance Criteria:**
- [ ] Deployment runbook covers all contracts and their dependencies
- [ ] Correct deployment order is explicitly documented
- [ ] Post-deployment verification steps are scripted
- [ ] Emergency procedures are documented with specific commands
- [ ] New team members can deploy from runbook alone

**Files likely affected:**
- `contract/docs/DEPLOYMENT.md`
- `contract/docs/EMERGENCY.md`
- `contract/script/deploycontracts.s.sol`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---
