import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, TrendingDown, TrendingUp, Cpu } from 'lucide-react';
import axios from 'axios';

const PolicyAgent = ({ theme = 'dark' }) => {
  const [policies, setPolicies] = useState({
    traffic_tax: false,
    pollution_limit: false,
    green_energy: true
  });
  const [loading, setLoading] = useState(false);

  const togglePolicy = async (policy, current) => {
    setLoading(true);
    const newState = !current;
    setPolicies(prev => ({ ...prev, [policy]: newState }));
    try {
      await axios.post(`https://ai-city-brain.onrender.com/simulation/policy?policy=${policy}&active=${newState}`);
    } catch (e) {
      setPolicies(prev => ({ ...prev, [policy]: current }));
    }
    setLoading(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <Scale size={20} color="var(--neon-purple)" />
        <h3 className="font-orbitron" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>NEURAL_POLICY_ENGINE</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="policy-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>TRAFFIC_TAX_OVERRIDE</span>
            <button 
              onClick={() => togglePolicy('traffic_tax', policies.traffic_tax)}
              className={`toggle-btn ${policies.traffic_tax ? 'on' : ''}`}
            >
              {policies.traffic_tax ? 'APPLIED' : 'REVOKED'}
            </button>
          </div>
          <div className="impact-box">
             <TrendingDown size={14} color="var(--neon-cyan)" />
             <span>Impact Prediction: Traffic -15%</span>
          </div>
        </div>

        <div className="policy-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>POLLUTION_QUOTA_CAP</span>
            <button 
              onClick={() => togglePolicy('pollution_limit', policies.pollution_limit)}
              className={`toggle-btn ${policies.pollution_limit ? 'on' : ''}`}
            >
              {policies.pollution_limit ? 'APPLIED' : 'REVOKED'}
            </button>
          </div>
          <div className="impact-box">
             <TrendingDown size={14} color="var(--neon-green)" />
             <span>Impact Prediction: AQI -10%</span>
          </div>
        </div>

        <div className="policy-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>GREEN_ENERGY_PRIORITY</span>
            <button 
              onClick={() => togglePolicy('green_energy', policies.green_energy)}
              className={`toggle-btn ${policies.green_energy ? 'on' : ''}`}
            >
              {policies.green_energy ? 'APPLIED' : 'REVOKED'}
            </button>
          </div>
          <div className="impact-box">
             <TrendingUp size={14} color="var(--neon-orange)" />
             <span>Impact Prediction: Efficiency +8%</span>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .policy-item {
          background: rgba(0,0,0,0.1);
          padding: 15px;
          border-radius: 8px;
          border: 1px solid var(--border-glass);
        }
        .toggle-btn {
          padding: 4px 12px;
          background: transparent;
          border: 1px solid var(--border-glass);
          color: var(--text-secondary);
          font-family: 'Orbitron';
          font-size: 0.6rem;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s;
        }
        .toggle-btn.on {
          border-color: var(--neon-purple);
          background: rgba(188, 0, 255, 0.1);
          color: var(--neon-purple);
        }
        .impact-box {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.65rem;
          color: var(--text-dim);
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
};

export default PolicyAgent;
