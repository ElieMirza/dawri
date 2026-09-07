import { useMemo } from 'react';
import data from '../data/lbl-2025-26.json';

export type Team = typeof data.teams[number];
export type Standing = typeof data.standings[number];
export type FinalsGame = typeof data.finals.games[number];
export type RegularSeasonGame = typeof data.regularSeasonSampleGames[number];
export type Player = typeof data.players[number];

export interface Game {
  id: string;
  date: string;
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

export const useData = () => {
  const teams = useMemo(() => data.teams, []);
  const standings = useMemo(() => data.standings, []);
  const finals = useMemo(() => data.finals, []);
  const awards = useMemo(() => data.awards, []);
  const players = useMemo(() => data.players, []);
  const season = useMemo(() => ({
    id: data.season, league: data.league, champion: data.champion,
    runnerUp: data.runnerUp, duration: data.duration, notes: data.notes,
  }), []);
  const allGames = useMemo((): Game[] => {
    const finalsGames: Game[] = data.finals.games.map((g) => ({
      id: `finals-g${g.game}`, date: g.date, home: g.home, away: g.away,
      homeScore: g.homeScore, awayScore: g.awayScore, winner: g.winner,
      venue: g.venue, type: 'finals' as const, game: g.game,
      highlights: g.highlights, source: g.source,
    }));
    const regularGames: Game[] = data.regularSeasonSampleGames.map((g, i) => ({
      id: `rs-${i}`, date: g.date, home: g.home, away: g.away,
      homeScore: g.homeScore, awayScore: g.awayScore, winner: g.winner,
      type: 'regular' as const, notes: g.notes, source: g.source,
    }));
    return [...finalsGames, ...regularGames].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, []);
  const getTeam = (id: string) => teams.find((t) => t.id === id);
  const getTeamByName = (name: string) => teams.find((t) =>
    t.nameEn.toLowerCase() === name.toLowerCase() || t.nameAr === name ||
    t.altNames?.some((alt) => alt.toLowerCase() === name.toLowerCase()));
  const getStanding = (teamId: string) => standings.find((s) => s.teamId === teamId);
  const getTeamGames = (teamId: string): Game[] => {
    const team = getTeam(teamId);
    if (!team) return [];
    const names = [team.nameEn, team.nameAr, ...(team.altNames || [])];
    return allGames.filter((g) => names.some((n) => g.home === n || g.away === n));
  };
  const getGame = (gameId: string) => allGames.find((g) => g.id === gameId);
  const getFinalsGame = (gameNum: number) => finals.games.find((g) => g.game === gameNum);
  const getTeamPlayers = (teamId: string) => players.filter((p) => p.teamId === teamId);
  return { teams, standings, finals, awards, players, season, allGames, getTeam, getTeamByName, getStanding, getTeamGames, getGame, getFinalsGame, getTeamPlayers };
};

export default useData;
