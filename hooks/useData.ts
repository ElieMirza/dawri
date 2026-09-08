import { useMemo } from 'react';

// Explicit require keeps JSON bundled reliably on web static export
// eslint-disable-next-line @typescript-eslint/no-var-requires
const data2526 = require('../data/lbl-2025-26.json') as typeof import('../data/lbl-2025-26.json');

// 2024-25 API data (may be placeholder if not fetched)
let data2425: ApiSportsData | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  data2425 = require('../data/lbl-2024-25.api.json') as ApiSportsData;
} catch {
  data2425 = null;
}

// Cedars NT data
let cedarsData: CedarsData | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  cedarsData = require('../data/cedars.json') as CedarsData;
} catch {
  cedarsData = null;
}

// Types for 2025-26 seed data
export type Team = (typeof data2526.teams)[number];
export type Standing = (typeof data2526.standings)[number];
export type FinalsGame = (typeof data2526.finals.games)[number];
export type RegularSeasonGame = (typeof data2526.regularSeasonSampleGames)[number];
export type Player = (typeof data2526.players)[number];

// Types for API-Sports data
interface ApiSportsData {
  fetchedAt: string | null;
  source: string;
  season: string;
  league: { id: number; name: string; country?: string };
  teams: Array<{
    id: number;
    name: string;
    logo?: string;
    national?: boolean;
    country?: string;
  }>;
  standings: Array<{
    rank: number;
    teamId: number;
    teamName: string;
    teamLogo?: string;
    played: number;
    wins: number;
    losses: number;
    pointsFor?: number;
    pointsAgainst?: number;
    form?: string;
    description?: string;
  }>;
  games: Array<{
    id: number;
    date: string;
    time?: string;
    status: string;
    statusLong?: string;
    home: { id: number; name: string; logo?: string };
    away: { id: number; name: string; logo?: string };
    homeScore: number | null;
    awayScore: number | null;
    venue?: string;
    stage?: string;
    week?: string;
  }>;
  placeholder?: boolean;
  meta?: { teamsCount: number; standingsCount: number; gamesCount: number };
}

// Types for Cedars data
interface CedarsEvent {
  id: string;
  name: string;
  filename?: string;
  sport: string;
  league: string;
  season: string;
  date: string;
  time?: string;
  venue?: string;
  city?: string | null;
  country?: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status: string;
  thumb?: string;
  description?: string;
}

interface CedarsPlayer {
  id: string;
  name: string;
  nationality?: string;
  position?: string;
  height?: string;
  weight?: string;
  birthDate?: string;
  birthLocation?: string;
  description?: string;
  thumb?: string;
  cutout?: string;
  number?: string;
}

interface CedarsData {
  fetchedAt: string;
  source: string;
  team: {
    id: string;
    name: string;
    nameAlt?: string;
    sport: string;
    league: string;
    country: string;
    badge?: string;
    logo?: string;
    banner?: string | null;
    stadium?: string;
    capacity?: string;
    description?: string;
    formedYear?: string;
  } | null;
  events: {
    all: CedarsEvent[];
    past: CedarsEvent[];
    upcoming: CedarsEvent[];
  };
  roster: CedarsPlayer[];
  rosterNote?: string;
}

export interface Game {
  id: string;
  date: string;
  displayDate: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  winner: string;
  venue?: string;
  type: 'finals' | 'regular' | 'playoffs';
  game?: number;
  highlights?: string;
  notes?: string;
  source?: string;
}

export type Season = '2025-26' | '2024-25';

function sanitizeDate(raw: string | undefined | null): { date: string; displayDate: string; sortKey: number } {
  if (!raw || raw === 'unknown' || raw === 'TBD' || raw === 'n/a') {
    return { date: '', displayDate: 'Date TBA', sortKey: 0 };
  }
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) {
    return { date: '', displayDate: 'Date TBA', sortKey: 0 };
  }
  return { date: raw, displayDate: raw, sortKey: d.getTime() };
}

export const useData = (selectedSeason: Season = '2025-26') => {
  // Check if 2024-25 data is available and not placeholder
  const has2425Data = data2425 && !data2425.placeholder && data2425.games.length > 0;
  
  // Use the appropriate data source
  const isArchiveSeason = selectedSeason === '2024-25' && has2425Data;

  // Teams - always use 2025-26 for team metadata (colors, arenas, etc.)
  const teams = useMemo(() => data2526.teams ?? [], []);
  
  // Standings - switch based on season, with status derived from rank
  const standings = useMemo(() => {
    const getStatus = (rank: number): string | undefined => {
      if (rank === 1) return 'champion';
      if (rank === 2) return 'runner-up';
      if (rank <= 8) return 'playoffs';
      return undefined;
    };

    if (isArchiveSeason && data2425) {
      // Map API-Sports standings to our format
      return data2425.standings.map(s => ({
        rank: s.rank,
        teamId: s.teamName.toLowerCase().replace(/\s+/g, '-'),
        played: s.played,
        wins: s.wins,
        losses: s.losses,
        points: s.wins * 2 + s.losses, // Approximate points calculation
        apiTeamId: s.teamId,
        apiTeamName: s.teamName,
        status: getStatus(s.rank),
      }));
    }
    // Add status to seed data standings
    return (data2526.standings ?? []).map(s => ({
      ...s,
      status: getStatus(s.rank),
    }));
  }, [isArchiveSeason]);

  const finals = useMemo(() => isArchiveSeason ? null : data2526.finals, [isArchiveSeason]);
  const awards = useMemo(() => isArchiveSeason ? {} : (data2526.awards ?? {}), [isArchiveSeason]);
  const players = useMemo(() => data2526.players ?? [], []);
  
  const season = useMemo(
    () => ({
      id: isArchiveSeason ? '2024-25' : data2526.season,
      league: isArchiveSeason ? 'Division 1 Lebanon' : data2526.league,
      champion: isArchiveSeason ? 'Unknown' : data2526.champion,
      runnerUp: isArchiveSeason ? 'Unknown' : data2526.runnerUp,
      duration: isArchiveSeason ? { start: '2024-10-01', end: '2025-08-01' } : data2526.duration,
      notes: isArchiveSeason ? ['API-Sports 2024-25 archive data'] : data2526.notes,
      isArchive: isArchiveSeason,
      dataSource: isArchiveSeason ? 'API-Sports' : 'Seed file',
    }),
    [isArchiveSeason]
  );

  const allGames = useMemo((): Game[] => {
    if (isArchiveSeason && data2425) {
      // Map API-Sports games to our format
      return data2425.games
        .filter(g => g.homeScore !== null && g.awayScore !== null)
        .map((g, i) => {
          const s = sanitizeDate(g.date);
          const homeScore = g.homeScore ?? 0;
          const awayScore = g.awayScore ?? 0;
          return {
            id: `api-${g.id}`,
            date: s.date || g.date,
            displayDate: s.displayDate,
            home: g.home.name,
            away: g.away.name,
            homeScore,
            awayScore,
            winner: homeScore > awayScore ? g.home.name : g.away.name,
            venue: g.venue,
            type: 'regular' as const,
            source: 'API-Sports',
            _sort: s.sortKey,
          } as Game & { _sort: number };
        })
        .sort((a, b) => ((b as any)._sort || 0) - ((a as any)._sort || 0))
        .map(({ _sort, ...rest }: any) => rest as Game);
    }

    // 2025-26 seed data
    const finalsGames: Game[] = (data2526.finals?.games ?? []).map((g) => {
      const s = sanitizeDate(g.date);
      return {
        id: `finals-g${g.game}`,
        date: s.date || g.date,
        displayDate: s.displayDate,
        home: g.home,
        away: g.away,
        homeScore: g.homeScore,
        awayScore: g.awayScore,
        winner: g.winner,
        venue: g.venue,
        type: 'finals' as const,
        game: g.game,
        highlights: g.highlights,
        source: g.source,
        _sort: s.sortKey,
      } as Game & { _sort: number };
    });

    const regularGames: Game[] = (data2526.regularSeasonSampleGames ?? []).map((g, i) => {
      const s = sanitizeDate(g.date);
      return {
        id: `rs-${i}`,
        date: s.date || g.date,
        displayDate: s.displayDate,
        home: g.home,
        away: g.away,
        homeScore: g.homeScore,
        awayScore: g.awayScore,
        winner: g.winner,
        type: 'regular' as const,
        notes: g.notes,
        source: g.source,
        _sort: s.sortKey,
      } as Game & { _sort: number };
    });

    return [...finalsGames, ...regularGames]
      .sort((a, b) => ((b as any)._sort || 0) - ((a as any)._sort || 0))
      .map(({ _sort, ...rest }: any) => rest as Game);
  }, [isArchiveSeason]);

  const getTeam = (id: string): Team | undefined => teams.find((t) => t.id === id);

  const getTeamByName = (name: string): Team | undefined =>
    teams.find(
      (t) =>
        t.nameEn.toLowerCase() === name.toLowerCase() ||
        t.nameAr === name ||
        t.altNames?.some((alt) => alt.toLowerCase() === name.toLowerCase())
    );

  const getStanding = (teamId: string): Standing | undefined => 
    standings.find((s) => s.teamId === teamId) as Standing | undefined;

  const getTeamGames = (teamId: string): Game[] => {
    const team = getTeam(teamId);
    if (!team) return [];
    const names = [team.nameEn, team.nameAr, ...(team.altNames || [])];
    return allGames.filter((g) => names.some((n) => g.home === n || g.away === n));
  };

  const getGame = (gameId: string): Game | undefined => allGames.find((g) => g.id === gameId);

  const getFinalsGame = (gameNum: number): FinalsGame | undefined =>
    finals?.games.find((g) => g.game === gameNum);

  const getTeamPlayers = (teamId: string): Player[] => players.filter((p) => p.teamId === teamId);

  // Cedars data
  const cedars = useMemo(() => {
    if (!cedarsData) return null;
    return {
      team: cedarsData.team,
      events: cedarsData.events,
      roster: cedarsData.roster,
      fetchedAt: cedarsData.fetchedAt,
    };
  }, []);

  // Available seasons
  const availableSeasons = useMemo((): Season[] => {
    const seasons: Season[] = ['2025-26'];
    if (has2425Data) {
      seasons.push('2024-25');
    }
    return seasons;
  }, [has2425Data]);

  return {
    teams,
    standings,
    finals,
    awards,
    players,
    season,
    allGames,
    getTeam,
    getTeamByName,
    getStanding,
    getTeamGames,
    getGame,
    getFinalsGame,
    getTeamPlayers,
    // New exports for hybrid data
    cedars,
    availableSeasons,
    selectedSeason,
    has2425Data,
  };
};

export default useData;
