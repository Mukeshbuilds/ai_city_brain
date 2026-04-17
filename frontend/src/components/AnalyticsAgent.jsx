import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Zap, Smartphone, Lightbulb, Activity } from 'lucide-react';

const AnalyticsAgent = ({ data, history = [], theme = 'dark' }) => {
  const latestTraffic = data?.traffic || 0;
  const latestAQI = data?.aqi || 0;
  
  // Simulated prediction logic
  const trafficTrend = latestTraffic > 60 ? 'UPWARD' : 'STABLE';
  const aqiTrend = latestAQI > 100 ? 'DETERIORATING' : 'OPTIMAL';

  const insights = [
    { type: 'traffic', msg: `Surge predicted in Sector-9. Expected increase: 12% over next 15 mins.` },
    { type: 'energy', msg: `Renewable integration at 84%. Power reserves sufficient for 72 hours.` },
    { type: 'aqi', msg: `Micro-particulate levels dropping due to neural filtration cycle.` }
  ];

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <BarChart2 size={20} color="var(--neon-cyan)" />
        <h3 className="font-orbitron" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>DATA_ANALYTICS_AGENT</h3>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
         <div className="mini-stat">
            <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>TRAFFIC_VECTOR</span>
            <div style={{ fontSize: '0.9rem', color: 'var(--neon-cyan)', fontWeight: 'bold' }}>{trafficTrend}</div>
         </div>
         <div className="mini-stat">
            <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>ATMOS_TREND</span>
            <div style={{ fontSize: '0.9rem', color: 'var(--neon-green)', fontWeight: 'bold' }}>{aqiTrend}</div>
         </div>
      </div>

      <div className="ai-insights">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
            <Lightbulb size={14} color="var(--neon-orange)" />
            <span className="font-orbitron" style={{ fontSize: '0.65rem', color: 'var(--neon-orange)' }}>GEN_AI_INSIGHTS:</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {insights.map((insight, idx) => (
                <motion.div 
                   key={idx}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.2 }}
                   className="insight-card"
                >
                   <div className="insight-icon">
                      {insight.type === 'traffic' && <Smartphone size={10} />}
                      {insight.type === 'energy' && <Zap size={10} />}
                      {insight.type === 'aqi' && <Activity size={10} />}
                   </div>
                   <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginLeft: '10px' }}>{insight.msg}</p>
                </motion.div>
            ))}
          </div>
      </div>

      <style jsx="true">{`
        .mini-stat {
          flex: 1;
          padding: 10px;
          background: rgba(0,0,0,0.15);
          border: 1px solid var(--border-glass);
          border-radius: 4px;
        }
        .insight-card {
           display: flex;
           align-items: center;
           padding: 10px;
           background: rgba(0, 243, 255, 0.03);
           border-left: 2px solid var(--neon-cyan);
           border-radius: 0 4px 4px 0;
        }
        .insight-icon {
           width: 18px;
           height: 18px;
           background: rgba(0, 243, 255, 0.1);
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           color: var(--neon-cyan);
        }
      `}</style>
    </div>
  );
};

export default AnalyticsAgent;
