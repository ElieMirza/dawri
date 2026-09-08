# DAWRI — Feature Backlog

> Prioritized list of features and improvements.

## Priority Levels

| Level | Meaning |
|-------|---------|
| **P0** | Critical — Must do for next milestone |
| **P1** | High — Important for user value |
| **P2** | Medium — Nice to have soon |
| **P3** | Low — Future enhancement |
| **P4** | Wishlist — Someday/maybe |
| **P5** | Deferred — Requires dependencies |

---

## P0 — Critical (Hybrid Data)

### P0.1 Hybrid Data Architecture
**Goal:** Don't pretend free API has current-season data. Clear separation of seed vs API data.

- [ ] Keep `lbl-2025-26.json` as current-season source of truth
- [ ] Build-time fetch script for API-Sports 2024-25 → `data/lbl-2024-25.api.json`
- [ ] Build-time fetch script for Cedars (TheSportsDB) → `data/cedars.json`
- [ ] Season toggle/archive UI (2025-26 seed vs 2024-25 API)
- [ ] `npm run data:refresh` command
- [ ] `.env.example` with `API_SPORTS_KEY`
- [ ] Documentation in `docs/DATA.md`

**Acceptance:**
- Running `npm run data:refresh` with valid API key populates data files
- UI clearly shows which season is displayed
- No API key exposed in client bundle

---

## P1 — High (Cedars Corner)

### P1.1 Cedars National Team Section
**Goal:** Fans can follow the Lebanese National Basketball Team (Cedars).

- [ ] New tab OR section in More screen
- [ ] Fixtures/results from TheSportsDB (team 146103)
- [ ] Basic team info display
- [ ] Roster placeholder (note: TheSportsDB roster data weak)
- [ ] CMS/manual override capability for roster

**Data Source:** TheSportsDB (free key safe for client)

**Note:** Roster may need manual curation or alternate source.

---

## P2 — Medium (Onboarding)

### P2.1 First-Run Onboarding Flow
**Goal:** New users set up preferences on first launch.

- [ ] Language selection (EN/AR) on first launch
- [ ] Favorite team selection
- [ ] Feature highlights carousel (optional)
- [ ] Skip option
- [ ] Store selection in AsyncStorage

**Currently:** Language toggle in More, favorite team picker expanded — works but not guided.

### P2.2 Push Notifications Setup
**Goal:** Users can opt-in to game reminders.

- [ ] Expo push notification setup
- [ ] Permission request flow
- [ ] Notification preferences screen
- [ ] Backend for sending notifications (requires server)

**Blocked by:** No backend server currently.

---

## P3 — Low (Authentication)

### P3.1 Google Sign-In
**Goal:** Users can sign in with Google for cloud sync.

- [ ] Expo AuthSession / Google Auth setup
- [ ] Firebase Auth or Supabase Auth backend
- [ ] Profile screen
- [ ] Link local data to account
- [ ] Sync points/check-ins to cloud

### P3.2 Email/Password Auth
**Goal:** Alternative auth for users without Google.

- [ ] Email/password registration
- [ ] Email verification
- [ ] Password reset flow
- [ ] Profile management

### P3.3 Apple Sign-In (iOS)
**Goal:** Required by App Store if offering other auth methods.

- [ ] expo-apple-authentication setup
- [ ] Backend integration

**Note:** Apple Sign-In required if app offers any third-party auth.

---

## P4 — Wishlist (Fan Engagement)

### P4.1 Fan Voting
**Goal:** Fans vote for MVP, best player, etc.

- [ ] Voting UI during active season
- [ ] Vote tallying (requires backend)
- [ ] Results display
- [ ] Moderation for abuse prevention
- [ ] Anti-stuffing measures (one vote per account)

**Blocked by:** Authentication (P3), Backend server.

### P4.2 Game Predictions
**Goal:** Fans predict game outcomes for points.

- [ ] Prediction UI before games
- [ ] Scoring logic (correct prediction = bonus points)
- [ ] Leaderboard

**Blocked by:** Live game data (paid API).

### P4.3 Social Sharing
**Goal:** Share scores, predictions, achievements.

- [ ] Share buttons on game cards
- [ ] Achievement badges for sharing
- [ ] Deep links back to app

---

## P5 — Deferred (Shop & Commerce)

### P5.1 Merchandise Shop
**Goal:** Fans can buy official LBL and team merchandise.

- [ ] Product catalog UI
- [ ] Cart functionality
- [ ] Checkout flow
- [ ] Payment integration (Stripe, local methods)
- [ ] Order tracking
- [ ] Inventory management (requires backend)

**Blocked by:** 
- FLB/team partnership agreements
- Payment processor setup
- Tax/legal considerations
- Fulfillment logistics

### P5.2 Cedars Merchandise
**Goal:** National team merchandise.

- [ ] Separate catalog or section
- [ ] NT-specific products

**Blocked by:** Same as P5.1.

### P5.3 Points Redemption for Real Rewards
**Goal:** Loyalty points → actual merchandise/experiences.

- [ ] Partner integration (teams, venues, sponsors)
- [ ] Inventory tracking
- [ ] Redemption fulfillment flow
- [ ] Terms & conditions

**Currently:** Demo rewards only — no actual redemption.

---

## P6 — Infrastructure & Quality

### P6.1 Paid API Integration
**Goal:** Live current-season data when justified by revenue/partnership.

- [ ] API-Sports Pro subscription (~$15/mo)
- [ ] Update fetch scripts for current season
- [ ] Implement caching/proxy layer
- [ ] Error handling for rate limits

**Trigger:** Federation partnership confirmed OR revenue model established.

### P6.2 CI/CD Pipeline
**Goal:** Automated builds and deployments.

- [ ] GitHub Actions for PR checks
- [ ] Automated Expo builds on merge
- [ ] Vercel auto-deploy (already working for web)
- [ ] Data refresh cron job

### P6.3 Analytics & Monitoring
**Goal:** Understand user behavior, catch issues.

- [ ] Mixpanel/Amplitude for analytics
- [ ] Sentry for crash reporting
- [ ] Performance monitoring

### P6.4 Backend Server
**Goal:** Support features requiring server-side logic.

- [ ] Supabase or Firebase setup
- [ ] User accounts
- [ ] Cloud sync
- [ ] Push notifications
- [ ] Voting/predictions logic

---

## Completed (Reference)

| Feature | Completed |
|---------|-----------|
| Expo Router tabs | ✅ |
| EN/AR bilingual | ✅ |
| Dark mode UI | ✅ |
| Loyalty points system | ✅ |
| Demo rewards catalog | ✅ |
| 2025-26 season data | ✅ |
| Team profiles (12 teams) | ✅ |
| Finals story (Al Riyadi 4-3 Sagesse) | ✅ |
| Player highlights | ✅ |
| Cedar/brick brand colors | ✅ |
| Kern typography pass | ✅ |

---

## Prioritization Notes

1. **P0 Hybrid Data** — Honest architecture. Don't mislead about data freshness.
2. **P1 Cedars** — High fan interest; uses free API; no backend needed.
3. **P2 Onboarding** — Low effort, improves first-run experience.
4. **P3 Auth** — Unlocks cloud sync and future features; significant work.
5. **P4 Voting** — High engagement but requires auth + backend.
6. **P5 Shop** — Revenue potential but complex legal/logistics.
7. **P6 Paid API** — Only after product-market fit or partnership.

---

See also:
- [`STATUS.md`](./STATUS.md) — Current status
- [`DATA.md`](./DATA.md) — Data sources
- [`GO-PUBLIC.md`](./GO-PUBLIC.md) — Launch checklist
