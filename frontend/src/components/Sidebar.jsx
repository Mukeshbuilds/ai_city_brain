import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Brain, Activity, ShieldAlert, Settings, Box, Info, BarChart2, FileText, Server } from 'lucide-react';
import useSound from 'use-sound';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.1 });
  
  const menuItems = [
    { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { id: 'intelligence', icon: <Brain size={20} />, label: 'Simulation Engine' },
    { id: 'analytics', icon: <BarChart2 size={20} />, label: 'Analytics' },
    { id: 'reports', icon: <FileText size={20} />, label: 'Reports' },
    { id: 'simulation', icon: <Box size={20} />, label: 'City Map' },
    { id: 'performance', icon: <Activity size={20} />, label: 'Health' },
    { id: 'security', icon: <ShieldAlert size={20} />, label: 'Emergency' },
    { id: 'monitor', icon: <Server size={20} />, label: 'API Monitor' },
    { id: 'settings', icon: <Settings size={20} />, label: 'System Control' },
    { id: 'about', icon: <Info size={20} />, label: 'About System' },
  ];

  return (
    <motion.aside 
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className={`sidebar glass-panel ${isOpen ? 'mobile-open' : ''}`}
    >
      <div className="sidebar-logo">
        <img src="/logo.png" alt="AI City Brain" className="logo-img" />
        <span className="font-orbitron" style={{ fontSize: '1rem', background: 'linear-gradient(to right, var(--neon-cyan), var(--neon-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BRAIN</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ x: 5 }}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => { playClick(); setActiveTab(item.id); if (setIsOpen) setIsOpen(false); }}
          >
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-label">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeIndicator"
                className="active-indicator"
              />
            )}
          </motion.div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <div className="status-dot online"></div>
          <span>NODE: ALPHA-7</span>
        </div>
      </div>

      <style jsx="true">{`
        .sidebar {
          width: 240px;
          height: 100vh;
          border-right: 1px solid var(--border-glass);
          display: flex;
          flex-direction: column;
          z-index: 100;
          background: var(--bg-glass);
          border-radius: 0;
          transition: var(--transition-smooth);
        }
        .sidebar-logo {
          padding: 30px 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          border-bottom: 1px solid var(--border-glass);
        }
        .logo-img {
          width: 28px;
          height: 28px;
          object-fit: contain;
          filter: drop-shadow(0 0 5px var(--neon-cyan));
        }
        .sidebar-nav {
          padding: 20px 0;
          flex: 1;
        }
        .nav-item {
          padding: 15px 25px;
          display: flex;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          color: var(--text-secondary);
          position: relative;
          transition: var(--transition-smooth);
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          letter-spacing: 1px;
        }
        .nav-item:hover {
          color: var(--neon-cyan);
          background: rgba(0, 0, 0, 0.03);
        }
        .nav-item.active {
          color: var(--text-primary);
          background: rgba(37, 99, 235, 0.08);
        }
        .light-mode .nav-item.active {
          background: rgba(37, 99, 235, 0.1);
          color: var(--neon-cyan);
        }
        .nav-item.active .nav-icon {
          color: var(--neon-cyan);
        }
        .active-indicator {
          position: absolute;
          right: 0;
          width: 4px;
          height: 40%;
          background: var(--neon-cyan);
          border-radius: 4px 0 0 4px;
        }
        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid var(--border-glass);
        }
        .system-status {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.7rem;
          color: var(--text-secondary);
          letter-spacing: 1px;
        }
        .status-dot.online {
          width: 6px;
          height: 6px;
          background: var(--neon-green);
          border-radius: 50%;
        }
      `}</style>
    </motion.aside>
  );
};

export default Sidebar;
