import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Match } from '../types';
import { MatchCard } from '../components/MatchCard';
import { AlertCircle, Calendar } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [realLiveMatches, setRealLiveMatches] = useState<Match[]>([]);
  const [demoLiveMatch, setDemoLiveMatch] = useState<Match | null>(null);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const [live, recent] = await Promise.all([
        api.getLiveMatches(),
        api.getMatches()
      ]);
      const real = live.filter(m => m.apiMatchId !== 'demo-live-match-1');
      const demo = live.find(m => m.apiMatchId === 'demo-live-match-1') || null;
      
      setRealLiveMatches(real);
      setDemoLiveMatch(demo);
      setRecentMatches(recent.filter(m => m.status !== 'LIVE').slice(0, 6));
    } catch (err) {
      setError('Unable to load match data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadData();

    // Poll backend every 20 seconds
    const intervalId = setInterval(() => {
      loadData();
    }, 20000);

    const handleRefresh = async () => {
      setLoading(true);
      try {
        await api.fetchLiveMatches();
      } catch (e) {
        console.error("Failed to fetch from CricAPI", e);
      }
      await loadData();
    };
    
    window.addEventListener('refresh-dashboard', handleRefresh);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('refresh-dashboard', handleRefresh);
    };
  }, []);

  if (loading) {
    return (
      <div className="state-container">
        <div className="state-icon">
          <Calendar size={48} style={{ animation: 'spin 2s linear infinite' }} />
        </div>
        <div className="state-text">Loading match data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-container">
        <div className="state-icon" style={{ color: 'var(--live-color)' }}>
          <AlertCircle size={48} />
        </div>
        <div className="state-text mb-4">{error}</div>
        <button className="btn-primary" onClick={loadData}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="mb-8">
        <div className="section-header">
          <h2 className="section-title flex items-center gap-2">
            <div className="live-dot" style={{ display: 'inline-block' }}></div>
            Live Matches
          </h2>
        </div>
        
        {realLiveMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {realLiveMatches.map(match => (
              <MatchCard key={match.id} match={match} isLive={true} />
            ))}
          </div>
        ) : demoLiveMatch ? (
          <div>
            <div className="text-secondary mb-4 italic">No real live matches currently. Displaying sample demonstration:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <MatchCard key={demoLiveMatch.id} match={demoLiveMatch} isLive={true} />
            </div>
          </div>
        ) : (
          <div className="state-container" style={{ padding: '2rem 1rem' }}>
            <div className="state-text">No live matches right now</div>
          </div>
        )}
      </section>

      <section>
        <div className="section-header">
          <h2 className="section-title">Recent Matches</h2>
        </div>
        
        {recentMatches.length === 0 ? (
          <div className="state-container" style={{ padding: '2rem 1rem' }}>
            <div className="state-text">No recent matches found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {recentMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
