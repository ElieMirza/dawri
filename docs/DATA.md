# DAWRI — Data Sources

> Truth table for all data sources used or considered for the app.

## Data Sources Matrix

| Source | Type | What It Provides | Cost | Status | Notes |
|--------|------|------------------|------|--------|-------|
| **`data/lbl-2025-26.json`** | Seed file | Current season finals story (hardcoded) | Free | ✅ Active | Built from Wikipedia, Asia-Basket, riyadi.com |
| **API-Sports Basketball** | REST API | Standings, games, teams for league 409 | Free (100/day) / Pro $15/mo | ⚠️ Partial | 2024-25 works; 2025-26 blocked on free |
| **TheSportsDB** | REST API | Cedars NT fixtures/results | Free (key `123`) | ✅ Available | Team 146103; roster weak |
| **FLB SportsPress** | WordPress API | Official FLB data | Free? | ❓ Needs permission | `lebanon.basketball/wp-json/sportspress/v2/...` |
| **AsyncStorage** | Local storage | User preferences | Free | ✅ Active | Points, check-ins, favorite, language |

---

## 1. Seed File: `data/lbl-2025-26.json`

**Purpose:** Current 2025-26 season source of truth for Home/Schedule/Standings defaults.

### Contents
- Season metadata (dates, champion, runner-up)
- 12-team standings (regular season final)
- All 7 Finals games (Al Riyadi 4-3 Sagesse)
- Playoff bracket (QF/SF/Finals)
- ~30 sample regular-season games
- Awards (League MVP, Finals MVP, All-Teams)
- 40+ player highlights

### Sources Used
| URL | What |
|-----|------|
| Wikipedia 2025-26 LBL | Season dates, standings, playoff bracket, H2H matrix |
| asia-basket.com | Awards, Game 7 box score, stat leaders |
| riyadi.com/calendar | Dated Finals + regular-season Al Riyadi games |
| ar.wikipedia.org | Arabic team/player names |

### Known Gaps
- Non-Al Riyadi game dates often approximate (`dateApproximate: true`)
- Finals MVP conflict: Zeinoun (Game 7 article) vs Miletic (awards block)
- Team colors are brand approximations, not official

### Update Cadence
Manual. File is treated as the canonical 2025-26 story, not live data.

---

## 2. API-Sports Basketball

**Endpoint:** `https://v1.basketball.api-sports.io/`

### Free Tier Availability

| Endpoint | League 409 (LBL) | Notes |
|----------|------------------|-------|
| `/standings` | ✅ 2023-24, 2024-25 | 12 teams per season |
| `/games` | ✅ ~150 games for 2024-25 | Full season |
| `/teams` | ✅ Basic info | |
| `/games?season=2025-2026` | ❌ **BLOCKED** | `Free plans do not have access to this season, try from 2022 to 2024` |
| `/games/h2h/next` | ❌ Not on free | |
| `/games/h2h/last` | ❌ Not on free | |
| Team 4083 (Cedars) | ⚠️ Returns 0 games | Club league context only |

### Quotas
- **Daily:** 100 requests
- **Rate:** ~10 requests/minute

### Key Security
```
⚠️  NEVER expose `x-apisports-key` in client code!
```

**Options:**
1. **Build-time fetch** (recommended for Expo static) — Script writes JSON, committed or cached
2. **Serverless proxy** — Vercel API route (requires Next.js or separate API project)
3. **Edge function** — If Expo project can support it

### Implementation: Build-Time Fetch

```bash
# Refresh 2024-25 data
API_SPORTS_KEY=xxx npm run data:refresh
```

Writes to `data/lbl-2024-25.api.json`:
```json
{
  "fetchedAt": "2026-09-08T15:00:00Z",
  "season": "2024-2025",
  "league": 409,
  "standings": [...],
  "games": [...]
}
```

### Paid Upgrade Path
- **Pro tier:** ~$15/month
- **Unlocks:** Current season, live scores, more endpoints
- **When:** After federation product validation / revenue

---

## 3. TheSportsDB — Cedars National Team

**Endpoint:** `https://www.thesportsdb.com/api/v1/json/`

### Available Data

| Endpoint | Data | Notes |
|----------|------|-------|
| `/lookupteam.php?id=146103` | Team info | Lebanese National Basketball Team |
| `/eventslast.php?id=146103` | Last 5 events | Fixtures/results |
| `/eventsnext.php?id=146103` | Next 5 events | Upcoming fixtures |
| `/lookup_all_players.php?id=146103` | Roster | ⚠️ Often incomplete |

### API Key
- Free key: `123` (or `1` for some endpoints)
- Or: Register for own key at thesportsdb.com

### Key Security
TheSportsDB free keys are **client-safe** (unlike API-Sports). Can fetch from client or build-time.

### Implementation

**Option A: Build-time fetch** (recommended for consistency)
```bash
npm run data:refresh  # Fetches to data/cedars.json
```

**Option B: Client fetch** (ok for free key)
```typescript
const SPORTSDB_KEY = '123';
const res = await fetch(`https://www.thesportsdb.com/api/v1/json/${SPORTSDB_KEY}/eventslast.php?id=146103`);
```

### Roster Note
TheSportsDB roster data for Lebanon NT is often incomplete or outdated. Plan for:
- Placeholder roster UI
- CMS/manual override capability
- Or: Scrape from asia-basket.com with attribution

---

## 4. FLB SportsPress (Unofficial)

**Endpoint:** `https://lebanon.basketball/wp-json/sportspress/v2/...`

### Status: ❓ Needs Permission

The official FLB website runs WordPress with SportsPress plugin. Endpoints may include:
- `/players`
- `/teams`
- `/events`
- `/standings`

### Before Using
1. Contact FLB for permission
2. Confirm endpoint stability
3. Check rate limits / ToS

### Recommendation
Don't rely on this for MVP. Use as supplementary source after FLB partnership.

---

## 5. Local-Only Dynamic Data

Stored in **AsyncStorage** on device. Never transmitted.

| Key | Data | Default |
|-----|------|---------|
| `favoriteTeam` | Team ID string or null | `null` |
| `language` | `'en'` or `'ar'` | `'en'` |
| `points` | Number | `0` |
| `checkIns` | Array of `{ gameId, date, points }` | `[]` |

### Privacy
- No personal data collected
- No account required
- Location optional (mock GPS in demo)

---

## 6. Data Files Summary

| File | Source | Refresh | Notes |
|------|--------|---------|-------|
| `data/lbl-2025-26.json` | Manual research | Manual | Current season canonical seed |
| `data/lbl-2024-25.api.json` | API-Sports | `npm run data:refresh` | Archive season from API |
| `data/cedars.json` | TheSportsDB | `npm run data:refresh` | Cedars NT fixtures |
| `data/SOURCES.md` | — | Manual | Attribution for seed file |

---

## Environment Variables

```bash
# .env.example
API_SPORTS_KEY=          # Required for data:refresh (API-Sports)
THESPORTSDB_KEY=123      # Optional (free key works)
```

**Never commit `.env` with real keys. Use `.env.example` as template.**

---

## Paid Upgrade Path

| Trigger | Action |
|---------|--------|
| Federation partnership confirmed | Discuss FLB SportsPress access |
| Revenue or sponsorship | API-Sports Pro (~$15/mo) for live 2025-26+ |
| Need real-time scores | Evaluate paid tiers + WebSocket/polling |

---

See also:
- [`STATUS.md`](./STATUS.md) — Project status overview
- [`GO-PUBLIC.md`](./GO-PUBLIC.md) — Pre-public checklist
- [`BACKLOG.md`](./BACKLOG.md) — Feature backlog
