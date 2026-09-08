# DAWRI — Pre-Public / Federation Demo Checklist

> What needs to happen before public launch or federation demo.

## Status Legend

- ✅ **DONE** — Complete and working
- 🟡 **PARTIAL** — Started but incomplete
- ❌ **TODO** — Not started
- ⏸️ **BLOCKED** — Waiting on external dependency
- 🚫 **NOT READY** — Explicitly not ready for public

---

## Core App Features

| Item | Status | Notes |
|------|--------|-------|
| Expo Router tabs (Home/Schedule/Standings/Rewards/More) | ✅ DONE | |
| EN/AR bilingual with RTL | ✅ DONE | i18next, full translations |
| Dark mode UI | ✅ DONE | Cedar/brick brand |
| 2025-26 season data | ✅ DONE | Finals story complete |
| Loyalty points system | ✅ DONE | Check-in → points → tiers |
| Rewards catalog (demo) | ✅ DONE | Placeholder partners |
| Team profiles | ✅ DONE | 12 LBL teams |
| Game detail view | ✅ DONE | Finals games with highlights |

---

## Data & API

| Item | Status | Notes |
|------|--------|-------|
| Seed file (2025-26) | ✅ DONE | `lbl-2025-26.json` |
| API-Sports integration (2024-25 archive) | 🟡 PARTIAL | Build-time fetch needed |
| Live current-season data | ❌ TODO | Requires paid API tier |
| Cedars NT fixtures (TheSportsDB) | ❌ TODO | Team 146103 |
| Cedars roster | ❌ TODO | TheSportsDB weak; needs CMS |
| Season toggle UI | ❌ TODO | Archive vs current |
| Data refresh script | ❌ TODO | `npm run data:refresh` |

---

## Authentication & Accounts

| Item | Status | Notes |
|------|--------|-------|
| Google Sign-In | ❌ TODO | P3 priority |
| Email/password auth | ❌ TODO | P3 priority |
| Apple Sign-In (iOS) | ❌ TODO | Required for App Store if other auth |
| Account deletion flow | ❌ TODO | Required by stores |
| Cloud sync (points/check-ins) | ❌ TODO | Requires backend |

---

## Store Readiness

### Apple App Store

| Item | Status | Notes |
|------|--------|-------|
| Apple Developer Account | ❌ TODO | $99/year |
| App Store Connect listing | ❌ TODO | |
| Privacy Policy URL | 🟡 PARTIAL | `/privacy` screen exists; need hosted URL |
| App icons (all sizes) | ✅ DONE | In assets |
| Screenshots (6.5", 5.5") | ❌ TODO | |
| App description / keywords | ❌ TODO | |
| Age rating questionnaire | ❌ TODO | |
| TestFlight beta | ❌ TODO | |

### Google Play Store

| Item | Status | Notes |
|------|--------|-------|
| Google Play Developer Account | ❌ TODO | $25 one-time |
| Play Console listing | ❌ TODO | |
| Privacy Policy URL | 🟡 PARTIAL | |
| Data Safety form | ❌ TODO | |
| Screenshots / feature graphic | ❌ TODO | |
| Internal testing track | ❌ TODO | |

---

## Legal & Compliance

| Item | Status | Notes |
|------|--------|-------|
| Privacy Policy | 🟡 PARTIAL | Screen exists; needs legal review |
| Terms of Service | ❌ TODO | |
| FLB permission / partnership | ⏸️ BLOCKED | Contact federation |
| Data source attribution | ✅ DONE | `data/SOURCES.md` |
| Not affiliated disclaimer | ✅ DONE | In app and README |

---

## Content Moderation

| Item | Status | Notes |
|------|--------|-------|
| Fan voting moderation | ❌ TODO | If voting feature added |
| User-generated content policy | ❌ TODO | If comments/posts added |
| Report/block functionality | ❌ TODO | If social features added |

---

## Payments & Commerce

| Item | Status | Notes |
|------|--------|-------|
| Shop integration | ❌ TODO | P5 priority |
| Payment processor (Stripe?) | ❌ TODO | |
| Lebanese payment methods | ❌ TODO | Cash-on-delivery common |
| Tax / customs handling | ❌ TODO | |
| Refund policy | ❌ TODO | |

---

## Analytics & Monitoring

| Item | Status | Notes |
|------|--------|-------|
| Analytics (Mixpanel/Amplitude) | ❌ TODO | |
| Crash reporting (Sentry) | ❌ TODO | |
| Performance monitoring | ❌ TODO | |
| User feedback channel | ❌ TODO | |

---

## Onboarding

| Item | Status | Notes |
|------|--------|-------|
| First-run language selection | ❌ TODO | P2 priority |
| Favorite team selection | 🟡 PARTIAL | In More; should be onboarding |
| Feature walkthrough | ❌ TODO | |
| Push notification opt-in | ❌ TODO | |

---

## Cedars Corner

| Item | Status | Notes |
|------|--------|-------|
| Cedars tab or section | ❌ TODO | P1 priority |
| NT fixtures/results | ❌ TODO | TheSportsDB 146103 |
| NT roster | ❌ TODO | Data source weak |
| NT news/highlights | ❌ TODO | |

---

## Infrastructure

| Item | Status | Notes |
|------|--------|-------|
| Web demo (Vercel) | ✅ DONE | https://dawri-expo.vercel.app |
| EAS build configuration | ✅ DONE | `eas.json` |
| CI/CD pipeline | ❌ TODO | |
| Staging environment | ❌ TODO | |
| API proxy/backend | ❌ TODO | For paid API tier |

---

## 🚫 NOT READY FOR PUBLIC

The following are explicitly **not ready** and should be addressed before any public launch:

1. **No authentication** — Points/check-ins are device-local only
2. **No live data** — 2025-26 is seed file, not API-updated
3. **No FLB permission** — Fan app disclaimer only
4. **No store listings** — No Apple/Google accounts set up
5. **No privacy policy URL** — Exists in-app but not hosted
6. **No paid API** — Free tier blocks current season
7. **No crash reporting** — Issues won't be tracked
8. **No moderation** — If voting/UGC added later

---

## Federation Demo Readiness

For a **demo to FLB**, the following are recommended minimums:

| Item | Status |
|------|--------|
| Working web demo | ✅ Ready |
| 2025-26 season story | ✅ Ready |
| EN/AR bilingual | ✅ Ready |
| Loyalty concept demo | ✅ Ready |
| Cedars section | ❌ Needs work |
| Live data disclaimer | ❌ Add prominent note |
| Partnership proposal doc | ❌ TODO |

---

See also:
- [`STATUS.md`](./STATUS.md) — Project status
- [`DATA.md`](./DATA.md) — Data sources
- [`BACKLOG.md`](./BACKLOG.md) — Feature backlog
