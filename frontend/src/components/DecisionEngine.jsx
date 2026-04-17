import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';

const TypewriterText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 20); // 20ms per character
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

const DecisionEngine = ({ decisions = [] }) => {
  const [displayedDecisions, setDisplayedDecisions] = useState([]);

  useEffect(() => {
    if (decisions.length > 0) {
      setDisplayedDecisions(prev => {
        // Only add unique messages
        const news = decisions.filter(d => !prev.find(p => p.msg === d.msg));
        const combined = [...news, ...prev].slice(0, 6);
        return combined;
      });
    }
  }, [decisions]);

  return (
    <div className="decision-engine glass-panel">
      <div className="panel-header">
        <Brain size={16} color="var(--neon-cyan)" className="pulse" />
        <h3 className="font-orbitron">NEURAL_DECISION_ENGINE_v4</h3>
      </div>
      
      <div className="decision-feed">
        <AnimatePresence initial={false}>
          {displayedDecisions.map((decision, idx) => (
            <motion.div
              key={decision.msg}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`decision-item ${decision.type}`}
            >
              <div className="timestamp">[{new Date().toLocaleTimeString()}]</div>
              <div className="msg-content">
                <span className="cursor">{">"}</span> 
                <TypewriterText text={decision.msg} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style jsx="true">{`
        .decision-engine { height: 320px; display: flex; flex-direction: column; background: var(--bg-glass); border: 1px solid var(--border-glass); transition: var(--transition-smooth); }
        .panel-header {
          padding: 12px 18px; display: flex; align-items: center; gap: 12px;
          border-bottom: 1px solid var(--border-glass); background: rgba(0, 0, 0, 0.03);
          color: var(--text-primary);
        }
        .decision-feed { padding: 15px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 8px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.75rem; }
        .decision-item { padding: 8px 12px; border-left: 3px solid var(--neon-cyan); background: rgba(0,0,0,0.02); border-radius: 0 4px 4px 0; }
        .decision-item.warning { border-color: var(--neon-orange); color: var(--neon-orange); }
        .decision-item.critical { border-color: var(--neon-red); color: var(--neon-red); }
        .decision-item.info { border-color: var(--neon-cyan); color: var(--neon-cyan); }
        .timestamp { font-size: 0.6rem; opacity: 0.6; margin-bottom: 3px; color: var(--text-secondary); }
        .cursor { color: inherit; margin-right: 6px; font-weight: bold; animation: blink 1s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};

export default DecisionEngine;
