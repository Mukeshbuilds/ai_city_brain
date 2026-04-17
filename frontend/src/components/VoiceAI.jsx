import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, MessageSquare, X, Terminal, Brain } from 'lucide-react';
import { toast } from 'react-toastify';

const VoiceAI = ({ onCommand, systemData, isSimulating }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', msg: 'Neural system online. Accessing city matrix. I am your Urban AI Controller. How can I assist you today?' }
  ]);
  
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isProcessing]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setIsProcessing(false);
      };

      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        processCommand(text);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setIsProcessing(false);
        toast.error("Audio Input Failure: Check Mic Permissions");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const processCommand = (text) => {
    const cmd = text.toLowerCase();
    setChatHistory(prev => [...prev, { role: 'user', msg: text }]);
    setIsProcessing(true);

      const speakResponse = (text) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Google') || v.name.includes('Female'))) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
        window.speechSynthesis.speak(utterance);
      };

      // AI "thinking" time
      setTimeout(() => {
          let response = "Protocol not recognized. Requesting manual synchronization. Try asking for 'Traffic Status' or 'Start Simulation'.";
          let actionTriggered = false;

          // ... (existing logic)
          if (cmd.includes('air quality') || cmd.includes('aqi')) {
              const val = systemData?.aqi ? systemData.aqi.toFixed(1) : '...';
              response = `The current urban Air Quality Index is ${val} AQI. Environment sensors are operating within optimal parameters.`;
          }
          else if (cmd.includes('traffic')) {
              const val = systemData?.traffic ? systemData.traffic.toFixed(1) : '...';
              response = `Regional traffic congestion is currently at ${val}%. Analyzing alternate vector paths.`;
          }
          else if (cmd.includes('energy') || cmd.includes('load')) {
              const val = systemData?.energy ? systemData.energy.toFixed(1) : '...';
              response = `Current energy grid load is ${val} GW. Core reactors are stable.`;
          }
          else if (cmd.includes('satisfaction') || cmd.includes('citizen')) {
              const val = systemData?.satisfaction ? systemData.satisfaction.toFixed(1) : '...';
              response = `Citizen satisfaction levels are holding at ${val}%. Monitoring sentient feedback loops.`;
          }
          else if (cmd.includes('status') && cmd.includes('system')) {
              response = `System Status Report: ALL NODES ONLINE. Simulation ${isSimulating ? 'RUNNING' : 'PAUSED'}. AQI: ${systemData?.aqi?.toFixed(1)}. Traffic: ${systemData?.traffic?.toFixed(1)}%.`;
          }
          else if (cmd.includes('health')) {
              response = `Public health risks are currently ${systemData?.health_risk || 'Low'}. AQI is at ${systemData?.aqi?.toFixed(1)}.`;
          }

          // 2. CONTROL ACTIONS
          else if (cmd.includes('start') && cmd.includes('simulation')) {
              onCommand('START_SIM');
              response = "Access granted. Simulation engine initialized. Urban flow is now live.";
              actionTriggered = true;
          }
          else if (cmd.includes('stop') || cmd.includes('pause') && cmd.includes('simulation')) {
              onCommand('PAUSE_SIM');
              response = "Simulation suspended. Freezing all urban vectors for analysis.";
              actionTriggered = true;
          }
          else if (cmd.includes('navigate') || cmd.includes('go to')) {
              if (cmd.includes('overview')) { onCommand('NAV_OVERVIEW'); response = "Navigating to Regional Overview."; actionTriggered = true; }
              if (cmd.includes('security')) { onCommand('NAV_SECURITY'); response = "Accessing Security & Emergency Panel."; actionTriggered = true; }
              if (cmd.includes('health') || cmd.includes('performance')) { onCommand('NAV_HEALTH'); response = "Transitioning to Global Health & Performance metrics."; actionTriggered = true; }
          }

          if (actionTriggered) {
            toast.success("Command Executed: " + text, { position: 'bottom-center' });
            new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3').play().catch(()=>{});
          }

          setChatHistory(prev => [...prev, { role: 'ai', msg: response }]);
          speakResponse(response);
          setIsProcessing(false);
      }, 600);
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;
    const msg = inputMessage;
    setInputMessage("");
    processCommand(msg);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const HelpPanel = () => (
    <div className="help-panel">
      <div className="help-title">RECOGNIZED_PROTOCOLS:</div>
      <div className="help-grid">
        {['Start Simulation', 'Stop Simulation', 'Air Quality', 'Traffic Status', 'Energy Load', 'System Status'].map(h => (
          <div key={h} className="help-item" onClick={() => processCommand(h)}>{h}</div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Mic Button */}
      <div className="voice-floating-container">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`mic-trigger ${isOpen ? 'active' : ''}`}
        >
          {isOpen ? <X size={24} /> : <Brain size={24} />}
          <div className="btn-glow"></div>
        </motion.button>
        
        <AnimatePresence>
            {!isOpen && (
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    className="mic-tooltip"
                >
                    NEURAL_ASSISTANT
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* AI Chat / Voice Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="ai-chat-panel voice-ai-popup glass-panel"
          >
            <div className="chat-header">
                <Terminal size={16} color="var(--neon-cyan)" />
                <span className="font-orbitron">AI_CITY_BRAIN_CONTROLLER</span>
                <div className={`status-dot ${isListening ? 'listening' : isProcessing ? 'processing' : 'idle'}`}></div>
            </div>

            <div className="chat-content">
                {chatHistory.map((chat, i) => (
                    <div key={i} className={`chat-line ${chat.role}`}>
                        <div className="avatar">{chat.role === 'ai' ? 'AI' : 'US'}</div>
                        <div className="msg">{chat.msg}</div>
                    </div>
                ))}
                {isProcessing && <div className="chat-line ai"><div className="msg pulse">Accessing neural database...</div></div>}
                
                {chatHistory.length < 3 && <HelpPanel />}
                <div ref={chatEndRef} />
            </div>

            <div className="chat-footer">
                <form className="chat-input-row" onSubmit={handleSendMessage}>
                    <input 
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type system command..."
                    />
                    <button type="submit" disabled={isProcessing}><Send size={16} /></button>
                </form>
                <div className="chat-controls">
                    <button 
                        onClick={toggleListening} 
                        className={`voice-action-btn ${isListening ? 'listening' : ''}`}
                    >
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                        <span>{isListening ? 'LISTENING...' : isProcessing ? 'SYNCING...' : 'VOICE_COMMAND'}</span>
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .voice-floating-container {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          align-items: center;
          gap: 15px;
          z-index: 9999;
        }
        .mic-trigger {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--bg-glass);
          backdrop-filter: var(--glass-blur);
          border: 1px solid var(--neon-cyan);
          color: var(--neon-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          box-shadow: var(--panel-shadow);
          transition: var(--transition-smooth);
        }
        .mic-trigger.active {
          border-color: var(--neon-purple);
          color: var(--neon-purple);
        }
        .btn-glow {
            position: absolute;
            inset: -2px;
            border-radius: 50%;
            border: 2px solid transparent;
            border-top-color: inherit;
            animation: rotate 2s linear infinite;
        }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .mic-tooltip {
            background: var(--bg-glass);
            border: 1px solid var(--neon-cyan);
            color: var(--neon-cyan);
            padding: 5px 15px;
            font-family: 'Orbitron', sans-serif;
            font-size: 0.7rem;
            border-radius: 4px;
            backdrop-filter: blur(5px);
            box-shadow: var(--panel-shadow);
        }

        .ai-chat-panel {
          position: fixed;
          bottom: 100px;
          right: 30px;
          width: 400px;
          height: 550px;
          z-index: 9998;
          display: flex;
          flex-direction: column;
          background: var(--bg-glass);
          backdrop-filter: var(--glass-blur);
          border: 1px solid var(--border-glass);
          box-shadow: var(--panel-shadow);
          border-radius: 12px;
          overflow: hidden;
        }
        .chat-header {
            padding: 15px;
            background: rgba(0, 0, 0, 0.2);
            border-bottom: 2px solid var(--border-glass);
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.75rem;
            color: var(--text-primary);
        }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; margin-left: auto; }
        .status-dot.idle { background: var(--text-secondary); }
        .status-dot.listening { background: var(--neon-red); box-shadow: 0 0 10px var(--neon-red); animation: pulse 1s infinite; }
        .status-dot.processing { background: var(--neon-cyan); box-shadow: 0 0 10px var(--neon-cyan); }

        .chat-content { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 15px; }
        .chat-line { display: flex; gap: 10px; }
        .chat-line.ai { color: var(--neon-cyan); }
        .chat-line.user { flex-direction: row-reverse; color: var(--neon-purple); }
        .avatar { font-size: 0.6rem; font-family: 'Orbitron'; background: rgba(0,0,0,0.1); padding: 5px; border-radius: 4px; height: fit-content; border: 1px solid var(--border-glass); }
        .msg { font-size: 0.8rem; background: rgba(0,0,0,0.05); padding: 10px 14px; border-radius: 8px; max-width: 80%; color: var(--text-primary); border: 1px solid var(--border-glass); line-height: 1.4; }
        
        .chat-footer { padding: 15px; border-top: 1px solid var(--border-glass); background: rgba(0,0,0,0.05); }
        .chat-input-row { display: flex; gap: 10px; margin-bottom: 12px; }
        .chat-input-row input { 
            flex: 1; 
            background: rgba(0,0,0,0.1); 
            border: 1px solid var(--border-glass); 
            padding: 8px 15px; 
            color: white; 
            font-family: 'Rajdhani';
            font-size: 0.9rem;
            outline: none;
            border-radius: 4px;
        }
        .chat-input-row button { 
            background: rgba(0, 243, 255, 0.1); 
            border: 1px solid var(--neon-cyan); 
            color: var(--neon-cyan); 
            width: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 4px;
        }

        .voice-action-btn {
            width: 100%;
            height: 40px;
            background: transparent;
            border: 1px solid var(--neon-cyan);
            color: var(--neon-cyan);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-family: 'Orbitron', sans-serif;
            cursor: pointer;
            transition: all 0.3s;
            border-radius: 4px;
            font-size: 0.7rem;
        }
        .voice-action-btn.listening {
            background: var(--neon-red);
            border-color: var(--neon-red);
            color: white;
            box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }

        .help-panel { background: rgba(0,0,0,0.1); border: 1px solid var(--border-glass); padding: 15px; border-radius: 8px; }
        .help-title { font-size: 0.6rem; color: var(--text-secondary); margin-bottom: 10px; font-family: 'Orbitron'; }
        .help-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .help-item { font-size: 0.65rem; color: var(--neon-cyan); cursor: pointer; text-decoration: underline; }
        .help-item:hover { color: white; }
      `}</style>
    </>
  );
};

export default VoiceAI;
