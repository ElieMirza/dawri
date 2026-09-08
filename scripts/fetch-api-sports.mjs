#!/usr/bin/env node
/**
 * Fetch 2024-25 Lebanese Basketball League data from API-Sports
 * 
 * Usage:
 *   API_SPORTS_KEY=xxx node scripts/fetch-api-sports.mjs
 *   
 * Or with npm:
 *   API_SPORTS_KEY=xxx npm run data:api-sports
 * 
 * Output: data/lbl-2024-25.api.json
 * 
 * API-Sports Free Tier Limitations:
 * - 100 requests/day, ~10/min
 * - Only seasons 2022-2024 available
 * - 2025-2026 blocked: "Free plans do not have access to this season"
 * - No next/last endpoints
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const OUTPUT_FILE = join(DATA_DIR, 'lbl-2024-25.api.json');

const API_KEY = process.env.API_SPORTS_KEY;
const BASE_URL = 'https://v1.basketball.api-sports.io';
const LEAGUE_ID = 409; // Division 1 Lebanon
const SEASON = '2024-2025';

// Rate limiting
const DELAY_MS = 6500; // ~10 requests/min = 6s between requests + buffer
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function apiFetch(endpoint) {
  if (!API_KEY) {
    throw new Error('API_SPORTS_KEY environment variable is required');
  }

  const url = `${BASE_URL}${endpoint}`;
  console.log(`  Fetching: ${url}`);
  
  const response = await fetch(url, {
    headers: {
      'x-apisports-key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  // Check for API errors
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(`API error: ${JSON.stringify(data.errors)}`);
  }

  // Log remaining requests
  const remaining = response.headers.get('x-ratelimit-requests-remaining');
  if (remaining) {
    console.log(`  Rate limit remaining: ${remaining}`);
  }

  return data;
}

async function fetchStandings() {
  console.log('\n📊 Fetching standings...');
  const data = await apiFetch(`/standings?league=${LEAGUE_ID}&season=${SEASON}`);
  
  if (!data.response || data.response.length === 0) {
    console.log('  ⚠️  No standings found');
    return [];
  }

  // API returns grouped by stage, flatten
  const standings = data.response.flatMap(group => 
    group.map(team => ({
      rank: team.position,
      teamId: team.team.id,
      teamName: team.team.name,
      teamLogo: team.team.logo,
      played: team.games.played,
      wins: team.games.win.total,
      losses: team.games.lose.total,
      pointsFor: team.points.for,
      pointsAgainst: team.points.against,
      form: team.form,
      description: team.description,
    }))
  ).sort((a, b) => a.rank - b.rank);

  console.log(`  ✅ Found ${standings.length} teams`);
  return standings;
}

async function fetchGames() {
  console.log('\n🏀 Fetching games...');
  const data = await apiFetch(`/games?league=${LEAGUE_ID}&season=${SEASON}`);
  
  if (!data.response || data.response.length === 0) {
    console.log('  ⚠️  No games found');
    return [];
  }

  const games = data.response.map(game => ({
    id: game.id,
    date: game.date,
    time: game.time,
    status: game.status.short,
    statusLong: game.status.long,
    home: {
      id: game.teams.home.id,
      name: game.teams.home.name,
      logo: game.teams.home.logo,
    },
    away: {
      id: game.teams.away.id,
      name: game.teams.away.name,
      logo: game.teams.away.logo,
    },
    homeScore: game.scores.home.total,
    awayScore: game.scores.away.total,
    venue: game.venue,
    stage: game.stage,
    week: game.week,
  })).sort((a, b) => new Date(b.date) - new Date(a.date));

  console.log(`  ✅ Found ${games.length} games`);
  return games;
}

async function fetchTeams() {
  console.log('\n👥 Fetching teams...');
  const data = await apiFetch(`/teams?league=${LEAGUE_ID}&season=${SEASON}`);
  
  if (!data.response || data.response.length === 0) {
    console.log('  ⚠️  No teams found');
    return [];
  }

  const teams = data.response.map(team => ({
    id: team.id,
    name: team.name,
    logo: team.logo,
    national: team.national,
    country: team.country?.name,
  }));

  console.log(`  ✅ Found ${teams.length} teams`);
  return teams;
}

async function main() {
  console.log('🏀 API-Sports Lebanon Basketball Fetcher');
  console.log('=========================================');
  console.log(`League: ${LEAGUE_ID} (Division 1 Lebanon)`);
  console.log(`Season: ${SEASON}`);
  
  if (!API_KEY) {
    console.error('\n❌ Error: API_SPORTS_KEY environment variable is required');
    console.error('   Get your key at: https://api-sports.io/');
    console.error('   Usage: API_SPORTS_KEY=xxx npm run data:api-sports');
    process.exit(1);
  }

  console.log(`API Key: ${API_KEY.slice(0, 4)}...${API_KEY.slice(-4)}`);

  try {
    // Fetch standings
    const standings = await fetchStandings();
    await sleep(DELAY_MS);

    // Fetch games
    const games = await fetchGames();
    await sleep(DELAY_MS);

    // Fetch teams
    const teams = await fetchTeams();

    // Build output
    const output = {
      fetchedAt: new Date().toISOString(),
      source: 'API-Sports Basketball',
      sourceUrl: 'https://api-sports.io/',
      league: {
        id: LEAGUE_ID,
        name: 'Division 1 Lebanon',
        country: 'Lebanon',
      },
      season: SEASON,
      teams,
      standings,
      games,
      meta: {
        teamsCount: teams.length,
        standingsCount: standings.length,
        gamesCount: games.length,
      },
    };

    // Ensure data directory exists
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }

    // Write output
    writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`\n✅ Saved to ${OUTPUT_FILE}`);
    console.log(`   Teams: ${teams.length}`);
    console.log(`   Standings: ${standings.length}`);
    console.log(`   Games: ${games.length}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    // Create placeholder file on error
    const placeholder = {
      fetchedAt: new Date().toISOString(),
      source: 'API-Sports Basketball',
      league: { id: LEAGUE_ID, name: 'Division 1 Lebanon' },
      season: SEASON,
      error: error.message,
      teams: [],
      standings: [],
      games: [],
    };
    
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    writeFileSync(OUTPUT_FILE, JSON.stringify(placeholder, null, 2));
    console.log(`\n⚠️  Created placeholder file at ${OUTPUT_FILE}`);
    
    process.exit(1);
  }
}

main();
