import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, AlertTriangle } from 'lucide-react';

const HealthAgent = ({ data, theme = 'dark' }) => {
  const aqi = data?.aqi || 42;
  const risk = data?.health_risk || 'Low';
  
  const getRiskColor = (r) => {
    if (r === 'High') return 'var(--neon-red)';
    if (r === 'Medium') return 'var(--neon-orange)';
    return 'var(--neon-green)';
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <Activity size={20} color={getRiskColor(risk)} />
        <h3 className="font-orbitron" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>HEALTH_MONITOR_AGENT</h3>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
        <motion.div
           animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
           transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart size={50} color={getRiskColor(risk)} style={{ filter: `drop-shadow(0 0 10px ${getRiskColor(risk)})` }} />
        </motion.div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>BIOMETRIC_RISK_INDEX</span>
            <span className="font-orbitron" style={{ fontSize: '0.7rem', color: getRiskColor(risk) }}>{risk}</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
            <motion.div 
              animate={{ width: risk === 'High' ? '90%' : risk === 'Medium' ? '50%' : '15%' }}
              style={{ height: '100%', background: getRiskColor(risk), borderRadius: '2px', boxShadow: `0 0 8px ${getRiskColor(risk)}` }} 
            />
        </div>
      </div>

      <div className="precaution-box" style={{ marginTop: '25px', padding: '15px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <AlertTriangle size={14} color={getRiskColor(risk)} />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>PRECAUTIONARY_MEASURES:</span>
          </div>
          <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            {risk === 'High' && "CRITICAL: Activating high-efficiency air scrubbers. Masking protocols recommended in Zone-3."}
            {risk === 'Medium' && "MODERATE: Monitoring particulate matter surge. Sensitive groups should minimize outdoor exposure."}
            {risk === 'Low' && "OPTIMAL: Atmospheric toxicity levels below threshold. High-altitude ventilation active."}
          </p>
      </div>

      {/* Pulsing Grid Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.05, zIndex: -1 }}>
         <svg width="100%" height="100%">
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
         </svg>
      </div>
    </div>
  );
};

export default HealthAgent;
