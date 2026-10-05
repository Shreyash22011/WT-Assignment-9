import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Player } from '../types';
import { AlertCircle, Calendar } from 'lucide-react';

export const Players: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const data = await api.getPlayers();
        setPlayers(data);
      } catch (err) {
        setError('Unable to load players data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return (
      <div className="state-container">
        <div className="state-icon">
          <Calendar size={48} style={{ animation: 'spin 2s linear infinite' }} />
        </div>
        <div className="state-text">Loading players...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-container">
        <div className="state-icon" style={{ color: 'var(--live-color)' }}>
          <AlertCircle size={48} />
        </div>
        <div className="state-text">{error}</div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="state-container">
        <div className="state-text">No player statistics available</div>
      </div>
    );
  }

  // Group players by team name
  const playersByTeam = players.reduce((acc, player) => {
    const teamName = player.team?.name || 'Unknown Team';
    if (!acc[teamName]) acc[teamName] = [];
    acc[teamName].push(player);
    return acc;
  }, {} as Record<string, Player[]>);

  return (
    <div className="flex flex-col gap-8">
      <div className="section-header">
        <h2 className="section-title">Sample Player Statistics (Demo)</h2>
      </div>

      {Object.entries(playersByTeam).map(([teamName, teamPlayers]) => (
        <div key={teamName} className="mb-8">
          <h3 className="text-xl font-bold mb-4" style={{ textTransform: 'uppercase', color: 'var(--accent-color)' }}>
            {teamName}
          </h3>
          
          <div className="card mb-6" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Runs</th>
                    <th>Balls</th>
                    <th>4s</th>
                    <th>6s</th>
                    <th>Wickets</th>
                    <th>Overs</th>
                    <th>Runs Conceded</th>
                  </tr>
                </thead>
                <tbody>
                  {teamPlayers.map(player => (
                    <tr key={player.id}>
                      <td className="font-semibold">{player.name}</td>
                      <td className="font-bold">{player.runs}</td>
                      <td>{player.balls}</td>
                      <td>{player.fours}</td>
                      <td>{player.sixes}</td>
                      <td className="font-bold" style={{ color: 'var(--accent-color)' }}>{player.wickets}</td>
                      <td>{player.oversBowled}</td>
                      <td>{player.runsConceded}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
