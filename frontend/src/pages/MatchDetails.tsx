import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Match, Score, MatchEvent, MatchEventType } from '../types';
import { ArrowLeft, Calendar, MapPin, AlertCircle, Trophy, Activity } from 'lucide-react';

export const MatchDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [match, setMatch] = useState<Match | null>(null);
  const [score, setScore] = useState<Score | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const fetchDetails = useCallback(async () => {
    if (!id) return;
    try {
      const matchId = parseInt(id, 10);
      const matchData = await api.getMatchById(matchId);
      setMatch(matchData);
      
      try {
        const scoreData = await api.getMatchScore(matchId);
        setScore(scoreData);
      } catch (scoreErr) {
        console.error("No separate score data available", scoreErr);
        if (matchData.currentScore) {
          setScore(matchData.currentScore);
        }
      }

      try {
        const eventsData = await api.getMatchEvents(matchId);
        setEvents(eventsData);
      } catch (eventErr) {
        console.error("No events data available", eventErr);
      }
    } catch (err) {
      setError('Unable to load match details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchDetails();
  }, [fetchDetails]);

  const handleAddEvent = async (eventType: MatchEventType, runs: number, description: string) => {
    if (!id) return;
    try {
      setIsAddingEvent(true);
      const matchId = parseInt(id, 10);
      await api.addMatchEvent(matchId, { eventType, runs, description });
      await fetchDetails();
    } catch (err) {
      console.error('Failed to add event', err);
      alert('Failed to add match event');
    } finally {
      setIsAddingEvent(false);
    }
  };

  if (loading) {
    return (
      <div className="state-container">
        <div className="state-icon">
          <Calendar size={48} style={{ animation: 'spin 2s linear infinite' }} />
        </div>
        <div className="state-text">Loading match details...</div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="state-container">
        <div className="state-icon" style={{ color: 'var(--live-color)' }}>
          <AlertCircle size={48} />
        </div>
        <div className="state-text mb-4">{error || 'Match not found'}</div>
        <button className="btn-primary" onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/')} 
          style={{ 
            padding: '0.5rem 1rem', 
            fontSize: '0.875rem', 
            backgroundColor: 'var(--card-bg)', 
            color: 'var(--text-primary)', 
            border: '1px solid var(--border-color)' 
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <div className="card" style={{ padding: '3rem 2rem' }}>
        <div className="flex flex-col items-center mb-8">
          <span className={`badge ${match.status.toLowerCase()} mb-4`}>
            {match.status}
          </span>
          <div className="text-secondary flex items-center gap-2 mb-2">
            <Calendar size={16} /> {new Date(match.matchDate).toLocaleDateString()}
          </div>
          <div className="text-secondary flex items-center gap-2">
            <MapPin size={16} /> {match.venue}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <div className="text-center md:text-left flex-1" style={{ display: 'flex', justifyContent: 'center' }}>
            <h2 className="text-2xl font-bold">{match.team1.name}</h2>
          </div>
          
          <div className="text-center flex-1">
            <div className="text-xl text-secondary font-semibold">VS</div>
            {score && (
              <div className="mt-4">
                <div className="score-highlight">{score.runs}/{score.wickets}</div>
                <div className="overs-highlight mt-2">{score.overs} overs</div>
                <div className="text-sm text-secondary mt-1">CRR: {score.runRate.toFixed(2)}</div>
              </div>
            )}
          </div>

          <div className="text-center md:text-right flex-1" style={{ display: 'flex', justifyContent: 'center' }}>
            <h2 className="text-2xl font-bold">{match.team2.name}</h2>
          </div>
        </div>

        {match.winner && (
          <div className="flex flex-col items-center mt-8 pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
            <Trophy size={32} className="mb-4" style={{ color: '#fbbf24' }} />
            <h3 className="text-xl font-bold" style={{ color: 'var(--accent-color)' }}>
              {match.winner}
            </h3>
          </div>
        )}
      </div>

      {match.status === 'LIVE' && match.id === 2 && (
        <div className="card" style={{ padding: '2rem' }}>
          <div className="section-header mb-6">
            <h3 className="section-title text-xl">Score Management (Demo)</h3>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn-primary" disabled={isAddingEvent} onClick={() => handleAddEvent('DOT_BALL', 0, '0 runs')}>Dot Ball</button>
            <button className="btn-primary" disabled={isAddingEvent} onClick={() => handleAddEvent('RUN', 1, '1 run')}>+1 Run</button>
            <button className="btn-primary" disabled={isAddingEvent} onClick={() => handleAddEvent('RUN', 2, '2 runs')}>+2 Runs</button>
            <button className="btn-primary" disabled={isAddingEvent} onClick={() => handleAddEvent('RUN', 3, '3 runs')}>+3 Runs</button>
            <button className="btn-primary" disabled={isAddingEvent} onClick={() => handleAddEvent('FOUR', 4, 'FOUR')}>FOUR</button>
            <button className="btn-primary" disabled={isAddingEvent} onClick={() => handleAddEvent('SIX', 6, 'SIX')}>SIX</button>
            <button className="btn-primary" disabled={isAddingEvent} onClick={() => handleAddEvent('WICKET', 0, 'WICKET')} style={{ backgroundColor: '#ef4444' }}>WICKET</button>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="section-header" style={{ padding: '2rem 2rem 0 2rem' }}>
          <h3 className="section-title text-xl flex items-center gap-2">
            <Activity size={24} /> Match Events
          </h3>
        </div>
        
        <div className="table-container p-6">
          {events.length === 0 ? (
            <div className="text-center text-secondary py-8">
              No match events recorded yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
              {events.slice().reverse().map((event, index) => (
                <div key={event.id || index} className="flex items-center gap-4 p-4 rounded bg-[#1f2937] border border-[#374151]">
                  <div className="font-bold text-lg w-16" style={{ color: 'var(--accent-color)' }}>
                    {event.overNumber}.{event.ballNumber}
                  </div>
                  <div className={`font-semibold px-3 py-1 rounded text-sm ${
                    event.eventType === 'WICKET' ? 'bg-red-900/50 text-red-400' :
                    event.eventType === 'FOUR' || event.eventType === 'SIX' ? 'bg-green-900/50 text-green-400' :
                    'bg-gray-800 text-gray-300'
                  }`}>
                    {event.eventType}
                  </div>
                  <div className="text-gray-300">
                    {event.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
