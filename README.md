# DAWRI (الدوري) - Lebanese Basketball League Fan App

A store-ready mobile fan app for the Lebanese Basketball League (LBL / Decathlon Lebanese Basketball Championship). Built with Expo SDK 57, React Native, and TypeScript.

**Owner:** Elie Mirza

## Features

- **Follow the League:** Standings, schedule/results, teams, rosters, and player highlights
- **Real 2025-26 Season Data:** Al Riyadi are champions (20th title), beat Sagesse 4-3 in a thrilling finals series
- **Fan Loyalty Loop:** Check in at games to earn points and tier progress (Fan → Regular → Ultra → Legend)
- **Rewards Catalog:** Redeem points for merchandise, food, and exclusive experiences (demo partners)
- **Bilingual:** Full English and Arabic (RTL) support with language toggle
- **Dark Mode UI:** Premium sports-themed design inspired by Qatar Hayyoh app

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
│   │   └── more.tsx     # Settings
│   ├── team/[id].tsx    # Team detail
│   ├── game/[id].tsx    # Game detail
│   ├── about.tsx        # About screen
│   └── privacy.tsx      # Privacy policy
├── data/
│   ├── lbl-2025-26.json # Season data (verified)
│   └── SOURCES.md       # Data attribution
├── i18n/                # Translations
├── context/             # App state (React Context)
├── hooks/               # Data hooks
├── constants/           # Theme, colors
└── assets/              # Images, icons
```

## Season Data (2025-26)

All data is sourced from public records:
- **Champion:** Al Riyadi (20th title)
- **Finals:** Al Riyadi 4-3 Sagesse
- **Finals MVP:** Karim Zeinoun (32 pts in Game 7)
- **League MVP:** Paris Bass (Sagesse)
- **Season:** Oct 2025 - Aug 2026 (paused Mar-May 2026)

See `data/SOURCES.md` for full attribution.

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
