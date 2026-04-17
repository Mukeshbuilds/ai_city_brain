import React from 'react';
import { motion } from 'framer-motion';

const Background = () => {
  return (
    <div className="animated-bg">
      <div className="grid-overlay"></div>
      <div className="scanline"></div>
      
      {/* Floating particles simulation using CSS filters */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`particle p-${i % 3}`}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.3 + 0.1
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0],
              scale: [1, 1.2]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              borderRadius: '50%',
            }}
          />
        ))}
      </div>

      <style jsx="true">{`
        .animated-bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
        }
        .particle.p-0 { background-color: var(--neon-cyan); box-shadow: 0 0 10px var(--neon-cyan); }
        .particle.p-1 { background-color: var(--neon-purple); box-shadow: 0 0 10px var(--neon-purple); }
        .particle.p-2 { background-color: var(--neon-green); box-shadow: 0 0 10px var(--neon-green); }

        .light-mode .particle { box-shadow: none !important; opacity: 0.15 !important; }
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .particle {
          filter: blur(1px);
        }
      `}</style>
    </div>
  );
};

export default Background;
