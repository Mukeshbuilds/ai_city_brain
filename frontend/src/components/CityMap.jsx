import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Component to handle map actions like zoom
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, { animate: true, duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
};

const CityMap = ({ theme = 'dark' }) => {
  const defaultCenter = [13.0827, 80.2707];
  const [mapConfigs, setMapConfigs] = useState({ center: defaultCenter, zoom: 6 });
  const [showIncidents, setShowIncidents] = useState(false);

  // Map Tile URL based on theme
  const tileUrl = theme === 'light' 
    ? "https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  const indiaCities = [
    { name: 'Chennai', pos: [13.0827, 80.2707], type: 'Primary_Core', info: 'Neural Command' },
    { name: 'Bangalore', pos: [12.9716, 77.5946], type: 'Node_Sensor', info: 'Tech Corridor' },
    { name: 'Mumbai', pos: [19.0760, 72.8777], type: 'Economic_Brain', info: 'Financial Node' },
    { name: 'Delhi', pos: [28.7041, 77.1025], type: 'Policy_Engine', info: 'Command Center' },
  ];

  const chennaiIncidents = [
    { pos: [13.0900, 80.2800], type: 'Traffic_Congestion', severity: 'medium' },
    { pos: [13.0700, 80.2600], type: 'Grid_Overload', severity: 'critical' },
    { pos: [13.0850, 80.2500], type: 'Medical_Dispatch', severity: 'low' },
  ];

  const handleCityClick = (city) => {
    if (city.name === 'Chennai') {
      setMapConfigs({ center: city.pos, zoom: 13 });
      setShowIncidents(true);
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } else {
        setMapConfigs({ center: city.pos, zoom: 10 });
        setShowIncidents(false);
    }
  };

  const resetMap = () => {
    setMapConfigs({ center: defaultCenter, zoom: 6 });
    setShowIncidents(false);
  };

  return (
    <div className="city-map-wrapper glass-panel" style={{ height: '400px' }}>
      <div className="map-header">
         <span className="font-orbitron">VECTOR_SPATIAL_SYNC - INDIA</span>
         <button onClick={resetMap} className="reset-btn font-orbitron">RESET_VIEW</button>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer 
            center={defaultCenter} 
            zoom={6} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
        >
            <MapController center={mapConfigs.center} zoom={mapConfigs.zoom} />
            <TileLayer
                attribution='&copy; CARTO'
                url={tileUrl}
            />
            
            {indiaCities.map((city, i) => (
                <CircleMarker
                    key={i}
                    center={city.pos}
                    radius={city.name === 'Chennai' ? 14 : 7}
                    eventHandlers={{ click: () => handleCityClick(city) }}
                    pathOptions={{ 
                        color: city.name === 'Chennai' ? 'var(--neon-cyan)' : 'rgba(37, 99, 235, 0.4)',
                        fillColor: city.name === 'Chennai' ? 'var(--neon-cyan)' : 'rgba(37, 99, 235, 0.4)',
                        fillOpacity: 0.8,
                        weight: city.name === 'Chennai' ? 3 : 1
                    }}
                >
                    <Popup className="cyber-popup">
                        <div className="font-orbitron" style={{ color: 'var(--neon-cyan)' }}>{city.name}</div>
                        <div style={{ fontSize: '0.7rem' }}>{city.type}</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>CLICK FOR LOCAL INTEL</div>
                    </Popup>
                </CircleMarker>
            ))}

            {showIncidents && chennaiIncidents.map((inc, i) => (
                <CircleMarker
                    key={`inc-${i}`}
                    center={inc.pos}
                    radius={6}
                    pathOptions={{ 
                        color: inc.severity === 'critical' ? 'var(--neon-red)' : 'var(--neon-orange)',
                        fillOpacity: 1,
                        weight: 2
                    }}
                >
                    <Popup className="cyber-popup">
                        <div style={{ color: inc.severity === 'critical' ? 'var(--neon-red)' : 'var(--neon-orange)' }}>
                            {inc.type}
                        </div>
                        <div style={{ fontSize: '0.6rem' }}>SEVERITY: {inc.severity.toUpperCase()}</div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
      </div>

      <style jsx="true">{`
        .city-map-wrapper { display: flex; flex-direction: column; overflow: hidden; background: var(--bg-dark); position: relative; border: 1px solid var(--border-glass); }
        .map-header { 
            padding: 12px 20px; background: rgba(0,0,0,0.05); font-size: 0.65rem; 
            color: var(--neon-cyan); border-bottom: 1px solid var(--border-glass); 
            z-index: 1000; display: flex; justify-content: space-between; align-items: center;
        }
        .reset-btn {
            background: rgba(37, 99, 235, 0.1); border: 1px solid var(--neon-cyan);
            color: var(--neon-cyan); padding: 4px 12px; cursor: pointer; font-size: 0.6rem;
            border-radius: 4px;
        }
        .reset-btn:hover { background: var(--neon-cyan); color: white; }
        .cyber-popup .leaflet-popup-content-wrapper {
            background: var(--bg-glass); color: var(--text-primary);
            backdrop-filter: var(--glass-blur);
            border: 1px solid var(--border-glass); border-radius: 8px;
            font-family: 'Rajdhani', sans-serif;
            box-shadow: var(--panel-shadow);
        }
        .cyber-popup .leaflet-popup-tip {
            background: var(--bg-glass);
        }
      `}</style>
    </div>
  );
};

export default CityMap;
