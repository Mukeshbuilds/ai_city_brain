import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Zap, AlertCircle, Info } from 'lucide-react';

const SimulationGrid = ({ fullScreen = false, theme = 'dark', isPlaying = true, setIsPlaying, scenarios = {} }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const requestRef = useRef();

  // Color Palette mapping
  const colors = {
    dark: {
        vehicle: '#00f3ff',
        pedestrian: '#bc00ff',
        incident: '#ff003c',
        grid: 'rgba(0, 243, 255, 0.05)',
        glow: 8
    },
    light: {
        vehicle: '#2563EB',
        pedestrian: '#7c3aed',
        incident: '#DC2626',
        grid: 'rgba(0, 0, 0, 0.15)',
        glow: 0
    }
  };

  const currentColors = colors[theme] || colors.dark;
  const colorsRef = useRef(currentColors);

  useEffect(() => {
    colorsRef.current = currentColors;
  }, [theme]);

  // Unified status for UI components
  const [stats, setStats] = useState({ vehicles: 0, pedestrians: 0, incidents: 0 });

  const initParticles = (width, height) => {
    const p = [];
    const isMobile = window.innerWidth < 768;
    let baseCount = fullScreen ? (isMobile ? 60 : 120) : (isMobile ? 30 : 60);
    
    // Scale count based on scenarios
    if (scenarios.traffic_peak) baseCount *= isMobile ? 1.5 : 2.5;
    if (scenarios.night_mode) baseCount *= 0.4;
    baseCount = Math.floor(baseCount);

    for (let i = 0; i < baseCount; i++) {
        const typeRoll = Math.random();
        let type = 'vehicle';
        if (scenarios.emergency_mode) {
            type = typeRoll > 0.7 ? 'incident' : typeRoll > 0.4 ? 'pedestrian' : 'vehicle';
        } else {
            type = typeRoll > 0.95 ? 'incident' : typeRoll > 0.7 ? 'pedestrian' : 'vehicle';
        }

      p.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (scenarios.emergency_mode ? 3 : 1.5),
        vy: (Math.random() - 0.5) * (scenarios.emergency_mode ? 3 : 1.5),
        type,
        size: Math.random() * 2 + 2 
      });
    }
    particlesRef.current = p;
    setStats({
        vehicles: p.filter(x => x.type === 'vehicle').length,
        pedestrians: p.filter(x => x.type === 'pedestrian').length,
        incidents: p.filter(x => x.type === 'incident').length
    });
  };

  const animate = () => {
    if (!canvasRef.current || !isPlaying) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const colors = colorsRef.current;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw fine grid
    ctx.strokeStyle = scenarios.emergency_mode ? 'rgba(255, 0, 0, 0.1)' : colors.grid;
    ctx.lineWidth = 1; 
    const spacing = 50;
    for(let x=0; x<canvas.width; x+=spacing) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for(let y=0; y<canvas.height; y+=spacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Update Particles
    particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        ctx.fillStyle = colors[p.type];
        if (theme === 'dark') {
            ctx.shadowBlur = colors.glow * (p.type === 'incident' ? 1.5 : 1);
            ctx.shadowColor = colors[p.type];
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const updateSize = () => {
        const canvas = canvasRef.current;
        if (canvas && canvas.parentElement) {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight || 400;
            initParticles(canvas.width, canvas.height);
        }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [fullScreen, theme, scenarios]); // Re-init when scenarios change

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);

  return (
    <div className={`simulation-container ${fullScreen ? 'full-screen' : ''} glass-panel`}>
      <div className="sim-header">
        <div className="flex-center" style={{ gap: '10px' }}>
            <Zap size={14} color="var(--neon-cyan)" />
            <span className="font-orbitron" style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>LIVE VECTOR_MAPPING_ENGINE</span>
        </div>
        <div className="sim-controls">
          <button onClick={() => setIsPlaying(!isPlaying)} className={!isPlaying ? 'paused' : ''}>
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button onClick={() => initParticles(canvasRef.current.width, canvasRef.current.height)}>
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="sim-canvas" />

      <div className="sim-overlay-stats">
          <div className="stat-pill"><div className="dot v"></div> VEH: {stats.vehicles}</div>
          <div className="stat-pill"><div className="dot p"></div> PED: {stats.pedestrians}</div>
          <div className="stat-pill pulse"><div className="dot i"></div> INC: {stats.incidents}</div>
      </div>

      <style jsx="true">{`
        .simulation-container {
          position: relative;
          background: var(--bg-glass);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 400px;
          border: 1px solid var(--border-glass);
          transition: var(--transition-smooth);
        }
        .sim-header {
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-glass);
          background: rgba(0,0,0,0.05);
          z-index: 5;
        }
        .sim-controls {
          display: flex;
          gap: 10px;
        }
        .sim-controls button {
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid var(--border-glass);
          color: var(--text-primary);
          width: 32px;
          height: 32px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .sim-controls button:hover {
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
        }
        .sim-controls button.paused {
            color: var(--neon-cyan);
            border-color: var(--neon-cyan);
        }
        .sim-canvas {
          width: 100%;
          height: 100%;
          flex: 1;
        }
        .sim-overlay-stats {
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 10;
        }
        .stat-pill {
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          padding: 4px 12px;
          font-size: 0.7rem;
          font-family: 'Orbitron', sans-serif;
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 3px;
          color: var(--text-primary);
          box-shadow: var(--panel-shadow);
        }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.v { background: ${currentColors.vehicle}; border: 1px solid rgba(0,0,0,0.1); }
        .dot.p { background: ${currentColors.pedestrian}; border: 1px solid rgba(0,0,0,0.1); }
        .dot.i { background: ${currentColors.incident}; border: 1px solid rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
};

export default SimulationGrid;
