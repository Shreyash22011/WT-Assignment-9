import type { Match, Player, Score, Team, MatchEvent } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
    getMatches: async (): Promise<Match[]> => {
        const response = await fetch(`${API_BASE_URL}/matches`);
        if (!response.ok) throw new Error('Failed to fetch matches');
        return response.json();
    },
    
    getLiveMatches: async (): Promise<Match[]> => {
        const response = await fetch(`${API_BASE_URL}/live-matches`);
        if (!response.ok) throw new Error('Failed to fetch live matches');
        return response.json();
    },
    
    fetchLiveMatches: async (): Promise<Match[]> => {
        const response = await fetch(`${API_BASE_URL}/matches/fetch-live`);
        if (!response.ok) throw new Error('Failed to fetch from external API');
        return response.json();
    },
    
    getMatchById: async (id: number): Promise<Match> => {
        const response = await fetch(`${API_BASE_URL}/matches/${id}`);
        if (!response.ok) throw new Error('Failed to fetch match details');
        return response.json();
    },
    
    getMatchScore: async (id: number): Promise<Score> => {
        const response = await fetch(`${API_BASE_URL}/matches/${id}/score`);
        if (!response.ok) throw new Error('Failed to fetch score');
        return response.json();
    },
    
    getPlayers: async (): Promise<Player[]> => {
        const response = await fetch(`${API_BASE_URL}/players`);
        if (!response.ok) throw new Error('Failed to fetch players');
        return response.json();
    },
    
    getTeams: async (): Promise<Team[]> => {
        const response = await fetch(`${API_BASE_URL}/teams`);
        if (!response.ok) throw new Error('Failed to fetch teams');
        return response.json();
    },

    getMatchEvents: async (id: number): Promise<MatchEvent[]> => {
        const response = await fetch(`${API_BASE_URL}/matches/${id}/events`);
        if (!response.ok) throw new Error('Failed to fetch match events');
        return response.json();
    },

    addMatchEvent: async (id: number, event: Partial<MatchEvent>): Promise<MatchEvent> => {
        const response = await fetch(`${API_BASE_URL}/demo/matches/${id}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });
        if (!response.ok) throw new Error('Failed to add match event');
        return response.json();
    }
};
