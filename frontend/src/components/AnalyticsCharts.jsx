import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AnalyticsCharts = ({ theme = 'dark', history = [] }) => {
  const colors = {
    dark: {
        traffic: '#00f3ff',
        aqi: '#00ff9d',
        energy: '#ff8c00',
        grid: 'rgba(255, 255, 255, 0.1)',
        text: 'rgba(255, 255, 255, 0.5)'
    },
    light: {
        traffic: '#2563EB',
        aqi: '#16A34A',
        energy: '#F59E0B',
        grid: 'rgba(0, 0, 0, 0.2)',
        text: '#6B7280'
    }
  };

  const activeColors = colors[theme] || colors.dark;

  const CustomTooltip = ({ active, payload, label, color }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip glass-panel" style={{ padding: '10px', borderColor: color, background: 'var(--bg-glass)', backdropFilter: 'var(--glass-blur)' }}>
          <p className="label font-orbitron" style={{ fontSize: '0.6rem', color }}>DATA_NODE: {payload[0].value.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };

  if (!history || history.length === 0) return <div className="chart-loading glass-panel flex-center" style={{ height: '300px' }}>SYNCHRONIZING_HISTORY...</div>;

  return (
    <div className="analytics-dashboard">
      <div className="chart-card glass-panel" style={{ height: '280px' }}>
        <h4 className="chart-title font-orbitron" style={{ color: activeColors.traffic }}>ULTRA_TRAFFIC_FEED</h4>
        <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
                <defs>
                <linearGradient id="colorTrafficVivid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeColors.traffic} stopOpacity={0.6}/>
                    <stop offset="95%" stopColor={activeColors.traffic} stopOpacity={0}/>
                </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={activeColors.grid} vertical={false} />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke={activeColors.text} fontSize={10} domain={[0, 100]} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip color={activeColors.traffic} />} />
                <Area 
                    type="monotone" 
                    dataKey="traffic" 
                    stroke={activeColors.traffic} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTrafficVivid)" 
                    isAnimationActive={false} 
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card glass-panel" style={{ height: '280px' }}>
        <h4 className="chart-title font-orbitron" style={{ color: activeColors.aqi }}>PLASMA_AQI_MONITOR</h4>
        <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke={activeColors.grid} vertical={false} />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke={activeColors.text} fontSize={10} domain={[0, 200]} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip color={activeColors.aqi} />} />
                <Line 
                    type="stepAfter" 
                    dataKey="aqi" 
                    stroke={activeColors.aqi} 
                    dot={{ fill: activeColors.aqi, r: 3 }}
                    strokeWidth={4} 
                    isAnimationActive={false} 
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card glass-panel" style={{ height: '280px' }}>
        <h4 className="chart-title font-orbitron" style={{ color: activeColors.energy }}>ATOMIC_ENERGY_LOAD</h4>
        <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke={activeColors.grid} vertical={false} />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke={activeColors.text} fontSize={10} domain={[0, 100]} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip color={activeColors.energy} />} />
                <Line 
                    type="monotone" 
                    dataKey="energy" 
                    stroke={activeColors.energy} 
                    strokeWidth={4} 
                    dot={false}
                    isAnimationActive={false} 
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </div>

      <style jsx="true">{`
        .analytics-dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
        .chart-card { padding: 25px; border-top: 4px solid transparent; }
        .chart-card:nth-child(1) { border-top-color: var(--neon-cyan); }
        .chart-card:nth-child(2) { border-top-color: var(--neon-green); }
        .chart-card:nth-child(3) { border-top-color: var(--neon-orange); }
        .chart-title { font-size: 0.7rem; margin-bottom: 30px; letter-spacing: 3px; }
        .chart-loading { padding: 50px; text-align: center; color: var(--neon-cyan); font-family: 'Orbitron'; }
      `}</style>
    </div>
  );
};

export default AnalyticsCharts;
