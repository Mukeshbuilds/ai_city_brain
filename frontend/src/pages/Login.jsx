import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, User, Cpu } from 'lucide-react';

const STARTUP_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Preload audio for instant playback
    const audio = new Audio(STARTUP_SOUND);
    audio.preload = 'auto';
    audio.volume = 0.9; // Slightly louder than click sounds
    audioRef.current = audio;

    // Preload voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Trigger soft futuristic startup sound instantly
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }

    // 2. Delay (500ms) then Trigger Voice
    setTimeout(() => {
      if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance("Welcome to AI City Brain. Autonomous urban intelligence system initialized. All systems are now online.");
        const voices = window.speechSynthesis.getVoices();
        
        // Select female voice if available
        const femaleVoice = voices.find(v => 
          v.name.includes('Female') || 
          v.name.includes('Google UK English Female') || 
          v.name.includes('Zira') || 
          v.name.includes('Samantha') ||
          v.name.includes('Victoria')
        );
        
        if (femaleVoice) {
          msg.voice = femaleVoice;
        }
        // Voice Requirements (Harder Tone)
        msg.pitch = 0.8;     // Low pitch (0.7 - 0.9)
        msg.rate = 0.9;      // Slightly slow (0.85 - 0.95)
        msg.volume = 1.0;    // Full volume
        
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
      }
    }, 500);

    // Continue to dashboard after sequence
    setTimeout(() => {
      onLogin();
    }, 4500); // Allowed enough time for the sound + voice to speak
  };

  return (
    <div className="login-page flex-center" style={{ height: '100vh', width: '100vw' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-panel login-card"
        style={{ padding: '40px', width: '400px', textAlign: 'center' }}
      >
        <div className="login-header">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ marginBottom: '20px' }}
          >
            <Cpu size={60} color="var(--neon-cyan)" style={{ filter: 'drop-shadow(var(--glow-cyan))' }} />
          </motion.div>
          <h1 className="neon-text-cyan" style={{ fontSize: '1.5rem', marginBottom: '10px' }}>AI City Brain</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '30px' }}>Neuromorphic Urban OS v.4.0.2</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group">
            <User size={18} className="input-icon" />
            <input type="text" placeholder="AUTHORIZATION ID" required />
          </div>
          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input type="password" placeholder="BIOMETRIC KEY" required />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 15px var(--neon-cyan)' }}
            whileTap={{ scale: 0.98 }}
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Cpu size={20} />
              </motion.div>
            ) : "INITIALIZE SYSTEM"}
          </motion.button>
        </form>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <Shield size={16} color="var(--neon-green)" />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ENC-256 SECURE PROTOCOL</span>
        </div>
      </motion.div>

      <style jsx="true">{`
        .login-card {
          border-left: 2px solid var(--neon-cyan);
          background: rgba(5, 5, 10, 0.8);
        }
        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 15px;
          color: var(--neon-cyan);
          opacity: 0.7;
        }
        input {
          width: 100%;
          padding: 12px 12px 12px 45px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-glass);
          color: white;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 1px;
          transition: var(--transition-smooth);
        }
        input:focus {
          outline: none;
          border-color: var(--neon-cyan);
          background: rgba(0, 243, 255, 0.05);
        }
        .login-btn {
          width: 100%;
          padding: 15px;
          background: transparent;
          border: 1px solid var(--neon-cyan);
          color: var(--neon-cyan);
          font-family: 'Orbitron', sans-serif;
          cursor: pointer;
          font-weight: bold;
          letter-spacing: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: var(--transition-smooth);
        }
      `}</style>
    </div>
  );
};

export default Login;
