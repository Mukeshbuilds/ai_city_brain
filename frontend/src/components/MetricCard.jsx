import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ title, value, unit, trend, color }) => {
  // Ensure value is a number
  const displayValue = typeof value === 'number' ? value.toFixed(1) : '0.0';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="metric-card glass-panel"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <div className="card-bg-glow" style={{ background: `radial-gradient(circle at top right, ${color}11, transparent)` }}></div>
      
      <div className="card-header">
        <span className="card-title">{title}</span>
        <div className="trend-indicator">
          <span style={{ fontSize: '0.6rem', color: trend === 'up' ? 'var(--neon-red)' : 'var(--neon-green)' }}>
             {trend === 'up' ? '▲' : '▼'}
          </span>
        </div>
      </div>

      <div className="card-value-container">
        <h2 className="card-value font-orbitron">
          <span>{displayValue}</span>
          <span className="unit">{unit}</span>
        </h2>
      </div>

      <div className="card-footer">
        <div className="progress-bar-bg">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, typeof value === 'number' ? value : 0))}%` }}
            transition={{ duration: 1.5 }}
            className="progress-bar-fill"
            style={{ background: color }}
          />
        </div>
        <span className="status-text">LIVE_NODE_SYNC</span>
      </div>

      <style jsx="true">{`
        .metric-card {
          padding: 20px;
          position: relative;
          min-height: 140px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .metric-card:hover {
          box-shadow: 0 0 20px ${color}33;
        }
        .light-mode .metric-card:hover {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .card-bg-glow {
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          pointer-events: none;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .card-title {
          font-size: 0.75rem;
          color: var(--text-secondary);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .card-value {
          font-size: 1.8rem;
          color: var(--text-primary);
          display: flex;
          align-items: baseline;
          gap: 5px;
        }
        .unit {
          font-size: 1rem;
          color: var(--text-secondary);
        }
        .progress-bar-bg {
          width: 100%;
          height: 3px;
          background: rgba(0, 0, 0, 0.05);
          margin-bottom: 8px;
          border-radius: 2px;
          overflow: hidden;
        }
        .light-mode .progress-bar-bg {
          background: rgba(0, 0, 0, 0.03);
        }
        .progress-bar-fill {
          height: 100%;
          box-shadow: 0 0 10px ${color}88;
        }
        .light-mode .progress-bar-fill {
           box-shadow: none;
        }
        .status-text {
          font-size: 0.55rem;
          color: var(--text-secondary);
          letter-spacing: 1px;
        }
      `}</style>
    </motion.div>
  );
};

export default MetricCard;
