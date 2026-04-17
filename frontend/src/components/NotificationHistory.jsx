import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, ShieldAlert, Activity, Info, Zap } from 'lucide-react';

const NotificationHistory = ({ notifications, isOpen, onClose, theme }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass-panel"
            style={{ 
              position: 'fixed', top: 0, right: 0, width: '400px', height: '100vh', 
              zIndex: 1001, padding: '30px', borderLeft: '1px solid var(--neon-cyan)',
              background: 'rgba(5, 5, 10, 0.95)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Bell color="var(--neon-cyan)" />
                <h2 className="font-orbitron" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>NEURAL_EL_LOGS</h2>
              </div>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={24} />
              </button>
            </div>

            <div className="notif-list" style={{ overflowY: 'auto', height: 'calc(100% - 80px)', paddingRight: '10px' }}>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                   NO_CRITICAL_LOGS_FOUND_IN_BUFFER
                </div>
              ) : (
                notifications.map((n, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ 
                      padding: '15px', background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px',
                      marginBottom: '15px', position: 'relative', overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px' }}>
                       <div style={{ marginTop: '3px' }}>
                          {n.type === 'error' && <ShieldAlert size={16} color="var(--neon-red)" />}
                          {n.type === 'warning' && <Info size={16} color="var(--neon-orange)" />}
                          {n.type === 'success' && <Activity size={16} color="var(--neon-green)" />}
                       </div>
                       <div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '5px' }}>{n.message}</p>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                             {new Date(n.time).toLocaleTimeString()}
                          </span>
                       </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationHistory;
