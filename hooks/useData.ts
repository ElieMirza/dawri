import { useMemo } from 'react';

// Explicit require keeps JSON bundled reliably on web static export
// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../data/lbl-2025-26.json') as typeof import('../data/lbl-2025-26.json');

export type Team = (typeof data.teams)[number];
export type Standing = (typeof data.standings)[number];
export type FinalsGame = (typeof data.finals.games)[number];
export type RegularSeasonGame = (typeof data.regularSeasonSampleGames)[number];
export type Player = (typeof data.players)[number];

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

export const useData = () => {
  const teams = useMemo(() => data.teams ?? [], []);
  const standings = useMemo(() => data.standings ?? [], []);
  const finals = useMemo(() => data.finals, []);
  const awards = useMemo(() => data.awards ?? {}, []);
  const players = useMemo(() => data.players ?? [], []);
  const season = useMemo(
    () => ({
      id: data.season,
      league: data.league,
      champion: data.champion,
      runnerUp: data.runnerUp,
      duration: data.duration,
      notes: data.notes,
    }),
    []
  );

  const allGames = useMemo((): Game[] => {
    const finalsGames: Game[] = (data.finals?.games ?? []).map((g) => {
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

    const regularGames: Game[] = (data.regularSeasonSampleGames ?? []).map((g, i) => {
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
  }, []);

  const getTeam = (id: string): Team | undefined => teams.find((t) => t.id === id);

  const getTeamByName = (name: string): Team | undefined =>
    teams.find(
      (t) =>
        t.nameEn.toLowerCase() === name.toLowerCase() ||
        t.nameAr === name ||
        t.altNames?.some((alt) => alt.toLowerCase() === name.toLowerCase())
    );

  const getStanding = (teamId: string): Standing | undefined => standings.find((s) => s.teamId === teamId);

  const getTeamGames = (teamId: string): Game[] => {
    const team = getTeam(teamId);
    if (!team) return [];
    const names = [team.nameEn, team.nameAr, ...(team.altNames || [])];
    return allGames.filter((g) => names.some((n) => g.home === n || g.away === n));
  };

  const getGame = (gameId: string): Game | undefined => allGames.find((g) => g.id === gameId);

  const getFinalsGame = (gameNum: number): FinalsGame | undefined =>
    finals.games.find((g) => g.game === gameNum);

  const getTeamPlayers = (teamId: string): Player[] => players.filter((p) => p.teamId === teamId);

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
  };
};

export default useData;
