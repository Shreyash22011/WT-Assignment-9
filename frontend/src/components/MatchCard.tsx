import React from 'react';
import type { Match } from '../types';
import { Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MatchCardProps {
  match: Match;
  isLive?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const score = match.currentScore;
  const navigate = useNavigate();
  
  return (
    <div className="card" onClick={() => navigate(`/matches/${match.id}`)} style={{ cursor: 'pointer' }}>
      <div className="match-card-header">
        <span className={`badge ${match.status.toLowerCase()}`}>
          {match.status}
        </span>
        <span className="text-sm text-secondary flex items-center gap-2">
          <Calendar size={14} />
          {new Date(match.matchDate).toLocaleDateString()}
        </span>
      </div>
      
      <div className="mt-4">
        <div className="team-row">
          <span className="team-name">{match.team1.name}</span>
          {score && (
            <span className="font-bold text-xl">
              {score.runs}/{score.wickets}
            </span>
          )}
        </div>
        
        <div className="team-row text-secondary">
          <span className="team-name">{match.team2.name}</span>
          {score && (
            <span className="text-sm">
              ({score.overs} ov)
            </span>
          )}
        </div>
      </div>
      
      {match.winner && (
        <div className="winner-text">
          {match.winner}
        </div>
      )}
      
      <div className="match-footer">
        <div className="flex items-center gap-2">
          <MapPin size={14} />
          {match.venue}
        </div>
        {score && (
          <div>CRR: {score.runRate.toFixed(2)}</div>
        )}
      </div>
    </div>
  );
};
