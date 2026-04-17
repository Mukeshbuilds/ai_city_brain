import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CoordinationBrain = ({ data, theme = 'dark' }) => {
  const syncLevel = data?.sync_level || 94.2;
  const isOptimized = data?.scenarios?.policies?.green_energy;

  const agents = [
    { name: 'Traffic Node', status: 'SYNCHRONIZED', load: '42%' },
    { name: 'Energy Grid', status: 'BALANCED', load: '68%' },
    { name: 'Environment', status: 'STABLE', load: '12%' },
    { name: 'Security', status: 'ACTIVE', load: '5%' }
  ];

  const handleOptimize = async () => {
    try {
      const newState = !isOptimized;
      await axios.post(`https://ai-city-brain.onrender.com/simulation/policy?policy=green_energy&active=${newState}`);
      toast.info(newState ? "ENERGY_OPTIMIZATION_ENABLED" : "ENERGY_OPTIMIZATION_DISABLED", {
        icon: <Zap size={16} color="var(--neon-orange)" />,
        style: { background: 'var(--bg-glass)', border: '1px solid var(--neon-orange)', color: 'var(--text-primary)', fontFamily: 'Orbitron', fontSize: '0.7rem' }
      });
    } catch (err) {
      toast.error("SYSTEM_COMMAND_FAILURE: ACCESS_DENIED");
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 className="font-orbitron" style={{ fontSize: '0.9rem', color: 'var(--neon-cyan)' }}>COORDINATION_BRAIN</h3>
        <div style={{ background: 'rgba(0, 243, 255, 0.1)', padding: '5px 12px', borderRadius: '4px', border: '1px solid var(--neon-cyan)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--neon-cyan)' }}>SYNC: {syncLevel.toFixed(1)}%</span>
        </div>
      </div>

      <div className="brain-display" style={{ position: 'relative', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
           style={{ position: 'absolute', width: '120px', height: '120px', border: '2px dashed var(--neon-cyan)', borderRadius: '50%', opacity: 0.3 }}
        />
        <motion.div
           animate={{ rotate: -360 }}
           transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
           style={{ position: 'absolute', width: '90px', height: '90px', border: '1px solid var(--neon-purple)', borderRadius: '50%', opacity: 0.5 }}
        />
        <Cpu size={40} color="var(--neon-cyan)" style={{ filter: 'drop-shadow(0 0 10px var(--neon-cyan))' }} />
      </div>

      <div style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>ACTIVE_AGENT_NODES</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {agents.map(agent => (
            <div key={agent.name} style={{ background: 'rgba(0,0,0,0.1)', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>{agent.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                <span style={{ fontSize: '0.5rem', color: 'var(--neon-green)' }}>{agent.status}</span>
                <span style={{ fontSize: '0.5rem', color: 'var(--text-dim)' }}>{agent.load}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        className={`sync-btn ${isOptimized ? 'optimized' : ''}`}
        onClick={handleOptimize}
        style={{ 
          marginTop: '20px', 
          width: '100%', 
          padding: '10px', 
          background: isOptimized ? 'rgba(255, 165, 0, 0.1)' : 'transparent', 
          border: `1px solid ${isOptimized ? 'var(--neon-orange)' : 'var(--neon-cyan)'}`, 
          color: isOptimized ? 'var(--neon-orange)' : 'var(--neon-cyan)', 
          fontFamily: 'Orbitron', 
          fontSize: '0.65rem', 
          cursor: 'pointer' 
        }}
      >
        {isOptimized ? 'AUTO_OPTIMIZE_ENERGY: ACTIVE' : 'AUTO_OPTIMIZE_ENERGY'}
      </button>

      <style jsx="true">{`
        .sync-btn { transition: all 0.3s; }
        .sync-btn:hover { background: rgba(0, 243, 255, 0.1); box-shadow: 0 0 15px rgba(0, 243, 255, 0.2); }
        .sync-btn.optimized:hover { background: rgba(255, 165, 0, 0.15); box-shadow: 0 0 15px rgba(255, 165, 0, 0.2); }
      `}</style>
    </div>
  );
};

export default CoordinationBrain;
