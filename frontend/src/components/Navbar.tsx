import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onRefresh, isRefreshing }) => {
  return (
    <nav className="navbar">
      <div className="flex items-center" style={{ gap: '2rem' }}>
        <div className="nav-brand">
          <Activity size={24} />
          CricketScore
        </div>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
          <NavLink to="/players" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Players</NavLink>
        </div>
      </div>
      <div className="nav-right">
        <div className="live-indicator">
          <div className="live-dot"></div>
          Live Data
        </div>
        <button 
          className="btn-primary" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw 
            size={16} 
            style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} 
          />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </nav>
  );
};
