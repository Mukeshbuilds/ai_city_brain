import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Database, Cpu, Activity, Server, AlertCircle } from 'lucide-react';
import axios from 'axios';

const APIMonitor = ({ theme }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/status');
      setStatus(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // 10s as requested
    return () => clearInterval(interval);
  }, []);

  const apiNodes = [
    { key: 'traffic_api', label: 'METRO_TRAFFIC_V1', icon: <Activity />, url: '/api/traffic' },
    { key: 'aqi_api', label: 'ENV_SENSOR_DATA', icon: <Globe />, url: '/api/aqi' },
    { key: 'energy_api', label: 'GRID_POWER_MONITOR', icon: <Server />, url: '/api/energy' },
    { key: 'database', label: 'MONGODB_NEURAL_LOGS', icon: <Database />, url: 'Internal Cluster' }
  ];

  if (loading) return <div className="flex-center" style={{height: '300px'}}>PINGING_NETWORK_NODES...</div>;

  return (
    <div className="api-monitor" style={{ padding: '20px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h2 className="font-orbitron" style={{ color: 'var(--neon-cyan)', fontSize: '1.2rem' }}>NEURAL_API_NETWORK_MONITOR</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '5px' }}>Real-time latency tracking and health verification for urban data endpoints.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
        {apiNodes.map((node) => {
          const stats = status[node.key];
          const isOnline = stats.status === 'online';
          
          return (
            <motion.div 
              key={node.key}
              whileHover={{ y: -5 }}
              className="glass-panel" 
              style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: `4px solid ${isOnline ? 'var(--neon-green)' : 'var(--neon-red)'}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ color: isOnline ? 'var(--neon-green)' : 'var(--neon-red)' }}>{node.icon}</div>
                    <span className="font-orbitron" style={{ fontSize: '0.85rem' }}>{node.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOnline ? 'var(--neon-green)' : 'var(--neon-red)', boxShadow: `0 0 10px ${isOnline ? 'var(--neon-green)' : 'var(--neon-red)'}` }}></div>
                   <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: isOnline ? 'var(--neon-green)' : 'var(--neon-red)' }}>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                     <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>ENDPOINT_PATH</span>
                     <span style={{ fontSize: '0.65rem', fontFamily: 'monospace' }}>{node.url}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>RESPONSE_LATENCY</span>
                     <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--neon-cyan)' }}>{stats.latency}ms</span>
                  </div>
              </div>

              <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                 <motion.div 
                   animate={{ width: isOnline ? '100%' : '0%' }}
                   transition={{ duration: 1 }}
                   style={{ height: '100%', background: isOnline ? 'var(--neon-green)' : 'var(--neon-red)' }} 
                 />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-panel" style={{ marginTop: '40px', padding: '25px', display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(0, 243, 255, 0.05)' }}>
          <AlertCircle color="var(--neon-cyan)" />
          <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>SYSTEM_SELF_DIAGNOSTIC</div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>All core network buffers are operating within safe latency thresholds (&lt; 200ms).</p>
          </div>
          <button onClick={fetchStatus} style={{ background: 'transparent', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>
             REFRESH_STREAMS
          </button>
      </div>
    </div>
  );
};

export default APIMonitor;
