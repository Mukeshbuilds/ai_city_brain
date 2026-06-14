import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Zap, Wind, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AnalyticsModule = ({ theme }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/analytics`);
      setData(res.data.slice(-10)); // Last 10 points as requested
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const calculateSMA = (key) => {
    if (data.length < 3) return 0;
    const last3 = data.slice(-3).map(d => d[key]);
    const avg = last3.reduce((a, b) => a + b, 0) / 3;
    const diff = ((data[data.length-1][key] - avg) / avg) * 100;
    return diff.toFixed(1);
  };

  const metrics = [
    { label: 'Traffic', key: 'traffic', icon: <Activity />, color: 'var(--neon-cyan)' },
    { label: 'Air Quality', key: 'aqi', icon: <Wind />, color: 'var(--neon-green)' },
    { label: 'Energy Load', key: 'energy', icon: <Zap />, color: 'var(--neon-orange)' }
  ];

  if (loading) return <div className="flex-center" style={{height: '400px'}}>INITIALIZING_ANALYTICS_BUFFER...</div>;

  return (
    <div className="analytics-module" style={{ padding: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {metrics.map(m => {
          const prediction = calculateSMA(m.key);
          const isUp = prediction > 0;
          return (
            <motion.div key={m.label} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ color: m.color }}>{m.icon}</div>
                <span className="font-orbitron" style={{ fontSize: '0.8rem', opacity: 0.7 }}>{m.label.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px' }}>
                {data[data.length-1]?.[m.key]?.toFixed(1)}%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isUp ? 'var(--neon-red)' : 'var(--neon-green)', fontSize: '0.8rem' }}>
                {isUp ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                <span>PREDICTED: {isUp ? '+' : ''}{prediction}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        <div className="glass-panel" style={{ padding: '30px', height: '400px' }}>
            <h3 className="font-orbitron" style={{ marginBottom: '30px', fontSize: '0.9rem', color: 'var(--neon-cyan)' }}>REAL_TIME_NEURAL_SENSORS (LAST 10 CYCLES)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--neon-cyan)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--neon-cyan)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(t) => new Date(t).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})} 
                        stroke="var(--text-dim)"
                        fontSize={10}
                    />
                    <YAxis stroke="var(--text-dim)" fontSize={10} domain={[0, 100]} />
                    <Tooltip 
                        contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '0.8rem' }}
                    />
                    <Area type="monotone" dataKey="traffic" stroke="var(--neon-cyan)" fillOpacity={1} fill="url(#colorTraffic)" strokeWidth={2} />
                    <Area type="monotone" dataKey="energy" stroke="var(--neon-orange)" fill="transparent" strokeWidth={2} />
                    <Area type="monotone" dataKey="aqi" stroke="var(--neon-green)" fill="transparent" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModule;
