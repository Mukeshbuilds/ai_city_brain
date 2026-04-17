import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Shield, Zap, Activity, Info, ChevronRight, Terminal, Network, Globe } from 'lucide-react';

const AboutSystem = ({ theme }) => {
  const [selectedAgent, setSelectedAgent] = useState(null);

  const agents = [
    {
      id: 'core',
      name: 'NEURAL_CORE_OS',
      icon: <Cpu size={32} />,
      color: 'var(--neon-cyan)',
      description: 'The central orchestration layer managing all sub-agent communication and data synchronization.',
      specs: ['Latency: < 0.2ms', 'Nodes: 4,096', 'Uptime: 99.999%']
    },
    {
      id: 'traffic',
      name: 'TRAFFIC_OPTIMIZER',
      icon: <Network size={32} />,
      color: 'var(--neon-purple)',
      description: 'Uses real-time neural load balancing to predict congestion and adjust metropolitan transit vectors.',
      specs: ['Response: Adaptive', 'Accuracy: 94.2%', 'Mode: ML-Predictive']
    },
    {
      id: 'energy',
      name: 'GRID_STABILIZER',
      icon: <Zap size={32} />,
      color: 'var(--neon-orange)',
      description: 'Synchronizes renewable energy integration with city consumption peaks to maintain grid equilibrium.',
      specs: ['Capacity: 12.4 GW', 'Reserve: Active', 'Sync: Real-time']
    },
    {
      id: 'health',
      name: 'HEALTH_GUARDIAN',
      icon: <Activity size={32} />,
      color: 'var(--neon-green)',
      description: 'Monitors atmospheric toxicity and biometric risk levels, deploying localized air purification cycles.',
      specs: ['Detection: Micron-lvl', 'Safety: Grade-A', 'Alerts: Priority']
    },
    {
      id: 'emergency',
      name: 'CRISIS_RESPONSE',
      icon: <Shield size={32} />,
      color: 'var(--neon-red)',
      description: 'Automated orchestration of emergency response units and medical drones across the urban matrix.',
      specs: ['Dispatch: Autonomous', 'Pathing: Optimized', 'Radius: City-wide']
    }
  ];

  return (
    <div className="about-container" style={{ padding: '20px', height: '100%', overflowY: 'auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 className="font-orbitron" style={{ color: 'var(--neon-cyan)', fontSize: '1.8rem', letterSpacing: '4px' }}>SYSTEM_ARCHITECTURE_v2.0</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '10px' }}>Exploring the neural layers of the AI City Brain Network.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
        {/* Agent List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {agents.map((agent) => (
            <motion.div
              key={agent.id}
              whileHover={{ x: 10, background: 'rgba(255,255,255,0.05)' }}
              onClick={() => setSelectedAgent(agent)}
              className={`agent-selector glass-panel ${selectedAgent?.id === agent.id ? 'active' : ''}`}
              style={{ 
                padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '20px',
                borderLeft: selectedAgent?.id === agent.id ? `4px solid ${agent.color}` : '4px solid transparent'
              }}
            >
              <div style={{ color: agent.color }}>{agent.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="font-orbitron" style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{agent.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '4px' }}>STATUS: NOMINAL</div>
              </div>
              <ChevronRight size={16} color="var(--text-dim)" />
            </motion.div>
          ))}
        </div>

        {/* Detailed View */}
        <div className="details-view">
          <AnimatePresence mode="wait">
            {selectedAgent ? (
              <motion.div
                key={selectedAgent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-panel"
                style={{ padding: '40px', height: '100%', position: 'relative', overflow: 'hidden' }}
              >
                <div className="bg-glow" style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: `radial-gradient(circle, ${selectedAgent.color}11 0%, transparent 70%)`, pointerEvents: 'none' }} />
                
                <div style={{ color: selectedAgent.color, marginBottom: '20px' }}>{selectedAgent.icon}</div>
                <h2 className="font-orbitron" style={{ color: selectedAgent.color, fontSize: '1.4rem', marginBottom: '20px' }}>{selectedAgent.name}</h2>
                <p style={{ color: 'var(--text-primary)', lineHeight: '1.6', fontSize: '1rem', labelSpacing: '1px', marginBottom: '30px' }}>
                  {selectedAgent.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  {selectedAgent.specs.map((spec, i) => (
                    <div key={i} style={{ padding: '15px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--border-glass)', borderRadius: '4px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{spec}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '40px', padding: '20px', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Network size={20} color="var(--text-dim)" />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '2px' }}>INTEGRATED_NEURAL_LINK: ESTABLISHED</span>
                </div>
              </motion.div>
            ) : (
              <div className="flex-center glass-panel" style={{ height: '100%', padding: '40px', flexDirection: 'column', textAlign: 'center' }}>
                <Globe size={64} color="var(--text-dim)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                <h3 className="font-orbitron" style={{ color: 'var(--text-secondary)' }}>SELECT_AN_AGENT_FOR_INSPECTION</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '10px' }}>System diagnostic buffer ready for analysis.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx="true">{`
        .agent-selector {
           transition: var(--transition-smooth);
        }
        .agent-selector.active {
           background: rgba(255, 255, 255, 0.08);
           box-shadow: 0 0 20px rgba(0,0,0,0.2);
        }
        .about-container::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
};

export default AboutSystem;
