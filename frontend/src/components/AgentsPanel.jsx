import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

const AgentsPanel = ({ agents }) => {
  return (
    <div className="agents-panel glass-panel">
      <div className="panel-header">
        <Activity size={18} color="var(--neon-cyan)" />
        <h3 className="font-orbitron">NEURAL_AGENTS_V2</h3>
      </div>
      
      <div className="agents-list">
        {agents.map((agent, index) => {
          const glowColor = agent.status === 'critical' ? 'var(--neon-red)' : agent.status === 'warning' ? 'var(--neon-orange)' : 'var(--neon-green)';
          
          return (
            <motion.div 
              key={agent.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                boxShadow: `0 0 15px ${glowColor}22`,
                borderColor: `${glowColor}44`
              }}
              className={`agent-card ${agent.status}`}
            >
              <div className="agent-info">
                <div className="agent-name-row">
                  <span className="agent-name">{agent.name}</span>
                  <span className={`status-badge ${agent.status}`}>
                    {agent.status === 'active' ? <CheckCircle size={10} /> : agent.status === 'warning' ? <AlertTriangle size={10} /> : <AlertOctagon size={10} />}
                    {agent.status.toUpperCase()}
                  </span>
                </div>
                <p className="agent-msg">{agent.message}</p>
              </div>
              
              <div className="agent-stats">
                <div className="stat-header">
                  <span>CONFIDENCE</span>
                  <span style={{ color: glowColor }}>{(agent.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="confidence-bar">
                  <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.confidence * 100}%` }}
                      className="confidence-fill"
                      style={{ background: glowColor, boxShadow: `0 0 10px ${glowColor}` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <style jsx="true">{`
        .agents-panel { height: 100%; display: flex; flex-direction: column; }
        .panel-header { padding: 15px 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--border-glass); }
        .agents-list { padding: 15px; display: flex; flex-direction: column; gap: 12px; }
        .agent-card { background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); padding: 15px; border-radius: 4px; transition: all 0.5s ease; }
        .agent-card.critical { background: rgba(255, 0, 60, 0.03); }
        .agent-name-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
        .agent-name { font-weight: 600; font-size: 0.8rem; letter-spacing: 1px; }
        .status-badge { font-size: 0.55rem; display: flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 2px; }
        .status-badge.active { color: var(--neon-green); border: 1px solid var(--neon-green); }
        .status-badge.warning { color: var(--neon-orange); border: 1px solid var(--neon-orange); }
        .status-badge.critical { color: var(--neon-red); border: 1px solid var(--neon-red); }
        .agent-msg { font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 10px; }
        .stat-header { display: flex; justify-content: space-between; font-size: 0.6rem; color: var(--text-secondary); margin-bottom: 4px; }
        .confidence-bar { height: 2px; background: rgba(255, 255, 255, 0.05); }
        .confidence-fill { height: 100%; }
      `}</style>
    </div>
  );
};

export default AgentsPanel;
