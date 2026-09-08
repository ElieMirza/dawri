# DAWRI (الدوري) - Lebanese Basketball League Fan App

A store-ready mobile fan app for the Lebanese Basketball League (LBL / Decathlon Lebanese Basketball Championship). Built with Expo SDK 57, React Native, and TypeScript.

**Owner:** Elie Mirza  
**Live Demo:** https://dawri-expo.vercel.app

## ⚠️ Data Architecture Note

This app uses a **hybrid data model**:

| Source | Season | Status |
|--------|--------|--------|
| `data/lbl-2025-26.json` | 2025-26 | Seed file (hardcoded finals story) |
| `data/lbl-2024-25.api.json` | 2024-25 | API-Sports (build-time fetch) |
| `data/cedars.json` | — | Cedars NT (TheSportsDB) |

**Important:** The free API-Sports tier does **not** provide live 2025-26 season data. The 2025-26 data is a curated seed file based on public records. Use the season toggle to view 2024-25 API data.

See [`docs/DATA.md`](./docs/DATA.md) for full details.

## Features

- **Follow the League:** Standings, schedule/results, teams, rosters, and player highlights
- **2025-26 Season Story:** Al Riyadi are champions (20th title), beat Sagesse 4-3 in a thrilling finals series
- **2024-25 Archive:** API-Sports data for historical comparison
- **Cedars Corner:** Lebanese National Team fixtures/results
- **Fan Loyalty Loop:** Check in at games to earn points and tier progress (Fan → Regular → Ultra → Legend)
- **Rewards Catalog:** Redeem points for merchandise, food, and exclusive experiences (demo partners)
- **Bilingual:** Full English and Arabic (RTL) support with language toggle
- **Dark Mode UI:** Premium cedar/brick themed design

## Screenshots

The app includes:
- **Home:** Champion banner, Finals MVP, tier status, favorite team
- **Schedule:** Finals series + regular season games with team filters
- **Standings:** Full 12-team table with playoff brackets
- **Rewards:** Points balance, tier progress, check-in, rewards catalog
- **More:** Language toggle, favorite team selection, about, privacy policy

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Open in web browser (press W)
# Or scan QR code with Expo Go app on mobile
```

The web demo runs on `http://localhost:8081` by default.

## Tech Stack

- **Expo SDK 57+** with Expo Router (file-based routing)
- **TypeScript** for type safety
- **React Native** (works on iOS, Android, Web)
- **i18next** for internationalization (EN/AR with RTL)
- **AsyncStorage** for local persistence
- **expo-linear-gradient** for polished UI

## Project Structure

```
├── app/                  # Expo Router screens
│   ├── (tabs)/          # Bottom tab screens
│   │   ├── index.tsx    # Home
│   │   ├── schedule.tsx # Game schedule
│   │   ├── standings.tsx# Standings table
│   │   ├── rewards.tsx  # Loyalty & rewards
│   │   └── more.tsx     # Settings + Cedars
│   ├── team/[id].tsx    # Team detail
│   ├── game/[id].tsx    # Game detail
│   ├── about.tsx        # About screen
│   └── privacy.tsx      # Privacy policy
├── data/
│   ├── lbl-2025-26.json     # 2025-26 seed (manual)
│   ├── lbl-2024-25.api.json # 2024-25 from API-Sports
│   ├── cedars.json          # Cedars NT from TheSportsDB
│   └── SOURCES.md           # Data attribution
├── docs/                # Documentation
│   ├── STATUS.md        # Project status
│   ├── DATA.md          # Data sources
│   ├── GO-PUBLIC.md     # Pre-public checklist
│   └── BACKLOG.md       # Feature backlog
├── scripts/             # Build/data scripts
│   ├── fetch-api-sports.mjs  # API-Sports fetcher
│   └── fetch-cedars.mjs      # TheSportsDB fetcher
├── i18n/                # Translations
├── context/             # App state (React Context)
├── hooks/               # Data hooks
├── constants/           # Theme, colors
└── assets/              # Images, icons
```

## Documentation

| Document | Description |
|----------|-------------|
| [`docs/STATUS.md`](./docs/STATUS.md) | Living project status, architecture, milestones |
| [`docs/DATA.md`](./docs/DATA.md) | Data sources truth table, API details |
| [`docs/GO-PUBLIC.md`](./docs/GO-PUBLIC.md) | Pre-public / federation demo checklist |
| [`docs/BACKLOG.md`](./docs/BACKLOG.md) | Prioritized feature backlog |
| [`data/SOURCES.md`](./data/SOURCES.md) | Attribution for 2025-26 seed data |

## Season Data

### 2025-26 (Seed File)
All data is sourced from public records and hardcoded at build:
- **Champion:** Al Riyadi (20th title)
- **Finals:** Al Riyadi 4-3 Sagesse
- **Finals MVP:** Karim Zeinoun (32 pts in Game 7)
- **League MVP:** Paris Bass (Sagesse)
- **Season:** Oct 2025 - Aug 2026 (paused Mar-May 2026)

### 2024-25 (API Archive)
Fetched from API-Sports at build time:
- League 409 (Division 1 Lebanon)
- 12-team standings
- ~150 games with scores

### Cedars (National Team)
Fetched from TheSportsDB:
- Team 146103
- Recent fixtures/results

See `data/SOURCES.md` for full 2025-26 attribution.

## Refreshing Data

To refresh API data (2024-25 standings/games and Cedars fixtures):

```bash
# Copy .env.example to .env and add your API-Sports key
cp .env.example .env

# Refresh all API data
npm run data:refresh

# Or refresh individually
npm run data:api-sports    # 2024-25 from API-Sports
npm run data:cedars        # Cedars from TheSportsDB
```

**Note:** The 2025-26 seed file (`lbl-2025-26.json`) is manually curated and not refreshed by these scripts.

## Building for Production

### Configure EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure
```

### Build Commands

```bash
# Preview build (internal testing)
eas build --profile preview --platform android
eas build --profile preview --platform ios

# Production build
eas build --profile production --platform all
```

### Store Submission

Update `eas.json` with your credentials:
- **iOS:** Apple ID, App Store Connect App ID, Team ID
- **Android:** Google Play service account key

## Configuration

### App Identifiers
- **Bundle ID (iOS):** `app.dawri.lbl`
- **Package (Android):** `app.dawri.lbl`
- **Scheme:** `dawri://`

### Permissions
- **Location (optional):** For venue check-ins (mock GPS in demo)

## Loyalty System

| Tier | Check-ins | Benefits |
|------|-----------|----------|
| Fan | 0+ | Base rewards access |
| Regular | 3+ | Mid-tier rewards |
| Ultra | 10+ | Premium rewards |
| Legend | 25+ | Exclusive experiences |

Each game check-in earns **1,000 points**.

## Data Notes

1. Season was paused 2 Mar - 22 May 2026 during Lebanon War
2. Finals MVP listed as Karim Zeinoun (some sources also name Dusan Miletic)
3. Beirut Club also known as "Beirut First"

## License

MIT License - See LICENSE file

## Disclaimer

This is a fan application for demonstration purposes. Data sourced from public records (Wikipedia, Asia-Basket.com, Riyadi.com). Not affiliated with the Lebanese Basketball Federation (FLB) or any LBL team.

---

**Season 2025-26 (Final)** • Built with Expo • Created by Elie Mirza
