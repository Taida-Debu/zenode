# LazyDev Frontend Issues

---

### Issue #1: Implement Particle Network Connect Button Component

**Labels:** `frontend`, `priority: high`, `authentication`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Replace the commented-out `ParticleAuth.tsx` component with a functional connect button that uses the `useParticleAuth` hook. The current component is entirely commented out and provides no UI for wallet connection on authenticated pages.

**Scope:**
- Create a `ConnectButton` component using the `useParticleAuth` hook
- Display wallet address (truncated) when connected
- Show connect/disconnect options in a dropdown menu
- Integrate with shadcn `DropdownMenu` for consistent styling

**Acceptance Criteria:**
- [ ] Connect button renders on all authenticated pages
- [ ] Clicking connect opens Particle Network modal
- [ ] Connected state shows truncated wallet address
- [ ] Disconnect option properly clears session
- [ ] Component uses shadcn/Radix UI primitives

**Files likely affected:**
- `frontend/apps/app/src/components/ParticleAuth.tsx`
- `frontend/apps/app/src/hooks/useParticleAuth.ts`
- `frontend/apps/app/src/components/layout/navbar.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #2: Create Authentication Context Provider

**Labels:** `frontend`, `priority: high`, `authentication`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build a centralized authentication context that wraps the Particle Network connection state and provides auth status to the entire application. Currently the `useParticleAuth` hook exists in isolation with no global context.

**Scope:**
- Create `AuthContext` and `AuthProvider` components
- Expose `isAuthenticated`, `user`, `walletAddress`, `connect`, `disconnect`
- Persist connection state across page navigations
- Integrate with existing `ParticleConnectkit` provider

**Acceptance Criteria:**
- [ ] `AuthProvider` wraps the app in `layout.tsx`
- [ ] `useAuth()` hook available throughout the app
- [ ] Authentication state persists across route changes
- [ ] Loading state handled during connection check

**Files likely affected:**
- `frontend/apps/app/src/context/auth.tsx` (new)
- `frontend/apps/app/src/app/layout.tsx`
- `frontend/apps/app/src/context/connect.tsx`
- `frontend/apps/app/src/hooks/useParticleAuth.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #3: Implement Protected Route Middleware

**Labels:** `frontend`, `priority: high`, `authentication`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Add route protection so that unauthenticated users are redirected to the landing page when trying to access dashboard, contributions, playground, and settings routes. Currently all routes are publicly accessible.

**Scope:**
- Create a `ProtectedRoute` wrapper component
- Redirect unauthenticated users to `/` or a login page
- Show loading skeleton while checking auth state
- Allow public routes (landing, docs, how-it-works) without auth

**Acceptance Criteria:**
- [ ] Unauthenticated users cannot access `/dashboard/*`
- [ ] Unauthenticated users cannot access `/contributions/*`
- [ ] Unauthenticated users cannot access `/settings/*`
- [ ] Redirect includes return URL for post-login navigation
- [ ] Loading state shown during auth check

**Files likely affected:**
- `frontend/apps/app/src/components/auth/ProtectedRoute.tsx` (new)
- `frontend/apps/app/src/app/dashboard/layout.tsx`
- `frontend/apps/app/src/app/contributions/layout.tsx`
- `frontend/apps/app/src/app/settings/layout.tsx` (new)

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #4: Bridge Wallet Address to User Profile

**Labels:** `frontend`, `priority: high`, `authentication`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Connect the Particle Network wallet address to the Redux user state so that the connected wallet flows into the user profile, dashboard, and contribution tracking. Currently the wallet connection and the GitHub user slice are completely disconnected.

**Scope:**
- After wallet connection, fetch or create user profile from Firebase using wallet address
- Store wallet address in `userSlice` state
- Map Particle `userInfo` fields to application user model
- Handle case where wallet is connected but no profile exists yet

**Acceptance Criteria:**
- [ ] Connected wallet address stored in Redux state
- [ ] User profile fetched from Firebase after wallet connection
- [ ] New users prompted to complete profile setup
- [ ] Wallet address displayed in navigation and profile sections

**Files likely affected:**
- `frontend/apps/app/src/context/redux/userSlice.ts`
- `frontend/apps/app/src/hooks/useParticleAuth.ts`
- `frontend/apps/app/src/context/auth.tsx`
- `frontend/apps/app/src/lib/firebase.config.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #5: Implement Session Persistence with Firebase

**Labels:** `frontend`, `priority: high`, `authentication`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Store and restore user sessions using Firebase so that users don't need to re-connect their wallet on every page refresh. The current implementation loses all state on refresh.

**Scope:**
- Save session data to Firebase on successful connection
- Restore session on app load if valid session exists
- Implement session expiry and refresh logic
- Clear Firebase session on disconnect

**Acceptance Criteria:**
- [ ] User remains logged in after page refresh
- [ ] Session expires after configurable timeout (e.g., 24h)
- [ ] Invalid sessions are cleared automatically
- [ ] Session data includes wallet address and user metadata

**Files likely affected:**
- `frontend/apps/app/src/lib/firebase.config.ts`
- `frontend/apps/app/src/lib/session.ts` (new)
- `frontend/apps/app/src/context/auth.tsx`
- `frontend/apps/app/src/app/layout.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #6: Add Multi-Chain Wallet Support Display

**Labels:** `frontend`, `priority: medium`, `authentication`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Display connected chain information (Ethereum mainnet, Solana) and allow users to switch chains from the wallet UI. The Particle config supports both EVM and Solana but the UI doesn't expose chain selection.

**Scope:**
- Show current chain name and icon in wallet dropdown
- Add chain switcher component
- Display native token balance for the connected chain
- Handle chain switch errors gracefully

**Acceptance Criteria:**
- [ ] Current chain displayed next to wallet address
- [ ] Chain switcher allows toggling between configured chains
- [ ] Balance updates when chain changes
- [ ] Error toast shown if chain switch fails

**Files likely affected:**
- `frontend/apps/app/src/components/wallet/ChainSwitcher.tsx` (new)
- `frontend/apps/app/src/components/ParticleAuth.tsx`
- `frontend/apps/app/src/hooks/useParticleAuth.ts`
- `frontend/apps/app/src/context/connect.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #7: Implement GitHub OAuth Login Flow

**Labels:** `frontend`, `priority: high`, `authentication`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Complete the GitHub authentication flow since Particle Network is configured with `authTypes: ['github']`. After GitHub login, link the GitHub identity to the wallet and fetch the user's GitHub profile for the app.

**Scope:**
- Trigger GitHub OAuth through Particle's `authWalletConnectors`
- Extract GitHub username from Particle user info
- Dispatch `setUserAsync` with GitHub username after login
- Link GitHub repos to user dashboard

**Acceptance Criteria:**
- [ ] Users can log in via GitHub through Particle
- [ ] GitHub username extracted and stored in Redux
- [ ] User's GitHub avatar displayed in nav
- [ ] GitHub installation ID fetched successfully

**Files likely affected:**
- `frontend/apps/app/src/hooks/useParticleAuth.ts`
- `frontend/apps/app/src/context/redux/userSlice.ts`
- `frontend/apps/app/src/app/api/git/route.ts`
- `frontend/apps/app/src/components/nav/NavUser.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #8: Build User Onboarding Flow

**Labels:** `frontend`, `priority: medium`, `authentication`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a multi-step onboarding flow for new users after their first wallet connection. Users should set their display name, select skills, and connect their GitHub account to get matched with projects.

**Scope:**
- Build multi-step onboarding wizard (3-4 steps)
- Step 1: Display name and avatar
- Step 2: Skill selection using existing `skills.ts` data
- Step 3: GitHub account connection
- Step 4: Preferences (notification settings, interests)
- Save onboarding data to Firebase

**Acceptance Criteria:**
- [ ] New users see onboarding after first connection
- [ ] Each step validates before allowing next
- [ ] Skills saved to user profile
- [ ] Onboarding can be skipped but shows reminder
- [ ] Returning users skip onboarding

**Files likely affected:**
- `frontend/apps/app/src/app/onboarding/page.tsx` (new)
- `frontend/apps/app/src/app/onboarding/layout.tsx` (new)
- `frontend/apps/app/src/lib/skills.ts`
- `frontend/apps/app/src/lib/firebase.config.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #9: Add Wallet Transaction Signing UI

**Labels:** `frontend`, `priority: medium`, `authentication`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Implement a transaction confirmation modal that appears when the app needs to sign transactions (e.g., submitting challenge rewards, DAO voting). Currently there's no UI for reviewing and approving transactions.

**Scope:**
- Create a `TransactionModal` component
- Display transaction details (to, value, gas estimate)
- Show confirmation/rejection buttons
- Display transaction status (pending, confirmed, failed)

**Acceptance Criteria:**
- [ ] Modal appears before any on-chain transaction
- [ ] Transaction details clearly displayed
- [ ] Gas estimate shown in native currency
- [ ] Success/failure state with transaction hash link
- [ ] User can reject transaction

**Files likely affected:**
- `frontend/apps/app/src/components/wallet/TransactionModal.tsx` (new)
- `frontend/apps/app/src/hooks/useTransaction.ts` (new)
- `frontend/apps/app/src/components/ui/dialog.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #10: Implement Wallet Balance Display

**Labels:** `frontend`, `priority: medium`, `authentication`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Show the connected wallet's token balances (native token + USDC) in the dashboard sidebar and profile section. Users need to see their balance to understand available rewards and prize pools.

**Scope:**
- Fetch native token balance (ETH/SOL) on connection
- Fetch USDC balance using token contract
- Display balances in sidebar and profile
- Auto-refresh balances on a polling interval

**Acceptance Criteria:**
- [ ] Native token balance displayed in sidebar
- [ ] USDC balance displayed alongside native balance
- [ ] Balances refresh every 30 seconds
- [ ] Loading skeleton shown while fetching
- [ ] Zero balance handled gracefully

**Files likely affected:**
- `frontend/apps/app/src/hooks/useWalletBalance.ts` (new)
- `frontend/apps/app/src/components/layout/AppSidebar.tsx`
- `frontend/apps/app/src/app/dashboard/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #11: Add Login/Signup Page with Wallet Options

**Labels:** `frontend`, `priority: high`, `authentication`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
The existing `Login.tsx` and `Signup.tsx` pages are legacy components. Create a proper login page that presents wallet connection options (MetaMask, Coinbase, GitHub social login) using the Particle Connect modal.

**Scope:**
- Redesign login page with wallet connection options
- Show supported wallets and social login methods
- Add "What is a wallet?" educational tooltip
- Redirect to dashboard on successful connection

**Acceptance Criteria:**
- [ ] Login page shows all supported connection methods
- [ ] Social login (GitHub) option prominently displayed
- [ ] Successful connection redirects to dashboard
- [ ] Error messages shown for failed connections
- [ ] Page matches app design system

**Files likely affected:**
- `frontend/apps/app/src/app/login/page.tsx` (new)
- `frontend/apps/app/src/views/Login.tsx`
- `frontend/apps/app/src/views/Signup.tsx`
- `frontend/apps/app/src/context/connect.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #12: Implement Auto-Disconnect on Session Timeout

**Labels:** `frontend`, `priority: low`, `authentication`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Add automatic session timeout that disconnects the wallet and redirects to the landing page after a period of inactivity. This improves security for users who leave the app open.

**Scope:**
- Track user activity (clicks, key presses, mouse moves)
- Show warning modal 5 minutes before timeout
- Disconnect wallet and clear state on timeout
- Configurable timeout duration in settings

**Acceptance Criteria:**
- [ ] Session times out after 30 minutes of inactivity (default)
- [ ] Warning modal shown at 25 minutes
- [ ] User can extend session from warning modal
- [ ] Timeout duration configurable in settings
- [ ] All state properly cleaned up on timeout

**Files likely affected:**
- `frontend/apps/app/src/hooks/useSessionTimeout.ts` (new)
- `frontend/apps/app/src/components/auth/TimeoutWarning.tsx` (new)
- `frontend/apps/app/src/context/auth.tsx`
- `frontend/apps/app/src/app/settings/security/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #13: Create Challenges Redux Slice

**Labels:** `frontend`, `priority: high`, `state-management`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build a Redux slice for managing challenge state including active challenges, user-joined challenges, and challenge filters. Currently challenges use dummy data from `challenges-dummy-data.ts` with no state management.

**Scope:**
- Create `challengeSlice` with state for list, filters, and selected challenge
- Add async thunks for fetching challenges from Firebase
- Support filtering by difficulty, category, and type
- Track user's joined/submitted challenges separately

**Acceptance Criteria:**
- [ ] Challenge list stored in Redux state
- [ ] Filters update state reactively
- [ ] Loading and error states handled
- [ ] User's joined challenges tracked separately
- [ ] Selectors for filtered challenge lists

**Files likely affected:**
- `frontend/apps/app/src/context/redux/challengeSlice.ts` (new)
- `frontend/apps/app/src/context/redux/store.ts`
- `frontend/apps/app/src/lib/models/challenges.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #14: Create Competitions Redux Slice

**Labels:** `frontend`, `priority: high`, `state-management`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build a Redux slice for time-based competitions with USDC prizes. Competitions differ from challenges in having fixed time windows, leaderboards, and token rewards.

**Scope:**
- Define `Competition` interface (id, title, startTime, endTime, prizePool, participants, leaderboard)
- Create `competitionSlice` with active/upcoming/completed filters
- Add async thunks for fetching competitions from Firebase
- Track user's competition entries and rankings

**Acceptance Criteria:**
- [ ] Competition list with time-based status (active/upcoming/completed)
- [ ] User's competition entries stored
- [ ] Leaderboard data stored per competition
- [ ] Real-time countdown computed from state
- [ ] Prize pool amounts displayed

**Files likely affected:**
- `frontend/apps/app/src/context/redux/competitionSlice.ts` (new)
- `frontend/apps/app/src/context/redux/store.ts`
- `frontend/apps/app/src/lib/models/competitions.ts` (new)

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #15: Create Proposals Redux Slice

**Labels:** `frontend`, `priority: medium`, `state-management`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build a Redux slice for project proposals. The submit-proposal page currently logs to console with no state management or persistence.

**Scope:**
- Define `Proposal` interface matching form fields plus status and contributors
- Create `proposalSlice` with CRUD operations
- Add async thunks for creating/fetching proposals from Firebase
- Track proposal status (draft, active, completed, cancelled)

**Acceptance Criteria:**
- [ ] Proposals stored in Redux with loading states
- [ ] Create proposal dispatches to Firebase
- [ ] Proposal list fetched on dashboard load
- [ ] Status transitions handled (draft → active → completed)
- [ ] User's proposals filtered separately

**Files likely affected:**
- `frontend/apps/app/src/context/redux/proposalSlice.ts` (new)
- `frontend/apps/app/src/context/redux/store.ts`
- `frontend/apps/app/src/app/dashboard/submit-proposal/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #16: Create User XP and Level Redux Slice

**Labels:** `frontend`, `priority: high`, `state-management`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build a Redux slice tracking user XP, level, and achievement progress. The app references XP in challenges and rewards but has no centralized XP tracking system.

**Scope:**
- Define XP model (totalXP, currentLevel, xpToNextLevel, history)
- Create `xpSlice` with actions for adding XP from various sources
- Calculate level thresholds and progress percentages
- Store XP history (source, amount, timestamp)

**Acceptance Criteria:**
- [ ] Total XP and current level stored in state
- [ ] XP additions trigger level-up calculations
- [ ] Level progress percentage computed via selector
- [ ] XP history array tracks all gains
- [ ] Level-up event dispatched when threshold crossed

**Files likely affected:**
- `frontend/apps/app/src/context/redux/xpSlice.ts` (new)
- `frontend/apps/app/src/context/redux/store.ts`
- `frontend/apps/app/src/lib/models/xp.ts` (new)

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #17: Create Notifications Redux Slice

**Labels:** `frontend`, `priority: medium`, `state-management`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build a Redux slice for in-app notifications. The settings page has a notifications section but there's no notification state management or delivery system.

**Scope:**
- Define `Notification` interface (id, type, title, message, read, timestamp, actionUrl)
- Create `notificationSlice` with mark-read, dismiss, and fetch actions
- Add unread count selector for badge display
- Support notification types: challenge, competition, proposal, system

**Acceptance Criteria:**
- [ ] Notifications stored with read/unread status
- [ ] Unread count available via selector
- [ ] Mark single or all as read
- [ ] Notifications fetchable from Firebase
- [ ] New notifications prepended to list

**Files likely affected:**
- `frontend/apps/app/src/context/redux/notificationSlice.ts` (new)
- `frontend/apps/app/src/context/redux/store.ts`
- `frontend/apps/app/src/lib/models/notifications.ts` (new)

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #18: Implement Redux Persist for Offline State

**Labels:** `frontend`, `priority: medium`, `state-management`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Add redux-persist to preserve user state, preferences, and cached data across browser sessions. Currently all Redux state is lost on page refresh.

**Scope:**
- Install and configure `redux-persist` with localStorage
- Whitelist user, xp, and preferences slices
- Blacklist transient state (loading flags, modals)
- Add migration strategy for state schema changes

**Acceptance Criteria:**
- [ ] User slice persists across page refreshes
- [ ] XP and level data persists
- [ ] Notification preferences persist
- [ ] Loading/error states do NOT persist
- [ ] State rehydration happens before first render

**Files likely affected:**
- `frontend/apps/app/src/context/redux/store.ts`
- `frontend/apps/app/src/context/redux/provider.tsx`
- `frontend/apps/app/src/app/layout.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #19: Create Leaderboard Redux Slice

**Labels:** `frontend`, `priority: medium`, `state-management`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build a Redux slice for global and per-competition leaderboards. The landing page mentions leaderboards but no state infrastructure exists for ranking users.

**Scope:**
- Define `LeaderboardEntry` interface (rank, userId, username, avatar, xp, badges)
- Create `leaderboardSlice` with global and scoped leaderboard support
- Add async thunk for fetching ranked users from Firebase
- Support pagination for large leaderboards

**Acceptance Criteria:**
- [ ] Global leaderboard stored with top 100 users
- [ ] Per-competition leaderboards stored by competition ID
- [ ] Current user's rank highlighted
- [ ] Pagination support for fetching more entries
- [ ] Time-range filters (weekly, monthly, all-time)

**Files likely affected:**
- `frontend/apps/app/src/context/redux/leaderboardSlice.ts` (new)
- `frontend/apps/app/src/context/redux/store.ts`
- `frontend/apps/app/src/lib/models/leaderboard.ts` (new)

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #20: Add Redux DevTools and Middleware Configuration

**Labels:** `frontend`, `priority: low`, `state-management`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Configure Redux middleware for logging, error tracking, and dev tools. The current store has minimal configuration with no middleware for debugging or async error handling.

**Scope:**
- Enable Redux DevTools in development
- Add error logging middleware for failed async thunks
- Configure serializable check to handle Firestore timestamps
- Add action sanitizers for sensitive data (wallet keys)

**Acceptance Criteria:**
- [ ] Redux DevTools work in development mode
- [ ] Failed async thunks logged with context
- [ ] Serializable check configured for Firestore data
- [ ] Sensitive data sanitized in DevTools
- [ ] Middleware disabled in production builds

**Files likely affected:**
- `frontend/apps/app/src/context/redux/store.ts`
- `frontend/apps/app/src/context/redux/middleware.ts` (new)

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #21: Create Repository Activity Redux Slice

**Labels:** `frontend`, `priority: medium`, `state-management`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Extend the existing `repoSlice` to track repository activity (commits, PRs, issues) instead of just storing a name. The contributions page needs rich repo data.

**Scope:**
- Expand `Repo` interface to include commits, PRs, issues, and contributors
- Add async thunks for fetching repo details from GitHub API
- Cache repository data to reduce API calls
- Support multiple repositories per user

**Acceptance Criteria:**
- [ ] Repository list with full metadata stored
- [ ] Commits, PRs, and issues fetchable per repo
- [ ] Data cached with 5-minute TTL
- [ ] Multiple repos supported in state
- [ ] Loading states per repository

**Files likely affected:**
- `frontend/apps/app/src/context/redux/repoSlice.ts`
- `frontend/apps/app/src/backend/octokit.ts`
- `frontend/apps/app/src/app/api/repo/repos/route.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #22: Implement Optimistic Updates for Challenge Actions

**Labels:** `frontend`, `priority: low`, `state-management`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Add optimistic updates to challenge join/submit actions so the UI responds immediately rather than waiting for Firebase round-trips. Revert on failure.

**Scope:**
- Implement optimistic update pattern in `challengeSlice`
- Immediately update UI on join/submit actions
- Revert state if Firebase operation fails
- Show toast notification on revert

**Acceptance Criteria:**
- [ ] Join challenge button updates immediately
- [ ] Submit challenge updates participant status instantly
- [ ] Failed operations revert state and show error toast
- [ ] No flickering or inconsistent states
- [ ] Works with concurrent actions

**Files likely affected:**
- `frontend/apps/app/src/context/redux/challengeSlice.ts`
- `frontend/apps/app/src/lib/models/challenges.ts`
- `frontend/apps/app/src/components/challenges/ChallengeDialog.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #23: Wire Dashboard Stats Cards to Real Data

**Labels:** `frontend`, `priority: high`, `dashboard`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Replace hardcoded dashboard stat cards ("12 Active Projects", "48 Total Projects") with real data fetched from the user's actual GitHub repos and Firebase challenge data.

**Scope:**
- Fetch active project count from `repoSlice`
- Fetch challenge stats from `challengeSlice`
- Calculate analytics data from user's contribution history
- Add loading skeletons while data loads

**Acceptance Criteria:**
- [ ] "Active Projects" shows real count from GitHub
- [ ] "Total Projects" reflects user's actual repos
- [ ] Stats update when new data is available
- [ ] Skeleton loaders shown during fetch
- [ ] Zero-state message for new users

**Files likely affected:**
- `frontend/apps/app/src/app/dashboard/page.tsx`
- `frontend/apps/app/src/context/redux/repoSlice.ts`
- `frontend/apps/app/src/context/redux/challengeSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #24: Build Real-Time Activity Feed Component

**Labels:** `frontend`, `priority: high`, `dashboard`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Replace the hardcoded activity feed (Alice Chen, Bob Johnson, Carol White) with a real-time feed showing actual platform activity from Firebase. Activities should include challenge completions, PR merges, and badge earnings.

**Scope:**
- Create Firebase listener for activity collection
- Build `ActivityFeed` component with different activity types
- Support activity types: pr_opened, challenge_completed, badge_earned, competition_won
- Add infinite scroll for older activities

**Acceptance Criteria:**
- [ ] Activity feed shows real platform events
- [ ] Different icons/colors per activity type
- [ ] Real-time updates without page refresh
- [ ] Infinite scroll loads older activities
- [ ] Empty state for no activities

**Files likely affected:**
- `frontend/apps/app/src/app/dashboard/page.tsx`
- `frontend/apps/app/src/components/dashboard/ActivityFeed.tsx` (new)
- `frontend/apps/app/src/lib/models/activity.ts` (new)
- `frontend/apps/app/src/lib/firebase.config.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #25: Implement Notification Bell with Dropdown

**Labels:** `frontend`, `priority: medium`, `dashboard`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Add a notification bell icon to the dashboard header that shows unread count badge and opens a dropdown with recent notifications. Currently there's no notification UI in the app shell.

**Scope:**
- Add bell icon to dashboard header with unread badge
- Build notification dropdown list
- Mark notifications as read on click
- Link notifications to relevant pages (challenge, competition, etc.)

**Acceptance Criteria:**
- [ ] Bell icon visible in all dashboard pages
- [ ] Unread count badge shown (red dot or number)
- [ ] Dropdown lists last 10 notifications
- [ ] Clicking notification navigates to relevant page
- [ ] "Mark all as read" button works

**Files likely affected:**
- `frontend/apps/app/src/components/dashboard/NotificationBell.tsx` (new)
- `frontend/apps/app/src/components/layout/AppSidebar.tsx`
- `frontend/apps/app/src/context/redux/notificationSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #26: Build XP Progress Bar and Level Display

**Labels:** `frontend`, `priority: high`, `dashboard`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a prominent XP progress bar on the dashboard showing current level, XP progress to next level, and recent XP gains. The landing page promises XP tracking but the dashboard doesn't show it.

**Scope:**
- Build `XPProgressBar` component with animated fill
- Show current level number and title
- Display XP/nextLevelXP counter
- Show recent XP gain animation ("+50 XP" floating text)

**Acceptance Criteria:**
- [ ] Progress bar shows percentage to next level
- [ ] Current level displayed prominently
- [ ] XP counter shows exact numbers
- [ ] Animation plays when XP is gained
- [ ] Level-up celebration when threshold crossed

**Files likely affected:**
- `frontend/apps/app/src/components/dashboard/XPProgressBar.tsx` (new)
- `frontend/apps/app/src/app/dashboard/page.tsx`
- `frontend/apps/app/src/context/redux/xpSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #27: Create Dashboard Overview Widgets

**Labels:** `frontend`, `priority: medium`, `dashboard`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build summary widgets for the dashboard overview page showing key metrics: active challenges, pending PRs, competition rankings, and contribution streak.

**Scope:**
- Create `WidgetCard` base component
- Build specific widgets: ActiveChallenges, PendingPRs, CompetitionRank, Streak
- Fetch data from respective Redux slices
- Add sparkline mini-charts using recharts

**Acceptance Criteria:**
- [ ] Four widgets displayed in 2x2 grid on dashboard
- [ ] Each widget shows relevant count and trend
- [ ] Sparkline charts show 7-day history
- [ ] Widgets link to detailed pages on click
- [ ] Loading skeletons for each widget

**Files likely affected:**
- `frontend/apps/app/src/components/dashboard/WidgetCard.tsx` (new)
- `frontend/apps/app/src/app/dashboard/overview/page.tsx`
- `frontend/apps/app/src/app/dashboard/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #28: Implement Global Leaderboard Component

**Labels:** `frontend`, `priority: medium`, `dashboard`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build a leaderboard component showing top contributors ranked by XP. The landing page mentions leaderboards as a feature but no leaderboard UI exists.

**Scope:**
- Create `Leaderboard` component with rank, avatar, username, XP, and level
- Highlight current user's position
- Add tab navigation for weekly/monthly/all-time
- Implement pagination or virtual scrolling for large lists

**Acceptance Criteria:**
- [ ] Top 50 users displayed with rank numbers
- [ ] Current user's row highlighted with different background
- [ ] Tabs switch between time ranges
- [ ] Avatar and level badge shown per user
- [ ] Medal icons for top 3 positions

**Files likely affected:**
- `frontend/apps/app/src/components/dashboard/Leaderboard.tsx` (new)
- `frontend/apps/app/src/app/dashboard/page.tsx`
- `frontend/apps/app/src/context/redux/leaderboardSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #29: Wire Analytics Page to Real User Data

**Labels:** `frontend`, `priority: medium`, `dashboard`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Replace hardcoded analytics data (activity data array, contribution types, project performance) with real data from the user's GitHub contributions and platform activity.

**Scope:**
- Fetch real GitHub contribution data via API
- Calculate contribution type breakdown from actual PRs/issues
- Use actual project names from user's repos
- Replace hardcoded `torvalds` username in GitHub calendar with logged-in user

**Acceptance Criteria:**
- [ ] GitHub calendar shows logged-in user's contributions
- [ ] Line chart uses real monthly contribution data
- [ ] Pie chart reflects actual contribution type breakdown
- [ ] Bar chart shows user's actual project data
- [ ] All stat cards show computed values

**Files likely affected:**
- `frontend/apps/app/src/app/dashboard/analytics/page.tsx`
- `frontend/apps/app/src/context/redux/repoSlice.ts`
- `frontend/apps/app/src/backend/octokit.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #30: Build Contribution Streak Tracker

**Labels:** `frontend`, `priority: medium`, `dashboard`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Implement a daily streak tracker that counts consecutive days of contributions (commits, PRs, challenge completions). The landing page advertises "Daily Streaks" but no implementation exists.

**Scope:**
- Calculate streak from contribution timestamps
- Display current streak with flame icon
- Show longest streak record
- Add streak freeze mechanism (1 free miss per week)

**Acceptance Criteria:**
- [ ] Current streak count displayed on dashboard
- [ ] Streak calendar shows active/missed days
- [ ] Longest streak record shown
- [ ] Streak increments on any contribution type
- [ ] Streak freeze icon when available

**Files likely affected:**
- `frontend/apps/app/src/components/dashboard/StreakTracker.tsx` (new)
- `frontend/apps/app/src/app/dashboard/page.tsx`
- `frontend/apps/app/src/lib/models/streak.ts` (new)

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #31: Create Dashboard Search Functionality

**Labels:** `frontend`, `priority: medium`, `dashboard`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Wire the existing dashboard search page to search across challenges, competitions, users, and projects. Currently the search page exists but has no implementation.

**Scope:**
- Build search input with debounced queries
- Search across multiple data types (challenges, users, repos)
- Display categorized results with type indicators
- Add recent searches and suggestions

**Acceptance Criteria:**
- [ ] Search input with 300ms debounce
- [ ] Results grouped by type (challenges, users, projects)
- [ ] Click result navigates to detail page
- [ ] Recent searches saved locally
- [ ] Empty state with suggestions shown

**Files likely affected:**
- `frontend/apps/app/src/app/dashboard/search/page.tsx`
- `frontend/apps/app/src/components/dashboard/SearchResults.tsx` (new)
- `frontend/apps/app/src/lib/firebase.config.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #32: Implement Profile Page with Real Data

**Labels:** `frontend`, `priority: high`, `dashboard`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Wire the dashboard profile page to display real user data from the connected wallet and GitHub account. Show XP, badges, contribution history, and skills.

**Scope:**
- Display user avatar, name, and bio from GitHub
- Show wallet address and chain
- Display XP level, badges earned, and top skills
- Add contribution graph summary
- Show joined challenges and competitions

**Acceptance Criteria:**
- [ ] GitHub avatar and name displayed
- [ ] Wallet address shown with copy button
- [ ] XP and level prominently displayed
- [ ] Skills tags shown from user profile
- [ ] Recent activity timeline shown

**Files likely affected:**
- `frontend/apps/app/src/app/dashboard/profile/page.tsx`
- `frontend/apps/app/src/context/redux/userSlice.ts`
- `frontend/apps/app/src/context/redux/xpSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #33: Build Badge and Achievement System UI

**Labels:** `frontend`, `priority: medium`, `dashboard`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a badge display system showing earned and locked achievements. Badges should be awarded for milestones like "First PR", "10 Challenges Completed", "Smart Contract Expert".

**Scope:**
- Define badge catalog with icons, names, and unlock criteria
- Build `BadgeGrid` component showing earned/locked badges
- Add badge detail modal with progress toward unlock
- Animate newly earned badges

**Acceptance Criteria:**
- [ ] Badge grid shows all available badges
- [ ] Earned badges shown in color, locked ones greyed out
- [ ] Click badge shows unlock criteria and progress
- [ ] New badge earn triggers celebration animation
- [ ] Badges visible on user profile

**Files likely affected:**
- `frontend/apps/app/src/components/dashboard/BadgeGrid.tsx` (new)
- `frontend/apps/app/src/lib/models/badges.ts` (new)
- `frontend/apps/app/src/app/dashboard/profile/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #34: Add Quick Actions Panel to Dashboard

**Labels:** `frontend`, `priority: low`, `dashboard`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Add a quick actions section to the dashboard providing shortcuts to common tasks: create challenge, submit PR, join competition, and browse projects.

**Scope:**
- Build `QuickActions` component with icon buttons
- Actions: New Challenge, Submit PR, Join Competition, Browse Projects
- Each action navigates to the relevant creation/browsing page
- Show contextual actions based on user state

**Acceptance Criteria:**
- [ ] Quick actions panel visible on dashboard
- [ ] Each action navigates to correct page
- [ ] Icons match the app design system
- [ ] Actions adapt based on user's active items
- [ ] Hover tooltips explain each action

**Files likely affected:**
- `frontend/apps/app/src/components/dashboard/QuickActions.tsx` (new)
- `frontend/apps/app/src/app/dashboard/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #35: Implement Dashboard Projects List with Real Repos

**Labels:** `frontend`, `priority: high`, `dashboard`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Wire the dashboard projects page to display the user's actual GitHub repositories fetched via the GitHub App installation. Replace the static project cards.

**Scope:**
- Fetch repos using `setRepoAsync` thunk with actual user data
- Display repo list with name, description, language, stars, forks
- Add search/filter for repos
- Show open issues and PR count per repo

**Acceptance Criteria:**
- [ ] User's repos fetched via GitHub App
- [ ] Repos displayed in card/list view
- [ ] Language indicator with color dot
- [ ] Stars, forks, and issue counts shown
- [ ] Search/filter by name and language works

**Files likely affected:**
- `frontend/apps/app/src/app/dashboard/projects/page.tsx`
- `frontend/apps/app/src/context/redux/repoSlice.ts`
- `frontend/apps/app/src/app/api/repo/repos/route.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #36: Build Pending Tasks and Deadlines Widget

**Labels:** `frontend`, `priority: medium`, `dashboard`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a widget showing upcoming deadlines for joined challenges, active competitions, and proposal due dates. Help users track what needs attention.

**Scope:**
- Aggregate deadlines from challenges, competitions, and proposals
- Sort by nearest deadline
- Color-code urgency (red < 24h, yellow < 3 days, green > 3 days)
- Link each item to its detail page

**Acceptance Criteria:**
- [ ] Upcoming deadlines listed chronologically
- [ ] Color coding by urgency level
- [ ] Click navigates to challenge/competition page
- [ ] Empty state when no active deadlines
- [ ] Maximum 5 items shown with "View all" link

**Files likely affected:**
- `frontend/apps/app/src/components/dashboard/DeadlinesWidget.tsx` (new)
- `frontend/apps/app/src/app/dashboard/page.tsx`
- `frontend/apps/app/src/context/redux/challengeSlice.ts`
- `frontend/apps/app/src/context/redux/competitionSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #37: Add Welcome Banner for New Users

**Labels:** `frontend`, `priority: low`, `dashboard`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Show a dismissable welcome banner on the dashboard for new users that guides them to key actions: complete profile, take first challenge, and browse projects.

**Scope:**
- Build `WelcomeBanner` component with progress checklist
- Show 3-4 onboarding steps with completion checkmarks
- Persist dismissal in localStorage
- Link each step to relevant page

**Acceptance Criteria:**
- [ ] Banner shown for users with no activity
- [ ] Checklist items: Complete Profile, Join Challenge, Connect GitHub, Submit First PR
- [ ] Completed items show checkmark
- [ ] Dismiss button hides banner permanently
- [ ] Banner not shown for returning active users

**Files likely affected:**
- `frontend/apps/app/src/components/dashboard/WelcomeBanner.tsx` (new)
- `frontend/apps/app/src/app/dashboard/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #38: Build Challenge List Page with Filters

**Labels:** `frontend`, `priority: high`, `challenges`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a proper challenge browsing page that fetches challenges from Firebase and displays them with filtering by difficulty, category, and type. Replace the dummy data usage.

**Scope:**
- Fetch challenges from Firebase using `ChallengeService`
- Display as card grid with key info (name, difficulty, XP, deadline, participants)
- Add filter sidebar: difficulty (Beginner/Intermediate/Advanced), category, type (code/design/github)
- Add sort options (newest, most participants, highest XP)

**Acceptance Criteria:**
- [ ] Challenges fetched from Firebase on page load
- [ ] Filter by difficulty updates list reactively
- [ ] Filter by category narrows results
- [ ] Sort changes ordering
- [ ] Challenge card shows name, difficulty badge, XP, deadline countdown

**Files likely affected:**
- `frontend/apps/app/src/app/playground/challenges/page.tsx`
- `frontend/apps/app/src/components/challenges/ChallengeList.tsx` (new)
- `frontend/apps/app/src/components/challenges/ChallengeFilters.tsx` (new)
- `frontend/apps/app/src/lib/models/challenges.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #39: Enhance Create Challenge Dialog

**Labels:** `frontend`, `priority: high`, `challenges`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Complete the `CreateChallengeDialog` to handle all challenge types (code, design, github) with proper validation, and wire it to Firebase via the `ChallengeService`.

**Scope:**
- Add form fields for all challenge types (code template, design criteria, repo URL)
- Implement form validation with error messages
- Connect submit to `challengeService.createChallenge()`
- Add skill selector using existing `SkillSelector` component
- Show success toast and redirect to new challenge

**Acceptance Criteria:**
- [ ] All three challenge types creatable
- [ ] Form validates required fields before submission
- [ ] Challenge saved to Firebase on submit
- [ ] Success toast shown with link to new challenge
- [ ] Creator's wallet address set as `createdBy`

**Files likely affected:**
- `frontend/apps/app/src/components/challenges/CreateChallengeDialog.tsx`
- `frontend/apps/app/src/components/challenges/SkillSelector.tsx`
- `frontend/apps/app/src/lib/models/challenges.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #40: Build Challenge Detail Page

**Labels:** `frontend`, `priority: high`, `challenges`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a detail page for individual challenges showing full description, participants, deadline countdown, code template (for code challenges), and join/submit actions.

**Scope:**
- Create dynamic route `/playground/challenges/[id]`
- Display full challenge details including description, difficulty, category
- Show participant list with avatars
- Display countdown timer to deadline
- Conditionally show code editor, design criteria, or repo link based on type

**Acceptance Criteria:**
- [ ] Challenge details fully displayed
- [ ] Participant count and avatars shown
- [ ] Live countdown to deadline
- [ ] Code challenges show template in editor
- [ ] GitHub challenges link to repository

**Files likely affected:**
- `frontend/apps/app/src/app/playground/challenges/[id]/page.tsx` (new)
- `frontend/apps/app/src/components/challenges/ChallengeDetail.tsx` (new)
- `frontend/apps/app/src/lib/models/challenges.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #41: Implement Challenge Join Flow

**Labels:** `frontend`, `priority: high`, `challenges`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build the UX flow for joining a challenge: confirm action, add user to participants, update UI immediately, and handle errors. Currently `joinChallenge` exists in the service but has no UI trigger.

**Scope:**
- Add "Join Challenge" button on challenge detail/card
- Show confirmation dialog before joining
- Call `challengeService.joinChallenge()` with user's wallet address
- Update Redux state optimistically
- Disable join if deadline passed or already joined

**Acceptance Criteria:**
- [ ] Join button visible on unjoinable challenges
- [ ] Confirmation dialog explains commitment
- [ ] Participant count increments immediately
- [ ] Button changes to "Joined" state after joining
- [ ] Error handling if join fails

**Files likely affected:**
- `frontend/apps/app/src/components/challenges/ChallengeDialog.tsx`
- `frontend/apps/app/src/components/challenges/ChallengeDetail.tsx`
- `frontend/apps/app/src/lib/models/challenges.ts`
- `frontend/apps/app/src/context/redux/challengeSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #42: Build Challenge Submission Flow

**Labels:** `frontend`, `priority: high`, `challenges`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Implement the submission flow for completed challenges. Code challenges need code submission, design challenges need file upload, and GitHub challenges need PR URL submission.

**Scope:**
- Create `SubmissionForm` component with type-specific fields
- Code type: submit code from editor
- Design type: file upload with preview
- GitHub type: PR URL input with validation
- Call `challengeService.submitChallenge()` on submit

**Acceptance Criteria:**
- [ ] Submission form appears for joined users
- [ ] Code submissions capture editor content
- [ ] GitHub submissions validate PR URL format
- [ ] Submission status updates to "submitted"
- [ ] XP awarded after successful submission

**Files likely affected:**
- `frontend/apps/app/src/components/challenges/SubmissionForm.tsx` (new)
- `frontend/apps/app/src/app/playground/challenges/[id]/page.tsx`
- `frontend/apps/app/src/lib/models/challenges.ts`
- `frontend/apps/app/src/context/redux/xpSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #43: Add Challenge Difficulty Badges and Visual Indicators

**Labels:** `frontend`, `priority: low`, `challenges`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create consistent visual badges for challenge difficulty levels with colors and icons. Beginner = green, Intermediate = yellow, Advanced = red. Apply across all challenge displays.

**Scope:**
- Create `DifficultyBadge` component with color variants
- Add icon per difficulty (sprout, flame, skull)
- Use consistently in challenge cards, detail page, and lists
- Add tooltip explaining each difficulty level

**Acceptance Criteria:**
- [ ] Difficulty badge component with three variants
- [ ] Correct color per level (green/yellow/red)
- [ ] Icon displayed alongside text
- [ ] Tooltip explains expected skill level
- [ ] Used consistently across all challenge UIs

**Files likely affected:**
- `frontend/apps/app/src/components/challenges/DifficultyBadge.tsx` (new)
- `frontend/apps/app/src/app/playground/challenges/page.tsx`
- `frontend/apps/app/src/components/challenges/ChallengeDialog.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #44: Implement Challenge XP Reward Calculation

**Labels:** `frontend`, `priority: medium`, `challenges`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build the XP reward logic that calculates and distributes XP when a challenge is completed. XP should account for difficulty, completion time, and bonus multipliers.

**Scope:**
- Calculate base XP from challenge `xp` field
- Apply time bonus (faster completion = more XP)
- Apply streak multiplier if user has active streak
- Dispatch XP gain to `xpSlice`
- Show animated XP gain notification

**Acceptance Criteria:**
- [ ] Base XP awarded on challenge completion
- [ ] Time bonus calculated (up to 1.5x for fast completion)
- [ ] Streak multiplier applied if streak active
- [ ] XP gain animation shows total earned
- [ ] XP added to user's total in Redux

**Files likely affected:**
- `frontend/apps/app/src/lib/xp-calculator.ts` (new)
- `frontend/apps/app/src/context/redux/xpSlice.ts`
- `frontend/apps/app/src/components/challenges/SubmissionForm.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #45: Build Challenge Countdown Timer Component

**Labels:** `frontend`, `priority: medium`, `challenges`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a reusable countdown timer component that shows time remaining until a challenge deadline. Display days, hours, minutes, and seconds with visual urgency indicators.

**Scope:**
- Build `CountdownTimer` component accepting a deadline timestamp
- Update every second
- Show days:hours:minutes:seconds format
- Turn red when < 1 hour remains
- Show "Expired" when deadline passes

**Acceptance Criteria:**
- [ ] Timer counts down in real-time
- [ ] Format adapts (shows days if >1 day, hours if < 1 day)
- [ ] Visual urgency (color change at thresholds)
- [ ] Stops and shows "Expired" at deadline
- [ ] No memory leaks from interval

**Files likely affected:**
- `frontend/apps/app/src/components/challenges/CountdownTimer.tsx` (new)
- `frontend/apps/app/src/app/playground/challenges/[id]/page.tsx`
- `frontend/apps/app/src/components/challenges/ChallengeDialog.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #46: Add Challenge Categories with Icons

**Labels:** `frontend`, `priority: low`, `challenges`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Map challenge categories (Security, Optimization, Interoperability, NFT, DeFi) to icons and colors for visual distinction. Create a category selector for filtering and creation.

**Scope:**
- Define category → icon/color mapping
- Build `CategoryBadge` component
- Create `CategorySelector` for filter sidebar
- Use in create challenge dialog for category selection

**Acceptance Criteria:**
- [ ] Each category has distinct icon and color
- [ ] Category badge component reusable
- [ ] Category selector allows multi-select in filters
- [ ] Single-select in challenge creation
- [ ] Categories displayed on challenge cards

**Files likely affected:**
- `frontend/apps/app/src/components/challenges/CategoryBadge.tsx` (new)
- `frontend/apps/app/src/components/challenges/ChallengeFilters.tsx`
- `frontend/apps/app/src/components/challenges/CreateChallengeDialog.tsx`
- `frontend/apps/app/src/lib/constants/categories.ts` (new)

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #47: Implement Challenge Code Editor with Syntax Highlighting

**Labels:** `frontend`, `priority: high`, `challenges`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Replace the basic textarea in code challenges with a proper code editor featuring syntax highlighting, line numbers, and Solidity language support. The current `CodeEditor` component is a plain textarea.

**Scope:**
- Integrate Monaco Editor or CodeMirror for code challenges
- Add Solidity syntax highlighting
- Pre-fill editor with challenge `codeTemplate`
- Enable code submission from editor content
- Add basic linting/error indicators

**Acceptance Criteria:**
- [ ] Code editor has syntax highlighting for Solidity
- [ ] Line numbers displayed
- [ ] Challenge template pre-loaded
- [ ] Editor content extractable for submission
- [ ] Dark theme matching app design

**Files likely affected:**
- `frontend/apps/app/src/components/CodeEditor.tsx`
- `frontend/apps/app/src/app/playground/challenges/[id]/page.tsx`
- `frontend/apps/app/src/app/playground/editor/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #48: Build "My Challenges" Tab View

**Labels:** `frontend`, `priority: medium`, `challenges`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a "My Challenges" section showing challenges the user has joined, submitted, or completed. Group by status for easy tracking.

**Scope:**
- Create tabs: Active, Submitted, Completed
- Fetch user's challenges using `challengeService.getUserChallenges()`
- Show progress indicator per challenge
- Display XP earned from completed challenges

**Acceptance Criteria:**
- [ ] Three tabs showing challenges by status
- [ ] Active tab shows joined but not submitted
- [ ] Submitted tab shows pending review
- [ ] Completed tab shows XP earned
- [ ] Empty state per tab with CTA

**Files likely affected:**
- `frontend/apps/app/src/components/challenges/MyChallenges.tsx` (new)
- `frontend/apps/app/src/app/playground/challenges/page.tsx`
- `frontend/apps/app/src/lib/models/challenges.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #49: Add Challenge Search with AI Recommendations

**Labels:** `frontend`, `priority: medium`, `challenges`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Integrate the existing `AIProjectSearchService` to recommend challenges based on the user's skill profile. Show "Recommended for you" section on challenges page.

**Scope:**
- Use user's skills to query AI recommendation endpoint
- Display "Recommended" badge on matching challenges
- Show "Why this challenge?" explanation from AI
- Sort recommended challenges to top of list

**Acceptance Criteria:**
- [ ] "Recommended for You" section on challenges page
- [ ] Recommendations based on user's stored skills
- [ ] Each recommendation shows match reason
- [ ] Recommendations refresh when skills change
- [ ] Graceful fallback if AI service unavailable

**Files likely affected:**
- `frontend/apps/app/src/app/playground/challenges/page.tsx`
- `frontend/apps/app/src/lib/ai-search.ts`
- `frontend/apps/app/src/components/challenges/RecommendedChallenges.tsx` (new)

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #50: Implement Challenge Validation and Review System

**Labels:** `frontend`, `priority: medium`, `challenges`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build a review UI for challenge creators to validate submissions. Creators should be able to approve/reject submissions and provide feedback.

**Scope:**
- Create review page for challenge creators
- List all submissions for their challenges
- Add approve/reject buttons with feedback textarea
- Update submission status in Firebase
- Trigger XP award on approval

**Acceptance Criteria:**
- [ ] Creators see pending submissions for their challenges
- [ ] Approve button awards XP and marks complete
- [ ] Reject button sends feedback to submitter
- [ ] Submission code/URL viewable in review
- [ ] Only challenge creator can access review UI

**Files likely affected:**
- `frontend/apps/app/src/app/playground/challenges/[id]/review/page.tsx` (new)
- `frontend/apps/app/src/components/challenges/SubmissionReview.tsx` (new)
- `frontend/apps/app/src/lib/models/challenges.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #51: Add Challenge Statistics and Completion Rate

**Labels:** `frontend`, `priority: low`, `challenges`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Show statistics on each challenge card and detail page: completion rate, average time to complete, and participant count trend.

**Scope:**
- Calculate completion rate (completions / total participants)
- Display as percentage with progress ring
- Show average completion time
- Add participant trend mini-chart

**Acceptance Criteria:**
- [ ] Completion rate percentage displayed
- [ ] Visual progress ring on challenge cards
- [ ] Average completion time shown on detail page
- [ ] Stats update when new completions occur
- [ ] Handles zero-participant edge case

**Files likely affected:**
- `frontend/apps/app/src/components/challenges/ChallengeStats.tsx` (new)
- `frontend/apps/app/src/components/challenges/ChallengeDialog.tsx`
- `frontend/apps/app/src/app/playground/challenges/[id]/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #52: Implement Challenge Expiry and Archival

**Labels:** `frontend`, `priority: low`, `challenges`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Handle expired challenges gracefully: show "Expired" state, prevent new joins, archive old challenges, and allow creators to extend deadlines.

**Scope:**
- Check deadline on challenge load and disable join
- Show "Expired" badge on past-deadline challenges
- Move expired challenges to separate "Archive" tab
- Allow creators to extend deadline via edit

**Acceptance Criteria:**
- [ ] Expired challenges show "Expired" badge
- [ ] Join button disabled on expired challenges
- [ ] Archive tab accessible from challenges page
- [ ] Creators can extend deadline before expiry
- [ ] Submitted-but-not-reviewed challenges handled

**Files likely affected:**
- `frontend/apps/app/src/app/playground/challenges/page.tsx`
- `frontend/apps/app/src/components/challenges/ChallengeDialog.tsx`
- `frontend/apps/app/src/components/challenges/ChallengeList.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #53: Build Competition List and Browse Page

**Labels:** `frontend`, `priority: high`, `competitions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a competitions browsing page showing active, upcoming, and completed competitions with USDC prize pools. No competition page currently exists.

**Scope:**
- Create `/competitions` route and page
- Display competitions in tabs: Active, Upcoming, Completed
- Show prize pool, participants, and time remaining
- Add competition cards with key info

**Acceptance Criteria:**
- [ ] Competitions page accessible from navigation
- [ ] Three tabs filtering by time status
- [ ] Competition cards show title, prize, deadline, participants
- [ ] Active competitions show live countdown
- [ ] Empty states per tab

**Files likely affected:**
- `frontend/apps/app/src/app/competitions/page.tsx` (new)
- `frontend/apps/app/src/app/competitions/layout.tsx` (new)
- `frontend/apps/app/src/components/competitions/CompetitionCard.tsx` (new)
- `frontend/apps/app/src/components/layout/AppSidebar.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #54: Build Competition Detail Page

**Labels:** `frontend`, `priority: high`, `competitions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a detail page for individual competitions showing rules, prize breakdown, leaderboard, and participation options.

**Scope:**
- Create dynamic route `/competitions/[id]`
- Display competition rules and description
- Show prize pool breakdown (1st, 2nd, 3rd places)
- Display live leaderboard
- Show join/submission options

**Acceptance Criteria:**
- [ ] Full competition details displayed
- [ ] Prize distribution breakdown (e.g., 1st: 500 USDC, 2nd: 300 USDC)
- [ ] Live leaderboard with rankings
- [ ] Join button for eligible users
- [ ] Rules section clearly formatted

**Files likely affected:**
- `frontend/apps/app/src/app/competitions/[id]/page.tsx` (new)
- `frontend/apps/app/src/components/competitions/CompetitionDetail.tsx` (new)
- `frontend/apps/app/src/components/competitions/PrizeBreakdown.tsx` (new)

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #55: Implement Competition Registration Flow

**Labels:** `frontend`, `priority: high`, `competitions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build the flow for users to register for a competition, including eligibility checks, team formation (if applicable), and confirmation.

**Scope:**
- Add "Register" button on competition detail page
- Check eligibility (wallet connected, minimum level, etc.)
- Show registration confirmation with rules acceptance
- Update participant count in real-time
- Disable registration after competition starts

**Acceptance Criteria:**
- [ ] Register button visible for unregistered users
- [ ] Eligibility requirements checked before registration
- [ ] Terms acceptance checkbox required
- [ ] Participant count updates immediately
- [ ] Registration locked after start time

**Files likely affected:**
- `frontend/apps/app/src/app/competitions/[id]/page.tsx`
- `frontend/apps/app/src/components/competitions/RegisterDialog.tsx` (new)
- `frontend/apps/app/src/context/redux/competitionSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #56: Build Competition Leaderboard with Live Updates

**Labels:** `frontend`, `priority: high`, `competitions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a real-time competition leaderboard that updates as participants submit solutions and earn points during the competition window.

**Scope:**
- Build `CompetitionLeaderboard` component
- Subscribe to Firebase for live score updates
- Show rank, participant name, score, and submission count
- Highlight rank changes with animations
- Show current user's position prominently

**Acceptance Criteria:**
- [ ] Leaderboard updates in real-time without refresh
- [ ] Rank movement animated (up/down arrows)
- [ ] Current user's row always visible (pinned or highlighted)
- [ ] Score breakdown shown on hover
- [ ] Top 3 have special styling (gold/silver/bronze)

**Files likely affected:**
- `frontend/apps/app/src/components/competitions/CompetitionLeaderboard.tsx` (new)
- `frontend/apps/app/src/app/competitions/[id]/page.tsx`
- `frontend/apps/app/src/lib/firebase.config.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #57: Implement Competition Countdown and Status Banner

**Labels:** `frontend`, `priority: medium`, `competitions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build a prominent countdown banner for active competitions showing time remaining, and status indicators for upcoming/ended competitions.

**Scope:**
- Create `CompetitionBanner` with large countdown display
- Show "Starting in..." for upcoming competitions
- Show "Ends in..." for active competitions
- Show "Ended" with results link for completed
- Add progress bar showing time elapsed

**Acceptance Criteria:**
- [ ] Large countdown visible at top of competition page
- [ ] Time progress bar fills as competition progresses
- [ ] Status transitions handled (upcoming → active → ended)
- [ ] Urgency styling when < 1 hour remains
- [ ] Auto-refresh when competition starts/ends

**Files likely affected:**
- `frontend/apps/app/src/components/competitions/CompetitionBanner.tsx` (new)
- `frontend/apps/app/src/app/competitions/[id]/page.tsx`
- `frontend/apps/app/src/components/challenges/CountdownTimer.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #58: Build Competition Submission Interface

**Labels:** `frontend`, `priority: high`, `competitions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create the submission interface for active competitions where participants submit their solutions within the time window.

**Scope:**
- Build submission form specific to competition type
- Add code editor for coding competitions
- Show remaining time while submitting
- Allow multiple submissions (keep best score)
- Confirm submission with timestamp

**Acceptance Criteria:**
- [ ] Submission form accessible during competition window
- [ ] Code editor pre-loaded with competition template
- [ ] Submission locked after competition ends
- [ ] Multiple submissions allowed with latest used
- [ ] Submission confirmation with timestamp shown

**Files likely affected:**
- `frontend/apps/app/src/app/competitions/[id]/submit/page.tsx` (new)
- `frontend/apps/app/src/components/competitions/CompetitionSubmission.tsx` (new)
- `frontend/apps/app/src/components/CodeEditor.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #59: Implement Competition Results and Prize Display

**Labels:** `frontend`, `priority: medium`, `competitions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build the results page shown after a competition ends, displaying final rankings, prize distribution, and prize claim status.

**Scope:**
- Create results page with final leaderboard
- Show prize amounts per position
- Display "Claim Prize" button for winners
- Show participation certificate for all finishers
- Add share results functionality

**Acceptance Criteria:**
- [ ] Final rankings displayed after competition ends
- [ ] Prize amounts shown next to winner positions
- [ ] Winners see "Claim Prize" CTA (links to wallet transaction)
- [ ] Participation badge awarded to all finishers
- [ ] Share button generates social media card

**Files likely affected:**
- `frontend/apps/app/src/app/competitions/[id]/results/page.tsx` (new)
- `frontend/apps/app/src/components/competitions/Results.tsx` (new)
- `frontend/apps/app/src/components/competitions/PrizeClaim.tsx` (new)

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #60: Build Competition Creation Form (Admin)

**Labels:** `frontend`, `priority: medium`, `competitions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a form for creating new competitions with fields for title, description, start/end time, prize pool, rules, and scoring criteria.

**Scope:**
- Build multi-step creation form
- Step 1: Basic info (title, description, category)
- Step 2: Schedule (start time, end time, registration deadline)
- Step 3: Prizes (USDC amount, distribution tiers)
- Step 4: Rules and scoring criteria
- Save to Firebase

**Acceptance Criteria:**
- [ ] Multi-step form with progress indicator
- [ ] Date/time pickers for scheduling
- [ ] USDC prize pool input with tier distribution
- [ ] Rules editor with markdown support
- [ ] Preview before submission

**Files likely affected:**
- `frontend/apps/app/src/app/competitions/create/page.tsx` (new)
- `frontend/apps/app/src/components/competitions/CreateCompetitionForm.tsx` (new)
- `frontend/apps/app/src/context/redux/competitionSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #61: Add Competition Categories and Tags

**Labels:** `frontend`, `priority: low`, `competitions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Implement categorization for competitions (Smart Contracts, Frontend, Security, DeFi) with filterable tags on the browse page.

**Scope:**
- Define competition categories with icons
- Add category filter to competition list page
- Show category tags on competition cards
- Allow multi-category selection in creation

**Acceptance Criteria:**
- [ ] Competition cards show category tag
- [ ] Filter panel allows category selection
- [ ] Multiple categories per competition supported
- [ ] Category icons displayed consistently
- [ ] Filter state preserved in URL params

**Files likely affected:**
- `frontend/apps/app/src/app/competitions/page.tsx`
- `frontend/apps/app/src/components/competitions/CompetitionFilters.tsx` (new)
- `frontend/apps/app/src/lib/constants/categories.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #62: Implement Competition Team Formation

**Labels:** `frontend`, `priority: medium`, `competitions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Add team competition support where users can form teams, invite members, and compete together. Team submissions share prize pool.

**Scope:**
- Add team size option to competition creation
- Build team invitation flow (via wallet address or username)
- Show team members on leaderboard entry
- Handle team submission vs individual submission

**Acceptance Criteria:**
- [ ] Team competitions show "Form Team" button
- [ ] Team leader can invite up to N members
- [ ] Invitees receive notification to accept/decline
- [ ] Team name displayed on leaderboard
- [ ] Prize split among team members

**Files likely affected:**
- `frontend/apps/app/src/components/competitions/TeamFormation.tsx` (new)
- `frontend/apps/app/src/app/competitions/[id]/page.tsx`
- `frontend/apps/app/src/context/redux/competitionSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #63: Build Competition History and Statistics

**Labels:** `frontend`, `priority: low`, `competitions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a user's competition history page showing past participations, rankings, prizes won, and performance trends.

**Scope:**
- Display list of past competitions with user's rank
- Show total prizes earned
- Chart performance over time
- Highlight best achievements

**Acceptance Criteria:**
- [ ] List of completed competitions with user's final rank
- [ ] Total USDC earned from competitions displayed
- [ ] Performance trend chart over time
- [ ] Filter by won/participated/all
- [ ] Link to competition results page

**Files likely affected:**
- `frontend/apps/app/src/app/competitions/history/page.tsx` (new)
- `frontend/apps/app/src/components/competitions/CompetitionHistory.tsx` (new)

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #64: Add Competition Rules and Scoring Explanation

**Labels:** `frontend`, `priority: medium`, `competitions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build a clear rules display component that explains scoring criteria, allowed tools, submission format, and disqualification conditions for each competition.

**Scope:**
- Create `RulesSection` component with expandable sections
- Display scoring breakdown (speed, correctness, gas efficiency, etc.)
- Show allowed/disallowed tools list
- Add FAQ accordion for common questions

**Acceptance Criteria:**
- [ ] Rules clearly formatted with headings
- [ ] Scoring criteria breakdown with weights
- [ ] Expandable FAQ section
- [ ] Rules viewable before and during competition
- [ ] Disqualification conditions listed

**Files likely affected:**
- `frontend/apps/app/src/components/competitions/RulesSection.tsx` (new)
- `frontend/apps/app/src/app/competitions/[id]/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #65: Implement Competition Notifications and Reminders

**Labels:** `frontend`, `priority: low`, `competitions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Add notification triggers for competition events: registration open, starting soon (1h before), ended, results available, and prize claimable.

**Scope:**
- Schedule notifications for registered competition events
- Show in-app toast for imminent start (if user is online)
- Add to notification slice with competition type
- Allow users to set reminders for upcoming competitions

**Acceptance Criteria:**
- [ ] Notification sent when registered competition starts
- [ ] Toast notification 1 hour before start
- [ ] Results available notification sent
- [ ] Prize claim reminder for winners
- [ ] Notification preferences respected

**Files likely affected:**
- `frontend/apps/app/src/context/redux/notificationSlice.ts`
- `frontend/apps/app/src/components/competitions/CompetitionReminders.tsx` (new)
- `frontend/apps/app/src/app/settings/notifications/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #66: Wire GitHub PR List to Real Data

**Labels:** `frontend`, `priority: high`, `contributions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Replace the hardcoded PR list on the contributions page with real PRs fetched from the user's GitHub repositories via the Octokit integration.

**Scope:**
- Fetch open and merged PRs using GitHub App installation
- Display PR title, status, repo name, and creation date
- Add filters: open, merged, closed
- Show review status and comment count

**Acceptance Criteria:**
- [ ] Real PRs fetched from user's repos
- [ ] Status badges (open/merged/closed) shown
- [ ] Filter tabs work correctly
- [ ] PR links open in new tab to GitHub
- [ ] Loading state and empty state handled

**Files likely affected:**
- `frontend/apps/app/src/app/contributions/my-prs/page.tsx`
- `frontend/apps/app/src/backend/octokit.ts`
- `frontend/apps/app/src/app/api/repo/repos/route.ts`
- `frontend/apps/app/src/context/redux/repoSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #67: Build Issues Tracking Page

**Labels:** `frontend`, `priority: high`, `contributions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Wire the contributions issues page to display real open issues from user's repos and recommended "good first issues" from the wider ecosystem using the AI search.

**Scope:**
- Fetch open issues from user's repos
- Display issue title, labels, assignees, and repo
- Add "Recommended Issues" section using AI service
- Filter by label (bug, enhancement, good-first-issue)

**Acceptance Criteria:**
- [ ] Open issues from user's repos displayed
- [ ] Labels shown with appropriate colors
- [ ] Recommended issues section powered by AI
- [ ] Click issue opens GitHub in new tab
- [ ] Filter by label works

**Files likely affected:**
- `frontend/apps/app/src/app/contributions/issues/page.tsx`
- `frontend/apps/app/src/backend/octokit.ts`
- `frontend/apps/app/src/lib/ai-search.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #68: Implement Contribution Verification System

**Labels:** `frontend`, `priority: high`, `contributions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build a system that verifies GitHub contributions (merged PRs) and awards XP automatically. Verification should check that the PR was authored by the connected GitHub account and merged into the target repo.

**Scope:**
- Listen for PR merge events via GitHub webhooks or polling
- Verify PR author matches connected GitHub username
- Award XP based on PR size/complexity
- Display verification status on contributions page

**Acceptance Criteria:**
- [ ] Merged PRs automatically detected
- [ ] Verification confirms PR authorship
- [ ] XP awarded for verified contributions
- [ ] Verification badge shown on contribution card
- [ ] Manual verify button as fallback

**Files likely affected:**
- `frontend/apps/app/src/lib/contribution-verifier.ts` (new)
- `frontend/apps/app/src/app/contributions/page.tsx`
- `frontend/apps/app/src/context/redux/xpSlice.ts`
- `frontend/apps/app/src/backend/octokit.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #69: Build Contribution Rewards Page

**Labels:** `frontend`, `priority: medium`, `contributions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Wire the rewards page to show actual XP earned from contributions, badges unlocked, and USDC rewards from completed challenges tied to contributions.

**Scope:**
- Display total XP from contributions
- Show breakdown by contribution type (PR, issue, review)
- List badges earned from contribution milestones
- Show USDC rewards from contribution-based challenges

**Acceptance Criteria:**
- [ ] Total contribution XP displayed
- [ ] Breakdown chart by type
- [ ] Badges section shows earned contribution badges
- [ ] USDC rewards listed with claim status
- [ ] Historical rewards timeline

**Files likely affected:**
- `frontend/apps/app/src/app/contributions/rewards/page.tsx`
- `frontend/apps/app/src/context/redux/xpSlice.ts`
- `frontend/apps/app/src/components/dashboard/BadgeGrid.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #70: Implement GitHub Repository Connection Flow

**Labels:** `frontend`, `priority: high`, `contributions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build the flow for users to connect specific GitHub repositories to their LazyDev profile so contributions to those repos are tracked and rewarded.

**Scope:**
- Show list of user's repos from GitHub App installation
- Allow selecting repos to track
- Save tracked repos to Firebase user profile
- Display tracked repos in settings

**Acceptance Criteria:**
- [ ] User's repos listed with checkboxes
- [ ] Selected repos saved to profile
- [ ] Tracked repos shown in settings/profile
- [ ] Can add/remove tracked repos anytime
- [ ] Only repos with GitHub App installed shown

**Files likely affected:**
- `frontend/apps/app/src/app/settings/account/page.tsx`
- `frontend/apps/app/src/components/contributions/RepoSelector.tsx` (new)
- `frontend/apps/app/src/context/redux/repoSlice.ts`
- `frontend/apps/app/src/backend/octokit.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #71: Build PR Activity Timeline

**Labels:** `frontend`, `priority: medium`, `contributions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a timeline view showing the user's PR activity: opened, reviewed, merged, and closed events over time with visual markers.

**Scope:**
- Fetch PR events timeline from GitHub
- Display as vertical timeline with event cards
- Show event type icons (open, review, merge, close)
- Filter by date range and repo

**Acceptance Criteria:**
- [ ] Timeline shows chronological PR events
- [ ] Event type icons differentiate activities
- [ ] Date range filter works
- [ ] Repo filter narrows to specific repository
- [ ] Infinite scroll for older events

**Files likely affected:**
- `frontend/apps/app/src/components/contributions/PRTimeline.tsx` (new)
- `frontend/apps/app/src/app/contributions/my-prs/page.tsx`
- `frontend/apps/app/src/backend/octokit.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #72: Implement Contribution Analytics Charts

**Labels:** `frontend`, `priority: medium`, `contributions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Add recharts-based analytics to the contributions section showing contribution frequency, language breakdown, and most active repos.

**Scope:**
- Line chart: contributions per week
- Pie chart: language breakdown of contributions
- Bar chart: top repos by contribution count
- Heatmap: contribution time-of-day patterns

**Acceptance Criteria:**
- [ ] Weekly contribution line chart renders
- [ ] Language pie chart shows top 5 languages
- [ ] Top repos bar chart shows contribution counts
- [ ] Charts use real data from GitHub API
- [ ] Loading skeletons for chart areas

**Files likely affected:**
- `frontend/apps/app/src/components/contributions/ContributionCharts.tsx` (new)
- `frontend/apps/app/src/app/contributions/page.tsx`
- `frontend/apps/app/src/backend/octokit.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #73: Add Contribution Goal Setting

**Labels:** `frontend`, `priority: low`, `contributions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Allow users to set weekly/monthly contribution goals (e.g., "5 PRs this week") and track progress toward them with visual indicators.

**Scope:**
- Build goal setting UI in contributions page
- Track progress against set goal
- Show progress bar with current/target
- Send reminder notifications when behind

**Acceptance Criteria:**
- [ ] User can set weekly PR/contribution goal
- [ ] Progress bar shows current vs target
- [ ] Goal persists in Firebase profile
- [ ] Notification when falling behind
- [ ] Celebration when goal achieved

**Files likely affected:**
- `frontend/apps/app/src/components/contributions/GoalTracker.tsx` (new)
- `frontend/apps/app/src/app/contributions/page.tsx`
- `frontend/apps/app/src/context/redux/notificationSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #74: Build Code Review Contribution Tracking

**Labels:** `frontend`, `priority: medium`, `contributions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Track and display code reviews given by the user as contributions. Reviews should earn XP and count toward contribution streaks.

**Scope:**
- Fetch review comments from GitHub API
- Display reviews given with context (PR title, repo)
- Award XP for review contributions
- Show review count in contribution stats

**Acceptance Criteria:**
- [ ] Code reviews listed in contributions
- [ ] Review shows target PR and repo
- [ ] XP awarded for reviews (less than PRs)
- [ ] Reviews count toward streak
- [ ] Filter contributions to show only reviews

**Files likely affected:**
- `frontend/apps/app/src/app/contributions/page.tsx`
- `frontend/apps/app/src/backend/octokit.ts`
- `frontend/apps/app/src/context/redux/xpSlice.ts`
- `frontend/apps/app/src/lib/contribution-verifier.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #75: Implement Contribution Sharing and Social Cards

**Labels:** `frontend`, `priority: low`, `contributions`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Add ability to share contributions as social media cards showing the user's stats, recent achievements, and contribution graph.

**Scope:**
- Generate shareable card image/link with user stats
- Include contribution graph, XP, and level
- Add share buttons (Twitter, LinkedIn, copy link)
- Create OG image for shared links

**Acceptance Criteria:**
- [ ] Share button on contributions page
- [ ] Generated card shows key stats
- [ ] Twitter share pre-fills text with stats
- [ ] Copy link generates shareable URL
- [ ] OG meta tags for shared links

**Files likely affected:**
- `frontend/apps/app/src/components/contributions/ShareCard.tsx` (new)
- `frontend/apps/app/src/app/api/og/route.tsx` (new)
- `frontend/apps/app/src/app/contributions/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #76: Wire Submit Proposal Form to Firebase

**Labels:** `frontend`, `priority: high`, `proposals`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Connect the existing submit-proposal form to Firebase so proposals are actually persisted. Currently the form just logs to console.

**Scope:**
- Create proposal document in Firebase on submit
- Add creator's wallet address as author
- Generate unique proposal ID
- Redirect to proposal detail page after creation
- Show success/error toast

**Acceptance Criteria:**
- [ ] Form submission creates Firebase document
- [ ] Proposal includes all form fields plus metadata
- [ ] Success toast shown with proposal link
- [ ] Error handling for failed submissions
- [ ] Redirect to new proposal detail page

**Files likely affected:**
- `frontend/apps/app/src/app/dashboard/submit-proposal/page.tsx`
- `frontend/apps/app/src/lib/models/proposals.ts` (new)
- `frontend/apps/app/src/context/redux/proposalSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #77: Build Proposal Browse/List Page

**Labels:** `frontend`, `priority: high`, `proposals`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a page listing all active proposals that users can browse, filter, and join. Currently proposals can be created but there's no way to discover existing ones.

**Scope:**
- Create `/proposals` route and page
- Fetch proposals from Firebase
- Display as cards with title, description excerpt, reward pool, contributor slots
- Filter by status (open, in-progress, completed)
- Sort by newest, most funded, most contributors

**Acceptance Criteria:**
- [ ] Proposals page accessible from navigation
- [ ] Proposals displayed as cards
- [ ] Status filter (open/in-progress/completed) works
- [ ] Sort options change ordering
- [ ] Each card links to detail page

**Files likely affected:**
- `frontend/apps/app/src/app/proposals/page.tsx` (new)
- `frontend/apps/app/src/app/proposals/layout.tsx` (new)
- `frontend/apps/app/src/components/proposals/ProposalCard.tsx` (new)
- `frontend/apps/app/src/components/layout/AppSidebar.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #78: Build Proposal Detail Page

**Labels:** `frontend`, `priority: high`, `proposals`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a detail page for individual proposals showing full description, contributor list, reward pool, deadline, and actions (join, leave, mark complete).

**Scope:**
- Create dynamic route `/proposals/[id]`
- Display all proposal fields
- Show contributor list with roles
- Display reward pool and distribution
- Add action buttons based on user's relationship to proposal

**Acceptance Criteria:**
- [ ] Full proposal details displayed
- [ ] Contributors listed with their wallet addresses
- [ ] Reward pool and deadline shown
- [ ] "Join" button for non-contributors
- [ ] "Leave" button for current contributors
- [ ] Privacy indicator (public/private)

**Files likely affected:**
- `frontend/apps/app/src/app/proposals/[id]/page.tsx` (new)
- `frontend/apps/app/src/components/proposals/ProposalDetail.tsx` (new)
- `frontend/apps/app/src/context/redux/proposalSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #79: Implement Join Proposal Flow

**Labels:** `frontend`, `priority: medium`, `proposals`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build the flow for users to request to join a proposal as a contributor. Include wallet address verification and skill matching.

**Scope:**
- Add "Request to Join" button on proposal detail
- Show user's relevant skills
- Submit join request to proposal creator
- Creator approves/rejects in their dashboard
- Notification on approval/rejection

**Acceptance Criteria:**
- [ ] Join request button on open proposals
- [ ] User's skills shown for creator context
- [ ] Request saved to proposal in Firebase
- [ ] Creator receives notification of request
- [ ] Approved contributors added to list

**Files likely affected:**
- `frontend/apps/app/src/app/proposals/[id]/page.tsx`
- `frontend/apps/app/src/components/proposals/JoinRequestDialog.tsx` (new)
- `frontend/apps/app/src/context/redux/proposalSlice.ts`
- `frontend/apps/app/src/context/redux/notificationSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #80: Build Proposal Contributor Management

**Labels:** `frontend`, `priority: medium`, `proposals`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a management interface for proposal creators to add/remove contributors, assign roles, and track each contributor's progress.

**Scope:**
- List contributors with status (active, pending, removed)
- Allow creator to add contributors by wallet address
- Assign roles (lead, developer, reviewer)
- Track contribution status per member
- Remove contributors with confirmation

**Acceptance Criteria:**
- [ ] Contributors listed with roles and status
- [ ] Add contributor by wallet/username
- [ ] Assign/change roles via dropdown
- [ ] Remove with confirmation dialog
- [ ] Only proposal creator can manage

**Files likely affected:**
- `frontend/apps/app/src/app/proposals/[id]/manage/page.tsx` (new)
- `frontend/apps/app/src/components/proposals/ContributorManager.tsx` (new)
- `frontend/apps/app/src/context/redux/proposalSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #81: Implement Proposal Status Tracking

**Labels:** `frontend`, `priority: medium`, `proposals`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build status tracking for proposals: draft → open → in-progress → review → completed/cancelled. Show status transitions in a visual timeline.

**Scope:**
- Create status step indicator component
- Allow creator to advance status
- Show status change history with timestamps
- Trigger notifications on status changes
- Different UI states per status

**Acceptance Criteria:**
- [ ] Step indicator shows current status
- [ ] Creator can advance to next status
- [ ] Status history timeline with timestamps
- [ ] Contributors notified on status change
- [ ] Completed status triggers reward distribution

**Files likely affected:**
- `frontend/apps/app/src/components/proposals/StatusTracker.tsx` (new)
- `frontend/apps/app/src/app/proposals/[id]/page.tsx`
- `frontend/apps/app/src/context/redux/proposalSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #82: Add Proposal Reward Pool Display and Claim

**Labels:** `frontend`, `priority: medium`, `proposals`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Show the proposal's ETH reward pool prominently and implement the claim flow when a proposal is completed. Display how rewards will be distributed among contributors.

**Scope:**
- Display reward pool amount in ETH/USDC
- Show distribution plan (equal split or custom)
- Build claim button for completed proposals
- Trigger wallet transaction for reward claim
- Show claim status (pending, claimed, failed)

**Acceptance Criteria:**
- [ ] Reward pool displayed on proposal detail
- [ ] Distribution plan shows per-contributor amounts
- [ ] Claim button appears when proposal completed
- [ ] Transaction modal shows for on-chain claim
- [ ] Claim status tracked and displayed

**Files likely affected:**
- `frontend/apps/app/src/components/proposals/RewardPool.tsx` (new)
- `frontend/apps/app/src/app/proposals/[id]/page.tsx`
- `frontend/apps/app/src/hooks/useTransaction.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #83: Build My Proposals Dashboard Section

**Labels:** `frontend`, `priority: medium`, `proposals`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a "My Proposals" section showing proposals the user created and proposals they've joined, with quick-access management actions.

**Scope:**
- Tab view: Created / Joined
- Show status, contributor count, and deadline per proposal
- Quick actions: Edit (for created), Leave (for joined)
- Link to full detail page

**Acceptance Criteria:**
- [ ] Created proposals tab shows user's proposals
- [ ] Joined proposals tab shows proposals user contributes to
- [ ] Status badges per proposal
- [ ] Quick action buttons functional
- [ ] Empty states with CTA to create/browse

**Files likely affected:**
- `frontend/apps/app/src/components/proposals/MyProposals.tsx` (new)
- `frontend/apps/app/src/app/dashboard/page.tsx`
- `frontend/apps/app/src/context/redux/proposalSlice.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #84: Build DAO Governance Overview Page

**Labels:** `frontend`, `priority: medium`, `dao`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a DAO governance page showing active governance proposals, voting power, and token holdings. This is the hub for community decision-making.

**Scope:**
- Create `/governance` route and page
- Display user's governance token balance
- Show active governance proposals
- Display user's voting power and delegation status
- Link to proposal details and voting

**Acceptance Criteria:**
- [ ] Governance page accessible from navigation
- [ ] Token balance displayed prominently
- [ ] Active proposals listed with vote counts
- [ ] Voting power calculated and shown
- [ ] Page explains governance participation

**Files likely affected:**
- `frontend/apps/app/src/app/governance/page.tsx` (new)
- `frontend/apps/app/src/app/governance/layout.tsx` (new)
- `frontend/apps/app/src/components/governance/GovernanceOverview.tsx` (new)
- `frontend/apps/app/src/components/layout/AppSidebar.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #85: Implement Governance Proposal Voting UI

**Labels:** `frontend`, `priority: high`, `dao`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build the voting interface for governance proposals where token holders can vote For, Against, or Abstain on community proposals.

**Scope:**
- Create voting interface with For/Against/Abstain buttons
- Display current vote tally with percentages
- Show voting period countdown
- Require wallet connection for voting
- Submit vote as on-chain transaction

**Acceptance Criteria:**
- [ ] Three voting buttons (For/Against/Abstain)
- [ ] Current vote tally displayed as bar chart
- [ ] Voting period countdown shown
- [ ] Transaction confirmation before vote submission
- [ ] User's vote recorded and shown

**Files likely affected:**
- `frontend/apps/app/src/app/governance/[id]/page.tsx` (new)
- `frontend/apps/app/src/components/governance/VotingPanel.tsx` (new)
- `frontend/apps/app/src/hooks/useTransaction.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #86: Build Governance Proposal Creation Form

**Labels:** `frontend`, `priority: medium`, `dao`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a form for token holders to submit new governance proposals. Proposals need title, description, execution actions, and voting parameters.

**Scope:**
- Build proposal creation form with markdown editor
- Add execution action fields (contract calls)
- Set voting period duration
- Require minimum token threshold to create
- Preview proposal before submission

**Acceptance Criteria:**
- [ ] Form validates all required fields
- [ ] Markdown editor for description
- [ ] Execution actions definable
- [ ] Minimum token balance checked
- [ ] Preview mode before final submission

**Files likely affected:**
- `frontend/apps/app/src/app/governance/create/page.tsx` (new)
- `frontend/apps/app/src/components/governance/CreateProposalForm.tsx` (new)

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #87: Display Governance Token Balance and Delegation

**Labels:** `frontend`, `priority: medium`, `dao`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Show the user's governance token balance and allow them to delegate voting power to another address. Display delegation status and delegatee.

**Scope:**
- Fetch token balance from smart contract
- Show delegation status (self or delegated)
- Build delegate UI with address input
- Show delegator count if receiving delegation
- Transaction flow for delegation change

**Acceptance Criteria:**
- [ ] Token balance fetched from chain
- [ ] Current delegation target shown
- [ ] Delegate button opens delegation form
- [ ] Transaction required to change delegation
- [ ] Undelegation possible

**Files likely affected:**
- `frontend/apps/app/src/components/governance/TokenBalance.tsx` (new)
- `frontend/apps/app/src/components/governance/DelegateForm.tsx` (new)
- `frontend/apps/app/src/app/governance/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #88: Build Governance Proposal Timeline

**Labels:** `frontend`, `priority: low`, `dao`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Show the lifecycle of a governance proposal: Created → Pending → Active → Succeeded/Defeated → Queued → Executed, with timestamps for each transition.

**Scope:**
- Create timeline visualization component
- Show current state prominently
- Display timestamp per state transition
- Explain what each state means
- Show expected timeline for future states

**Acceptance Criteria:**
- [ ] Timeline shows all proposal states
- [ ] Current state highlighted
- [ ] Past states show timestamps
- [ ] Future states show estimates
- [ ] State descriptions in tooltips

**Files likely affected:**
- `frontend/apps/app/src/components/governance/ProposalTimeline.tsx` (new)
- `frontend/apps/app/src/app/governance/[id]/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #89: Implement Governance Vote History

**Labels:** `frontend`, `priority: low`, `dao`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Show the user's voting history across all governance proposals with their vote choice, voting power used, and proposal outcome.

**Scope:**
- Fetch user's past votes from on-chain data
- Display list with proposal title, vote choice, and outcome
- Show voting power used per vote
- Calculate participation rate

**Acceptance Criteria:**
- [ ] Past votes listed chronologically
- [ ] Vote choice shown (For/Against/Abstain)
- [ ] Proposal outcome shown (Passed/Failed)
- [ ] Participation rate calculated
- [ ] Link to full proposal details

**Files likely affected:**
- `frontend/apps/app/src/app/governance/history/page.tsx` (new)
- `frontend/apps/app/src/components/governance/VoteHistory.tsx` (new)

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #90: Add Governance Quorum and Threshold Display

**Labels:** `frontend`, `priority: low`, `dao`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Display quorum requirements and passing thresholds on governance proposals. Show progress toward quorum with visual indicator.

**Scope:**
- Fetch quorum requirement from governance contract
- Display quorum progress bar
- Show passing threshold percentage
- Indicate if quorum reached
- Explain quorum/threshold in tooltip

**Acceptance Criteria:**
- [ ] Quorum progress bar shown on active proposals
- [ ] "Quorum reached" indicator when threshold met
- [ ] Passing threshold percentage displayed
- [ ] Visual distinction between quorum and approval
- [ ] Tooltip explains requirements

**Files likely affected:**
- `frontend/apps/app/src/components/governance/QuorumDisplay.tsx` (new)
- `frontend/apps/app/src/app/governance/[id]/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #91: Integrate Monaco Editor for Playground

**Labels:** `frontend`, `priority: high`, `playground`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Replace the basic textarea in the playground code editor with Monaco Editor (VS Code's editor) supporting Solidity, JavaScript, and Rust with autocomplete and error detection.

**Scope:**
- Install and configure `@monaco-editor/react`
- Add language support for Solidity, JavaScript, Rust
- Configure dark theme matching app design
- Add file tabs for multiple files
- Implement save/load from localStorage

**Acceptance Criteria:**
- [ ] Monaco Editor renders in playground
- [ ] Solidity syntax highlighting works
- [ ] Autocomplete suggestions appear
- [ ] Dark theme matches app colors
- [ ] Multiple file tabs functional

**Files likely affected:**
- `frontend/apps/app/src/components/CodeEditor.tsx`
- `frontend/apps/app/src/app/playground/editor/page.tsx`
- `frontend/apps/app/src/app/playground/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #92: Build Smart Contract Template Library

**Labels:** `frontend`, `priority: medium`, `playground`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create a template library for the playground with pre-built smart contract templates (ERC20, ERC721, DeFi swap, staking) that users can load and modify.

**Scope:**
- Define template catalog with name, description, and code
- Build template browser UI with categories
- Load template into editor on selection
- Add "Start from template" button
- Support Solidity and Rust templates

**Acceptance Criteria:**
- [ ] Template library accessible from playground
- [ ] At least 8 templates available (ERC20, ERC721, etc.)
- [ ] Clicking template loads code into editor
- [ ] Template description explains use case
- [ ] Categories: Token, NFT, DeFi, Governance

**Files likely affected:**
- `frontend/apps/app/src/app/playground/smart-contracts/page.tsx`
- `frontend/apps/app/src/lib/templates/contracts.ts` (new)
- `frontend/apps/app/src/components/playground/TemplateLibrary.tsx` (new)

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #93: Implement Code Execution Sandbox

**Labels:** `frontend`, `priority: high`, `playground`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Build a code execution environment that can compile and run Solidity code in the browser, showing compilation results, ABI output, and deployment simulation.

**Scope:**
- Integrate Solidity compiler (solc-js) for browser compilation
- Display compilation output (ABI, bytecode, errors)
- Add "Compile" and "Deploy to Testnet" buttons
- Show gas estimation for deployment
- Display contract interaction UI after deployment

**Acceptance Criteria:**
- [ ] Solidity code compiles in browser
- [ ] Compilation errors shown inline
- [ ] ABI displayed after successful compilation
- [ ] Gas estimate shown before deployment
- [ ] Deploy to connected testnet works

**Files likely affected:**
- `frontend/apps/app/src/components/playground/Compiler.tsx` (new)
- `frontend/apps/app/src/app/playground/editor/page.tsx`
- `frontend/apps/app/src/components/CodeEditor.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #94: Build Web3 Interaction Panel

**Labels:** `frontend`, `priority: medium`, `playground`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Create an interactive panel for the Web3 playground page that lets users call contract functions, read blockchain state, and send test transactions.

**Scope:**
- Build contract interaction form from ABI
- Support read (call) and write (send) functions
- Display return values and transaction receipts
- Show connected wallet context
- Add pre-configured testnet contracts

**Acceptance Criteria:**
- [ ] Contract address input with ABI paste
- [ ] Function list generated from ABI
- [ ] Read functions return values immediately
- [ ] Write functions trigger wallet transaction
- [ ] Transaction receipt displayed with status

**Files likely affected:**
- `frontend/apps/app/src/app/playground/web3/page.tsx`
- `frontend/apps/app/src/components/playground/ContractInteraction.tsx` (new)
- `frontend/apps/app/src/hooks/useTransaction.ts`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #95: Add Playground Code Sharing

**Labels:** `frontend`, `priority: low`, `playground`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Allow users to share playground code snippets via shareable links. Include the code, language, and optional description in the shared link.

**Scope:**
- Encode code content into shareable URL parameter or short ID
- Save shared snippets to Firebase
- Build "Share" button in editor toolbar
- Create shared snippet view page
- Copy link to clipboard functionality

**Acceptance Criteria:**
- [ ] Share button in editor generates link
- [ ] Shared link loads code in read-only view
- [ ] Code language preserved in share
- [ ] Copy link button with success feedback
- [ ] Optional title/description for shared code

**Files likely affected:**
- `frontend/apps/app/src/app/playground/shared/[id]/page.tsx` (new)
- `frontend/apps/app/src/components/playground/ShareButton.tsx` (new)
- `frontend/apps/app/src/app/playground/editor/page.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #96: Implement Responsive Mobile Layout

**Labels:** `frontend`, `priority: high`, `ui-ux`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Make the entire application responsive for mobile devices. Currently the layout uses fixed grid columns that break on small screens, and the sidebar doesn't collapse properly on mobile.

**Scope:**
- Fix sidebar behavior on mobile (full overlay with close)
- Make all grid layouts responsive (1 column on mobile)
- Adjust font sizes and padding for mobile
- Fix dashboard cards stacking on mobile
- Test on 375px and 768px breakpoints

**Acceptance Criteria:**
- [ ] Sidebar collapses to hamburger menu on mobile
- [ ] All pages readable on 375px width
- [ ] No horizontal scrolling on any page
- [ ] Touch-friendly tap targets (min 44px)
- [ ] Forms usable on mobile

**Files likely affected:**
- `frontend/apps/app/src/components/layout/AppSidebar.tsx`
- `frontend/apps/app/src/components/layout/DashboardLayout.tsx`
- `frontend/apps/app/src/app/dashboard/page.tsx`
- `frontend/apps/app/src/app/globals.css`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #97: Add Loading States and Skeletons Across App

**Labels:** `frontend`, `priority: high`, `ui-ux`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Implement consistent loading states using the existing `skeleton.tsx` component across all data-fetching pages. Currently pages either show nothing or flash between states.

**Scope:**
- Add skeleton loaders for dashboard cards
- Add skeleton loaders for challenge lists
- Add skeleton loaders for contribution lists
- Add skeleton for analytics charts
- Use existing `Skeleton` component from `ui/skeleton.tsx`

**Acceptance Criteria:**
- [ ] Dashboard shows card skeletons while loading
- [ ] Challenge list shows placeholder skeletons
- [ ] Contribution page shows skeleton items
- [ ] Charts show placeholder rectangles
- [ ] Skeletons animate with pulse effect

**Files likely affected:**
- `frontend/apps/app/src/app/dashboard/page.tsx`
- `frontend/apps/app/src/app/playground/challenges/page.tsx`
- `frontend/apps/app/src/app/contributions/page.tsx`
- `frontend/apps/app/src/app/dashboard/analytics/page.tsx`
- `frontend/apps/app/src/components/ui/skeleton.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #98: Implement Error Boundaries and Fallback UI

**Labels:** `frontend`, `priority: high`, `ui-ux`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Add React Error Boundaries to catch rendering errors and display friendly fallback UIs instead of white screens. Critical for API failures and wallet disconnections.

**Scope:**
- Create `ErrorBoundary` component with retry button
- Add error boundaries around major page sections
- Create `ErrorFallback` component with appropriate messaging
- Handle specific errors: network, auth, Firebase
- Add global error boundary in root layout

**Acceptance Criteria:**
- [ ] Rendering errors show fallback UI instead of crash
- [ ] Retry button attempts to re-render failed component
- [ ] Network errors show "Connection lost" message
- [ ] Auth errors redirect to login
- [ ] Error details logged to console in dev

**Files likely affected:**
- `frontend/apps/app/src/components/ErrorBoundary.tsx` (new)
- `frontend/apps/app/src/components/ErrorFallback.tsx` (new)
- `frontend/apps/app/src/app/layout.tsx`
- `frontend/apps/app/src/app/dashboard/layout.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #99: Add Accessibility (a11y) Improvements

**Labels:** `frontend`, `priority: medium`, `ui-ux`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Improve accessibility across the app: add proper ARIA labels, keyboard navigation, focus management, and screen reader support for key flows.

**Scope:**
- Add `aria-label` to all icon-only buttons
- Implement keyboard navigation for sidebar
- Add focus trap in modal dialogs
- Ensure color contrast meets WCAG AA
- Add skip-to-content link

**Acceptance Criteria:**
- [ ] All buttons have accessible names
- [ ] Tab navigation works through sidebar items
- [ ] Modals trap focus when open
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Screen reader announces page transitions

**Files likely affected:**
- `frontend/apps/app/src/components/layout/AppSidebar.tsx`
- `frontend/apps/app/src/components/ui/dialog.tsx`
- `frontend/apps/app/src/components/ui/button.tsx`
- `frontend/apps/app/src/app/layout.tsx`
- `frontend/apps/app/src/app/globals.css`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---

### Issue #100: Ensure Dark Mode Consistency Across All Pages

**Labels:** `frontend`, `priority: medium`, `ui-ux`

**Monorepo workspace:** `@zenode/app` — `frontend/apps/app/`. Shared UI: `frontend/packages/ui` (`@zenode/ui`). Landing: `frontend/apps/landing/` (`@zenode/landing`). Docs: `frontend/apps/docs/` (`@zenode/docs`).

**Description:**
Audit and fix dark mode inconsistencies. Some components use hardcoded colors (`text-white`, `bg-black`) while others use the glass-effect pattern. Standardize the dark theme system.

**Scope:**
- Audit all pages for color inconsistencies
- Replace hardcoded colors with CSS variables or Tailwind dark mode
- Ensure all form inputs have dark-appropriate styling
- Fix any light-mode elements that appear on dark backgrounds
- Standardize `glass-effect` usage

**Acceptance Criteria:**
- [ ] No white/light elements appearing unexpectedly
- [ ] Form inputs styled consistently in dark mode
- [ ] All text readable against backgrounds
- [ ] `glass-effect` class used consistently for card backgrounds
- [ ] Date pickers and dropdowns styled for dark mode

**Files likely affected:**
- `frontend/apps/app/src/app/globals.css`
- `frontend/apps/app/src/app/dashboard/submit-proposal/page.tsx`
- `frontend/apps/app/src/app/settings/page.tsx`
- `frontend/apps/app/src/components/ui/input.tsx`
- `frontend/apps/app/src/components/challenges/CreateChallengeDialog.tsx`

**Pull requests:** Open PRs against `staging` (see [CONTRIBUTING.md](/CONTRIBUTING.md)).

---
