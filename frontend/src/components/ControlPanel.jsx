import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Volume2, VolumeX, Moon, Sun, Cpu, FastForward } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ControlPanel = ({ theme, setTheme }) => {
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await axios.get('https://ai-city-brain.onrender.com/api/system/config');
      setConfig(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateConfig = async (newConfig) => {
    setSaving(true);
    try {
      await axios.post('https://ai-city-brain.onrender.com/api/system/config', newConfig);
      setConfig(newConfig);
      toast.success("SYSTEM_CONFIG_UPDATED: SYNCING_NODES");
    } catch (err) {
      toast.error("CONFIG_SYNC_FAILURE");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAgent = (name) => {
    const newConfig = { ...config, agents: { ...config.agents, [name]: !config.agents[name] } };
    updateConfig(newConfig);
  };

  if (!config) return <div className="flex-center" style={{height: '300px'}}>FETCHING_SYSTEM_REGISTRY...</div>;

  return (
    <div className="control-panel" style={{ padding: '20px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h2 className="font-orbitron" style={{ color: 'var(--neon-orange)', fontSize: '1.2rem' }}>SYSTEM_CORE_CONFIGURATION</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '5px' }}>Override global simulation parameters and neural engine settings.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
        <div className="glass-panel" style={{ padding: '30px' }}>
           <h3 className="font-orbitron" style={{ fontSize: '0.9rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FastForward size={18} color="var(--neon-cyan)"/> SIMULATION_PARAMETERS
           </h3>
           
           <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                 <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>SIMULATION_SPEED_MULTIPLIER</span>
                 <span style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem' }}>{config.simulation_speed}x</span>
              </div>
              <input 
                 type="range" min="1" max="5" 
                 value={config.simulation_speed} 
                 onChange={(e) => updateConfig({...config, simulation_speed: parseInt(e.target.value)})}
                 style={{ width: '100%', accentColor: 'var(--neon-cyan)', cursor: 'pointer' }} 
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.6rem', color: 'var(--text-dim)' }}>
                 <span>NORMAL (1x)</span>
                 <span>WARP (5x)</span>
              </div>
           </div>

           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 {config.sound ? <Volume2 color="var(--neon-cyan)"/> : <VolumeX color="var(--neon-red)"/>}
                 <span style={{ fontSize: '0.8rem' }}>HAPTIC_SOUND_FEEDBACK</span>
              </div>
              <button 
                onClick={() => updateConfig({...config, sound: !config.sound})}
                className={`action-btn ${config.sound ? 'on' : ''}`}
              >
                 {config.sound ? 'ENABLED' : 'MUTED'}
              </button>
           </div>
        </div>

        <div className="glass-panel" style={{ padding: '30px' }}>
           <h3 className="font-orbitron" style={{ fontSize: '0.9rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={18} color="var(--neon-purple)"/> ACTIVE_AGENT_SUBSCRIPTION
           </h3>

           {Object.keys(config.agents).map(agent => (
             <div key={agent} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
               <span style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{agent.replace('_', ' ')} Vector Engine</span>
               <button 
                 onClick={() => handleToggleAgent(agent)}
                 className={`action-btn ${config.agents[agent] ? 'on' : ''}`}
                 style={{ padding: '5px 15px', fontSize: '0.65rem' }}
               >
                 {config.agents[agent] ? 'ACTIVE' : 'OFFLINE'}
               </button>
             </div>
           ))}
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '40px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
             {theme === 'dark' ? <Moon color="var(--neon-cyan)"/> : <Sun color="var(--neon-orange)"/>}
             <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>VISUAL_INTERFACE_THEME</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Current Mode: {theme.toUpperCase()}</div>
             </div>
          </div>
          <button 
            onClick={() => {
                const newTheme = theme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
                updateConfig({...config, theme: newTheme});
            }}
            className="action-btn on"
          >
             SWITCH_TO_{theme === 'dark' ? 'LIGHT' : 'DARK'}_MODE
          </button>
      </div>
    </div>
  );
};

export default ControlPanel;
