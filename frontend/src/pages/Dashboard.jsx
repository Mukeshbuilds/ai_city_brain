import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { WifiOff, Zap } from 'lucide-react';
import useSound from 'use-sound';

import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import MetricCard from '../components/MetricCard';
import SimulationGrid from '../components/SimulationGrid';
import AgentsPanel from '../components/AgentsPanel';
import KnowledgeGraph from '../components/KnowledgeGraph';
import DecisionEngine from '../components/DecisionEngine';
import CityMap from '../components/CityMap';
import AnalyticsCharts from '../components/AnalyticsCharts';
import AlertSystem from '../components/AlertSystem';
import VoiceAI from '../components/VoiceAI';
import NotificationHistory from '../components/NotificationHistory';
import AboutSystem from '../components/AboutSystem';

// New Agents
import CoordinationBrain from '../components/CoordinationBrain';
import HealthAgent from '../components/HealthAgent';
import AnalyticsAgent from '../components/AnalyticsAgent';
import PolicyAgent from '../components/PolicyAgent';

// Functional Modules
import AnalyticsModule from '../components/AnalyticsModule';
import ReportsModule from '../components/ReportsModule';
import ControlPanel from '../components/ControlPanel';
import APIMonitor from '../components/APIMonitor';

const API_BASE_URL = 'https://ai-city-brain.onrender.com';
const CLICK_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [playClick] = useSound(CLICK_SOUND, { volume: 0.8 });
  const [playAlert] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.5 });

  const [scenarios, setScenarios] = useState({
    traffic_peak: false,
    emergency_mode: false,
    night_mode: false
  });
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const scenarioLockRef = useRef(false);
  
  // Theme Controller
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
    localStorage.setItem('theme', theme);

    window.toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };
  }, [theme]);

  const [history, setHistory] = useState([]);
  
  const fetchData = async () => {
    try {
      const [dashRes, agentsRes, analyticsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/dashboard`),
        axios.get(`${API_BASE_URL}/agents`),
        axios.get(`${API_BASE_URL}/analytics`)
      ]);
      setData(dashRes.data);
      setAgents(agentsRes.data);
      setHistory(analyticsRes.data.filter(d => d.traffic !== undefined));
      if(dashRes.data.scenarios && !scenarioLockRef.current) {
        setScenarios(dashRes.data.scenarios);
      }
      setError(null);
      setLoading(false);
    } catch (err) {
      if (!data) {
        setError("SYSTEM_LINK_FAILURE: NEURAL_API_UNREACHABLE");
        setLoading(false);
      }
    }
  };

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSystemCommand = useCallback((type) => {
    switch(type) {
        case 'NAV_OVERVIEW': setActiveTab('overview'); break;
        case 'NAV_SECURITY': setActiveTab('security'); break;
        case 'NAV_HEALTH': setActiveTab('performance'); break;
        case 'TOGGLE_NIGHT': toggleScenario('night_mode'); break;
        case 'TOGGLE_EMERGENCY': toggleScenario('emergency_mode'); break;
        case 'TOGGLE_PEAK': toggleScenario('traffic_peak'); break;
        case 'ENABLE_LIGHT': if(window.toggleTheme) window.toggleTheme('light'); break;
        case 'ENABLE_DARK': if(window.toggleTheme) window.toggleTheme('dark'); break;
        case 'START_SIM': setIsSimulationRunning(true); break;
        case 'PAUSE_SIM': setIsSimulationRunning(false); break;
        default: break;
    }
  }, [scenarios]);

  const toggleScenario = async (mode) => {
    scenarioLockRef.current = true;
    const newState = !scenarios[mode];
    
    // Snappy UI update
    setScenarios(prev => ({ ...prev, [mode]: newState }));
    
    try {
        const res = await axios.post(`${API_BASE_URL}/simulation/control?mode=${mode}&active=${newState}`);
        if(res.data && res.data.state) {
            setScenarios(res.data.state);
        }
        setTimeout(() => { scenarioLockRef.current = false; }, 3000);
    } catch (err) {
        setScenarios(prev => ({ ...prev, [mode]: !newState }));
        scenarioLockRef.current = false;
        toast.error("SYSTEM_SYNC_ERROR: UNABLE_TO_OVERRIDE_NODES");
    }
  };

  const addNotification = useCallback((notif) => {
    setNotifications(prev => [notif, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000); 
    const handleGlobalClick = () => { try{playClick();}catch(e){} };
    window.addEventListener('click', handleGlobalClick);
    return () => {
        clearInterval(interval);
        window.removeEventListener('click', handleGlobalClick);
    };
  }, [playClick]);

  if (loading && !data && !error) return (
    <div className="flex-center" style={{ height: '100vh', width: '100vw', background: 'var(--bg-dark)', flexDirection: 'column', gap: '20px' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        style={{ width: '50px', height: '50px', border: '2px solid var(--neon-cyan)', borderTopColor: 'transparent', borderRadius: '50%' }}
      />
      <div className="neon-text-cyan font-orbitron pulse" style={{ fontSize: '1.2rem' }}>INITIALIZING_NEURAL_MATRIX...</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.6rem' }}>SYNCHRONIZING URBAN CORE NODES</div>
    </div>
  );

  if (error) return (
    <div className="flex-center" style={{ height: '100vh', width: '100vw', background: 'var(--bg-dark)', flexDirection: 'column', gap: '20px' }}>
      <WifiOff size={48} color="var(--neon-red)" />
      <div className="font-orbitron pulse" style={{ color: 'var(--neon-red)', fontSize: '1.2rem', textAlign: 'center' }}>
        {error}
      </div>
      <button onClick={() => window.location.reload()} className="action-btn on" style={{ marginTop: '20px' }}>RETRY_CONNECTION</button>
    </div>
  );

  return (
    <div className={`dashboard-container ${scenarios.night_mode ? 'night-theme' : ''}`}>
      <AlertSystem 
        data={data} 
        onAlert={playAlert} 
        onNewNotification={addNotification}
        theme={theme} 
      />
      
      <NotificationHistory 
        notifications={notifications} 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
        theme={theme} 
      />

      {isMobileSidebarOpen && <div className="dashboard-overlay" onClick={() => setIsMobileSidebarOpen(false)} />}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isMobileSidebarOpen} setIsOpen={setIsMobileSidebarOpen} />
      
      <main className="main-content">
        <TopBar 
          theme={theme} 
          onToggleNotifications={() => setShowNotifications(true)}
          notificationCount={notifications.length}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />
        
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="dashboard-content">
              <div className="dashboard-grid">
                <MetricCard title="Traffic Flow" value={data?.traffic} unit="%" trend="up" color="var(--neon-cyan)" />
                <MetricCard title="Air Quality" value={data?.aqi} unit=" AQI" trend="down" color="var(--neon-green)" />
                <MetricCard title="Energy Load" value={data?.energy} unit=" GW" trend="stable" color="var(--neon-orange)" />
                <MetricCard title="Satisfaction" value={data?.satisfaction} unit="%" trend="up" color="var(--neon-purple)" />
              </div>

              <div className="main-grid-layout">
                <div className="left-column">
                  <div style={{ height: '350px', marginBottom: '20px' }}>
                    <SimulationGrid 
                      theme={theme} 
                      isPlaying={isSimulationRunning} 
                      setIsPlaying={setIsSimulationRunning} 
                      scenarios={scenarios}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                     <HealthAgent data={data} theme={theme} />
                     <AnalyticsAgent data={data} history={history} theme={theme} />
                  </div>
                  <DecisionEngine decisions={data?.decisions || []} theme={theme} />
                </div>
                <div className="right-column">
                  <CoordinationBrain data={data} theme={theme} />
                  <div style={{ marginTop: '20px' }}>
                    <AgentsPanel agents={agents} theme={theme} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'intelligence' && (
            <motion.div key="intelligence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-content">
               <div style={{ display: 'grid', gridTemplateColumns: 'minmax(600px, 2fr) 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ height: '450px' }}>
                      <SimulationGrid theme={theme} isPlaying={isSimulationRunning} setIsPlaying={setIsSimulationRunning} scenarios={scenarios} />
                    </div>
                    <KnowledgeGraph height={350} theme={theme} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <PolicyAgent theme={theme} />
                    <DecisionEngine decisions={data?.decisions || []} theme={theme} />
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'simulation' && (
             <motion.div key="simulation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-content" style={{ height: '80vh' }}>
                <CityMap theme={theme} />
            </motion.div>
          )}

          {activeTab === 'performance' && (
             <motion.div key="health" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-content">
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 400px', gap: '20px' }}>
                    <HealthAgent data={data} theme={theme} />
                    <CoordinationBrain agents={agents} theme={theme} />
                </div>
             </motion.div>
          )}

          {activeTab === 'security' && (
             <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-content">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '20px' }}>
                   <div className="glass-panel" style={{ padding: '40px' }}>
                      <h2 className="font-orbitron" style={{ color: 'var(--neon-red)', marginBottom: '20px' }}>NEURAL_SECURITY_LAYER</h2>
                      <p style={{ color: 'var(--text-secondary)' }}>Monitoring autonomous patrol vectors and emergency response deployments.</p>
                      <div style={{ marginTop: '40px', height: '300px', border: '1px dashed var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                         LIVE_SECURITY_FEED_ACTIVE
                      </div>
                   </div>
                   <CoordinationBrain agents={agents} theme={theme} />
                </div>
             </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-content">
               <AnalyticsModule theme={theme} />
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-content">
               <ReportsModule theme={theme} />
            </motion.div>
          )}

          {activeTab === 'monitor' && (
            <motion.div key="monitor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-content">
               <APIMonitor theme={theme} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-content">
               <ControlPanel theme={theme} setTheme={setTheme} />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-content" style={{ height: 'calc(100vh - 100px)' }}>
               <AboutSystem theme={theme} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <VoiceAI onCommand={handleSystemCommand} systemData={data} isSimulating={isSimulationRunning} />

      <style jsx="true">{`
        .dashboard-container { 
          display: flex; 
          height: 100vh; 
          width: 100vw; 
          transition: var(--transition-smooth); 
          background: var(--bg-gradient); 
        }
        .main-content { 
          flex: 1; 
          display: flex; 
          flex-direction: column; 
          overflow-y: auto; 
          background: rgba(0, 0, 0, 0.0); 
        }
        .dashboard-content { padding: 20px; }
        .main-grid-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
        .action-btn { 
          padding: 8px 25px; 
          border: 1px solid var(--border-glass); 
          font-family: 'Orbitron'; 
          cursor: pointer; 
          background: rgba(255, 255, 255, 0.05); 
          color: var(--text-primary); 
          font-size: 0.7rem;
          min-width: 100px;
          border-radius: 4px;
          transition: var(--transition-smooth);
        }
        .action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--text-secondary);
        }
        .action-btn.on { 
          background: rgba(0, 243, 255, 0.15); 
          border-color: var(--neon-cyan); 
          color: var(--neon-cyan); 
          box-shadow: 0 0 15px rgba(0, 243, 255, 0.2);
        }
        .light-mode .action-btn {
          background: rgba(0, 0, 0, 0.03);
          color: var(--text-secondary);
        }
        .light-mode .action-btn.on {
          background: var(--neon-cyan);
          color: white;
          border-color: var(--neon-cyan);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
