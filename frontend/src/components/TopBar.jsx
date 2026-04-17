import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, User, Clock, Search, Zap, Menu } from 'lucide-react';

const TopBar = ({ theme, onToggleNotifications, notificationCount = 0, onMenuClick }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="top-bar glass-panel">
      <div 
        className="hamburger-menu" 
        style={{ display: 'none', cursor: 'pointer', marginRight: '15px', color: 'var(--text-primary)' }} 
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </div>

      <div className="search-box">
        <Search size={16} color="var(--text-secondary)" />
        <input type="text" placeholder="QUERY SYSTEM DATABASE..." />
      </div>

      <div className="top-bar-right">
        <div className="theme-toggle">
            <button 
              onClick={() => window.toggleTheme('dark')} 
              className={`theme-btn dark ${theme === 'dark' ? 'active' : ''}`}
            >
              DARK
            </button>
            <button 
              onClick={() => window.toggleTheme('light')} 
              className={`theme-btn light ${theme === 'light' ? 'active' : ''}`}
            >
              LIGHT
            </button>
        </div>
        
        <div className="system-status-pills">
            <span className="status-pill db">DB: ONLINE</span>
            <span className="status-pill sensor">ENV: ACTIVE</span>
        </div>

        <div className="system-load">
          <Zap size={14} color="var(--neon-orange)" />
          <span style={{ fontSize: '0.8rem', marginRight: '20px' }}>CORE: 42%</span>
        </div>

        <div className="time-display">
          <Clock size={16} />
          <span>{time.toLocaleTimeString()}</span>
        </div>

        <div className="notifications-icon" onClick={onToggleNotifications}>
          <Bell size={18} />
          {notificationCount > 0 && (
            <div className="notification-dot">{notificationCount}</div>
          )}
        </div>

        <div className="profile-section">
          <div className="user-avatar">
            <User size={18} />
          </div>
          <div className="user-info">
            <span className="user-name">ADMIN_01</span>
            <span className="user-role">SYSTEM ARCHITECT</span>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 30px;
          height: 70px;
          border-radius: 0;
          border-top: none;
          border-left: none;
          border-right: none;
          background: var(--bg-glass);
          border-bottom: 1px solid var(--border-glass);
        }
        .search-box {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(0, 0, 0, 0.05);
          padding: 8px 15px;
          border-radius: 4px;
          width: 300px;
        }
        .light-mode .search-box {
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid var(--border-glass);
        }
        .search-box input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          width: 100%;
          outline: none;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 1px;
          font-size: 0.8rem;
        }
        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 25px;
        }
        .theme-toggle {
          display: flex;
          background: rgba(0, 0, 0, 0.05);
          padding: 2px;
          border-radius: 6px;
          border: 1px solid var(--border-glass);
        }
        .theme-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 5px 12px;
          font-size: 0.65rem;
          cursor: pointer;
          font-family: 'Orbitron', sans-serif;
          border-radius: 4px;
          transition: var(--transition-smooth);
        }
        .theme-btn:hover { color: var(--neon-cyan); }
        .theme-btn.active { background: var(--neon-cyan); color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        
        .system-status-pills {
          display: flex;
          gap: 10px;
        }
        .status-pill {
          font-size: 0.6rem;
          padding: 2px 8px;
          border-radius: 2px;
          border: 1px solid var(--border-glass);
          letter-spacing: 1px;
        }
        .status-pill.db { color: var(--neon-cyan); border-color: var(--neon-cyan); }
        .status-pill.sensor { color: var(--neon-green); border-color: var(--neon-green); }
        
        .time-display {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.9rem;
          color: var(--neon-cyan);
        }
        .notifications-icon {
          position: relative;
          cursor: pointer;
          color: var(--text-secondary);
        }
        .notification-dot {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 16px;
          height: 16px;
          background: var(--neon-red);
          border-radius: 50%;
          border: 1px solid var(--bg-dark);
          color: white;
          font-size: 0.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-family: sans-serif;
        }
        .profile-section {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-left: 20px;
          border-left: 1px solid var(--border-glass);
        }
        .user-avatar {
          width: 35px;
          height: 35px;
          background: rgba(37, 99, 235, 0.1);
          border: 1px solid var(--neon-cyan);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--neon-cyan);
        }
        .user-info {
          display: flex;
          flex-direction: column;
        }
        .user-name {
          font-size: 0.8rem;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .user-role {
          font-size: 0.6rem;
          color: var(--text-secondary);
        }
        .system-load {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--neon-orange);
        }
      `}</style>
    </header>
  );
};

export default TopBar;
