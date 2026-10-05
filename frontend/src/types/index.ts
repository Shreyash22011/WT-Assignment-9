export interface Team {
    id: number;
    name: string;
}

export interface Player {
    id: number;
    name: string;
    team: Team;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    wickets: number;
    oversBowled: number;
    runsConceded: number;
}

export interface Score {
    id: number;
    runs: number;
    wickets: number;
    overs: number;
    runRate: number;
}

export interface Match {
    id: number;
    apiMatchId: string;
    team1: Team;
    team2: Team;
    status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
    matchDate: string;
    venue: string;
    winner: string | null;
    currentScore: Score | null;
}

export type MatchEventType = 'DOT_BALL' | 'RUN' | 'FOUR' | 'SIX' | 'WICKET';

export interface MatchEvent {
    id?: number;
    overNumber: number;
    ballNumber: number;
    eventType: MatchEventType;
    runs: number;
    description: string;
}
