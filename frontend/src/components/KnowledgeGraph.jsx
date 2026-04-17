import React, { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const KnowledgeGraph = ({ height = 400, theme = 'dark' }) => {
  const data = useMemo(() => {
    return {
      nodes: [
        { id: 'Neural Core', group: 1, color: '#00f3ff' },
        { id: 'Traffic AI', group: 2, color: '#00f3ff' },
        { id: 'Energy Grid', group: 2, color: '#00ccff' },
        { id: 'Safety Net', group: 2, color: '#0099ff' },
        { id: 'Civic Data', group: 3, color: '#bc00ff' },
        { id: 'Econ Predictor', group: 3, color: '#bc00ff' },
        { id: 'Resource Mgr', group: 3, color: '#bc00ff' },
        { id: 'Z-1 Sensor', group: 4, color: '#00ff9d' },
        { id: 'Z-2 Sensor', group: 4, color: '#00ff9d' },
        { id: 'Z-3 Sensor', group: 4, color: '#00ff9d' },
        { id: 'Weather AI', group: 5, color: '#ff8c00' },
        { id: 'Grid Load', group: 5, color: '#ff8c00' },
        { id: 'Public Health', group: 5, color: '#ff8c00' },
        { id: 'Emergency Reroute', group: 6, color: '#ff003c' },
        { id: 'Bio-Sync', group: 6, color: '#ff003c' }
      ],
      links: [
        { source: 'Neural Core', target: 'Traffic AI' },
        { source: 'Neural Core', target: 'Energy Grid' },
        { source: 'Neural Core', target: 'Safety Net' },
        { source: 'Traffic AI', target: 'Civic Data' },
        { source: 'Traffic AI', target: 'Z-1 Sensor' },
        { source: 'Energy Grid', target: 'Grid Load' },
        { source: 'Energy Grid', target: 'Z-2 Sensor' },
        { source: 'Safety Net', target: 'Emergency Reroute' },
        { source: 'Safety Net', target: 'Public Health' },
        { source: 'Civic Data', target: 'Econ Predictor' },
        { source: 'Civic Data', target: 'Resource Mgr' },
        { source: 'Weather AI', target: 'Neural Core' },
        { source: 'Bio-Sync', target: 'Neural Core' },
        { source: 'Z-3 Sensor', target: 'Traffic AI' }
      ]
    };
  }, []);

  const linkColor = theme === 'light' ? 'rgba(37, 99, 235, 0.4)' : 'rgba(0, 243, 255, 0.2)';
  const nodeBg = theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)';

  return (
    <div className="knowledge-graph-container glass-panel">
      <div className="graph-header">
         <span className="font-orbitron" style={{ fontSize: '0.8rem', padding: '15px', display: 'block', color: 'var(--text-primary)' }}>Urban Cognitive Map</span>
      </div>
      <div className="graph-wrapper">
        <ForceGraph2D
          key={theme}
          graphData={data}
          height={height}
          backgroundColor="rgba(0,0,0,0)"
          nodeAutoColorBy="group"
          nodeRelSize={6}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          linkColor={() => linkColor}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Rajdhani`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

            ctx.fillStyle = nodeBg;
            ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = node.color;
            ctx.fillText(label, node.x, node.y);

            node.__bckgDimensions = bckgDimensions; // to reuse in nodePointerAreaPaint
          }}
        />
      </div>

      <style jsx="true">{`
        .knowledge-graph-container {
          overflow: hidden;
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          min-height: 600px;
          border-radius: 12px;
        }
        .graph-wrapper {
          cursor: crosshair;
          height: 100%;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default KnowledgeGraph;
