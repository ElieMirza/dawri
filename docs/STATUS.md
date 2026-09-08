# DAWRI — Project Status

> Last updated: 2026-09-08

## What is DAWRI?

**DAWRI** (الدوري — "The League") is a mobile fan app for the Lebanese Basketball League (LBL / Decathlon Lebanese Basketball Championship). Built with Expo SDK 57, React Native, and TypeScript, it's designed to be a store-ready app that connects fans with their favorite teams through standings, schedules, and a loyalty rewards system.

**Owner:** Elie Mirza

## Live Demo

| Platform | URL |
|----------|-----|
| **Web (Vercel)** | https://dawri-expo.vercel.app |

The web demo is a static Expo export deployed on Vercel. Native iOS/Android builds require EAS credentials.

## What's Shipped

### Core Features ✅
- **Expo Router tabs:** Home, Schedule, Standings, Rewards, More
- **Bilingual UI:** Full English + Arabic with RTL support (i18next)
- **Dark mode UI:** Premium cedar/brick brand color palette
- **Loyalty system:** Check-in at games → earn points → tier progression (Fan → Regular → Ultra → Legend)
- **Rewards catalog:** Demo merchandise/experiences redemption
- **Team profiles:** All 12 LBL teams with colors, arenas, coaches
- **Finals story:** 2025-26 championship (Al Riyadi 4-3 Sagesse) fully documented

### Design Passes (commit a714be3)
- Kern typography polish (DM Sans EN, Noto Sans Arabic AR, Space Grotesk display)
- Cedar/brick brand color (not neon green)
- Soft polish on cards, spacing, gradients

### Season Data
- **`data/lbl-2025-26.json`**: Complete 2025-26 season seed
  - 12-team standings (regular season final)
  - All 7 Finals games with scores, venues, highlights
  - Sample regular-season games (dated where sourced)
  - Playoff bracket (QF/SF/Finals)
  - Awards (MVP, Finals MVP, All-Teams)
  - Player highlights (Zeinoun, Bass, Miletic, etc.)

## Data Architecture

### Current State (NOW)

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (Expo)                         │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  lbl-2025-26.json (bundled at build)                │   │
│   │  - Season 2025-26 finals story                      │   │
│   │  - Hardcoded, not live                              │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  AsyncStorage (local)                               │   │
│   │  - favorite team, language, points, check-ins       │   │
│   └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

**Limitations:**
- No live game updates
- No API data for current season (free tier blocked)
- Cedars NT fixtures not included

### Target State (HYBRID)

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (Expo)                         │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  lbl-2025-26.json (current season seed)             │   │
│   │  - Default for Home/Schedule/Standings              │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  lbl-2024-25.api.json (archive, build-time fetch)   │   │
│   │  - API-Sports league 409 standings/games            │   │
│   │  - Refreshed via `npm run data:refresh`             │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  cedars.json (build-time fetch from TheSportsDB)    │   │
│   │  - Cedars NT fixtures/results                       │   │
│   │  - Team 146103                                      │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  AsyncStorage (local)                               │   │
│   │  - Points, check-ins, favorite, language            │   │
│   └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    BUILD-TIME SCRIPTS                        │
│                                                              │
│   scripts/fetch-api-sports.mjs  → data/lbl-2024-25.api.json │
│   scripts/fetch-cedars.mjs      → data/cedars.json          │
│                                                              │
│   Triggered: `npm run data:refresh` or CI cron              │
└──────────────────────────────────────────────────────────────┘
```

## API-Sports Findings

| Item | Details |
|------|---------|
| **League ID** | 409 (Division 1 Lebanon) |
| **Free Seasons** | 2023-2024, 2024-2025 |
| **2025-2026** | **BLOCKED** — `Free plans do not have access to this season, try from 2022 to 2024` |
| **Free Quota** | 100 requests/day + ~10 requests/minute |
| **`next`/`last` endpoints** | Not available on free tier |
| **Cedars (team 4083)** | Returns 0 games in club league context |
| **Key exposure** | **NEVER ship `x-apisports-key` to client** — must proxy or build-time fetch |

### Free Tier Data Available (2024-25)
- ✅ Standings (12 teams)
- ✅ ~150 games with scores
- ❌ Live scores
- ❌ Current season (2025-26)

### Recommendation
Build-time fetch into static JSON. Refresh via cron/script. Don't pretend free API is live current-season data.

## Open Blockers

| Blocker | Impact | Resolution Path |
|---------|--------|-----------------|
| **2025-26 not on free API** | Can't show live current-season data | Seed file is accurate; add archive toggle for 2024-25 |
| **No live scores** | Games show final scores only | Accept for MVP; paid tier later |
| **Cedars roster** | TheSportsDB roster data weak | Placeholder + CMS note |
| **FLB permission** | `lebanon.basketball` unofficial | Contact FLB for permission before production |
| **No auth** | Demo mode only | P3 priority (Google/email auth) |

## Next Milestones

### M1: Hybrid Data ✅ Complete
- [x] Document data architecture
- [x] Build-time fetch scripts for API-Sports 2024-25
- [x] Build-time fetch for Cedars (TheSportsDB)
- [x] Season toggle UI (2025-26 seed vs 2024-25 archive)
- [x] Cedars section in More tab

### M2: Cedars Corner
- [ ] Dedicated Cedars tab or section
- [ ] NT fixtures/results display
- [ ] Roster placeholder (pending better data source)

### M3: Onboarding
- [ ] First-run flow (language, favorite team)
- [ ] Push notification opt-in

### M4: Auth & Persistence
- [ ] Google Sign-In
- [ ] Email/password
- [ ] Cloud sync for points/check-ins

### M5: Fan Voting & Shop
- [ ] MVP voting during season
- [ ] Merchandise shop (league + Cedars)
- [ ] Payment integration

### M6: Production Data
- [ ] API-Sports Pro subscription (~$15/mo)
- [ ] Live current-season data
- [ ] FLB official partnership

---

See also:
- [`DATA.md`](./DATA.md) — Data sources truth table
- [`GO-PUBLIC.md`](./GO-PUBLIC.md) — Pre-public checklist
- [`BACKLOG.md`](./BACKLOG.md) — Prioritized feature backlog
