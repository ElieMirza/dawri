#!/usr/bin/env node
/**
 * Fetch Lebanon National Basketball Team (Cedars) data from TheSportsDB
 * 
 * Usage:
 *   node scripts/fetch-cedars.mjs
 *   npm run data:cedars
 * 
 * Output: data/cedars.json
 * 
 * TheSportsDB Notes:
 * - Free API key: 123 (or register for your own)
 * - Team ID: 146103 (Lebanese National Basketball Team)
 * - Roster data is often incomplete
 * - Safe for client-side use (unlike API-Sports)
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const OUTPUT_FILE = join(DATA_DIR, 'cedars.json');

const API_KEY = process.env.THESPORTSDB_KEY || '123'; // Free key
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json';
const TEAM_ID = '146103'; // Lebanon National Basketball Team

async function apiFetch(endpoint) {
  const url = `${BASE_URL}/${API_KEY}/${endpoint}`;
  console.log(`  Fetching: ${url}`);
  
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchTeamInfo() {
  console.log('\n🏀 Fetching team info...');
  const data = await apiFetch(`lookupteam.php?id=${TEAM_ID}`);
  
  if (!data.teams || data.teams.length === 0) {
    console.log('  ⚠️  Team not found');
    return null;
  }

  const team = data.teams[0];
  console.log(`  ✅ Found: ${team.strTeam}`);
  
  return {
    id: team.idTeam,
    name: team.strTeam,
    nameAlt: team.strTeamAlternate,
    sport: team.strSport,
    league: team.strLeague,
    country: team.strCountry,
    badge: team.strBadge,
    jersey: team.strJersey,
    logo: team.strLogo,
    banner: team.strBanner,
    stadium: team.strStadium,
    stadiumLocation: team.strStadiumLocation,
    capacity: team.intStadiumCapacity,
    website: team.strWebsite,
    facebook: team.strFacebook,
    twitter: team.strTwitter,
    instagram: team.strInstagram,
    description: team.strDescriptionEN,
    formedYear: team.intFormedYear,
  };
}

async function fetchLastEvents() {
  console.log('\n📅 Fetching last events...');
  const data = await apiFetch(`eventslast.php?id=${TEAM_ID}`);
  
  if (!data.results || data.results.length === 0) {
    console.log('  ⚠️  No recent events found');
    return [];
  }

  const events = data.results.map(event => ({
    id: event.idEvent,
    name: event.strEvent,
    filename: event.strFilename,
    sport: event.strSport,
    league: event.strLeague,
    season: event.strSeason,
    date: event.dateEvent,
    time: event.strTime,
    venue: event.strVenue,
    city: event.strCity,
    country: event.strCountry,
    homeTeam: event.strHomeTeam,
    awayTeam: event.strAwayTeam,
    homeScore: event.intHomeScore ? parseInt(event.intHomeScore) : null,
    awayScore: event.intAwayScore ? parseInt(event.intAwayScore) : null,
    status: event.strStatus,
    thumb: event.strThumb,
    description: event.strDescriptionEN,
  }));

  console.log(`  ✅ Found ${events.length} recent events`);
  return events;
}

async function fetchNextEvents() {
  console.log('\n📆 Fetching next events...');
  const data = await apiFetch(`eventsnext.php?id=${TEAM_ID}`);
  
  if (!data.events || data.events.length === 0) {
    console.log('  ⚠️  No upcoming events found');
    return [];
  }

  const events = data.events.map(event => ({
    id: event.idEvent,
    name: event.strEvent,
    filename: event.strFilename,
    sport: event.strSport,
    league: event.strLeague,
    season: event.strSeason,
    date: event.dateEvent,
    time: event.strTime,
    venue: event.strVenue,
    city: event.strCity,
    country: event.strCountry,
    homeTeam: event.strHomeTeam,
    awayTeam: event.strAwayTeam,
    status: event.strStatus,
    thumb: event.strThumb,
  }));

  console.log(`  ✅ Found ${events.length} upcoming events`);
  return events;
}

async function fetchRoster() {
  console.log('\n👥 Fetching roster...');
  const data = await apiFetch(`lookup_all_players.php?id=${TEAM_ID}`);
  
  if (!data.player || data.player.length === 0) {
    console.log('  ⚠️  No roster data found (common for national teams)');
    return [];
  }

  const players = data.player.map(player => ({
    id: player.idPlayer,
    name: player.strPlayer,
    nationality: player.strNationality,
    position: player.strPosition,
    height: player.strHeight,
    weight: player.strWeight,
    birthDate: player.dateBorn,
    birthLocation: player.strBirthLocation,
    description: player.strDescriptionEN,
    thumb: player.strThumb,
    cutout: player.strCutout,
    number: player.strNumber,
  }));

  console.log(`  ✅ Found ${players.length} players`);
  return players;
}

async function main() {
  console.log('🇱🇧 TheSportsDB Cedars Fetcher');
  console.log('==============================');
  console.log(`Team ID: ${TEAM_ID} (Lebanon National Basketball Team)`);
  console.log(`API Key: ${API_KEY}`);

  try {
    // Fetch all data
    const team = await fetchTeamInfo();
    const lastEvents = await fetchLastEvents();
    const nextEvents = await fetchNextEvents();
    const roster = await fetchRoster();

    // Combine events and sort by date
    const allEvents = [...lastEvents, ...nextEvents].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Build output
    const output = {
      fetchedAt: new Date().toISOString(),
      source: 'TheSportsDB',
      sourceUrl: 'https://www.thesportsdb.com/',
      apiKey: API_KEY,
      apiKeyNote: 'This free key is safe for client-side use',
      team,
      events: {
        all: allEvents,
        past: lastEvents,
        upcoming: nextEvents,
      },
      roster,
      rosterNote: 'TheSportsDB roster data for national teams is often incomplete. Consider manual curation.',
      meta: {
        eventsCount: allEvents.length,
        pastEventsCount: lastEvents.length,
        upcomingEventsCount: nextEvents.length,
        rosterCount: roster.length,
      },
    };

    // Ensure data directory exists
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }

    // Write output
    writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`\n✅ Saved to ${OUTPUT_FILE}`);
    console.log(`   Team: ${team?.name || 'Not found'}`);
    console.log(`   Past Events: ${lastEvents.length}`);
    console.log(`   Upcoming Events: ${nextEvents.length}`);
    console.log(`   Roster: ${roster.length} players`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    // Create placeholder file on error
    const placeholder = {
      fetchedAt: new Date().toISOString(),
      source: 'TheSportsDB',
      team: null,
      events: { all: [], past: [], upcoming: [] },
      roster: [],
      error: error.message,
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
