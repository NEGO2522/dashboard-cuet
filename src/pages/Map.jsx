import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { colleges } from '../data/colleges';
import { offerings } from '../data/offerings';
import './Map.css';

// Fix for default marker icons in Leaflet with Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper to create colored dot icons
const createDotIcon = (color) => {
  return new L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 1.25rem; height: 1.25rem; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const COLORS = {
  north: '#dc2626', // Red
  south: '#2563eb', // Blue
  off: '#16a34a',   // Green
  metro: '#9333ea', // Purple
  acc: '#f59e0b',   // Amber
  food: '#ec4899'   // Pink
};

const icons = {
  north: createDotIcon(COLORS.north),
  south: createDotIcon(COLORS.south),
  off: createDotIcon(COLORS.off),
  metro: createDotIcon(COLORS.metro),
  acc: createDotIcon(COLORS.acc),
  food: createDotIcon(COLORS.food),
};

const MOCK_METROS = [
  { id: 'm1', name: 'Vishwavidyalaya Metro', coords: [28.6976, 77.2025] },
  { id: 'm2', name: 'Hauz Khas Metro', coords: [28.5434, 77.2059] },
  { id: 'm3', name: 'Lajpat Nagar Metro', coords: [28.5701, 77.2343] }
];

const MOCK_ACC = [
  { id: 'a1', name: 'Kamala Nagar PGs', coords: [28.6814, 77.1991] },
  { id: 'a2', name: 'Satya Niketan PGs', coords: [28.5834, 77.1666] },
  { id: 'a3', name: 'Vijay Nagar', coords: [28.6946, 77.1970] }
];

const MOCK_FOOD = [
  { id: 'f1', name: 'Hudson Lane', coords: [28.6958, 77.1997] },
  { id: 'f2', name: 'SDA Market', coords: [28.5459, 77.1983] },
  { id: 'f3', name: 'Majnu Ka Tila', coords: [28.7001, 77.2285] }
];

export function Map() {
  const [showColleges, setShowColleges] = useState(true);
  const [showMetro, setShowMetro] = useState(false);
  const [showAcc, setShowAcc] = useState(false);
  const [showFood, setShowFood] = useState(false);

  // Center on Delhi roughly
  const center = [28.6139, 77.2090];
  
  // Calculate total seats helper
  const getSeats = (collegeId) => {
    return offerings
      .filter(o => o.collegeId === collegeId)
      .reduce((sum, o) => {
        const cats = Object.values(o.seatsByCategory || {});
        return sum + cats.reduce((s, val) => s + val, 0);
      }, 0);
  };

  const getCampusIcon = (campus) => {
    if (campus === 'North') return icons.north;
    if (campus === 'South') return icons.south;
    return icons.off;
  };

  return (
    <div className="map-container">
      <div className="map-header">
        <h1>Interactive Campus Map</h1>
        <p className="map-note">Explore colleges, nearby metro stations, and hotspots across Delhi.</p>
      </div>

      <div className="map-controls">
        <label className="map-filter-group">
          <input type="checkbox" checked={showColleges} onChange={e => setShowColleges(e.target.checked)} />
          Colleges
        </label>
        <label className="map-filter-group">
          <input type="checkbox" checked={showMetro} onChange={e => setShowMetro(e.target.checked)} />
          Metro Stations
        </label>
        <label className="map-filter-group">
          <input type="checkbox" checked={showAcc} onChange={e => setShowAcc(e.target.checked)} />
          Accommodation
        </label>
        <label className="map-filter-group">
          <input type="checkbox" checked={showFood} onChange={e => setShowFood(e.target.checked)} />
          Food Spots
        </label>

        <div className="map-legend">
          <span className="legend-item"><div className="legend-color" style={{ backgroundColor: COLORS.north }}></div> North Campus</span>
          <span className="legend-item"><div className="legend-color" style={{ backgroundColor: COLORS.south }}></div> South Campus</span>
          <span className="legend-item"><div className="legend-color" style={{ backgroundColor: COLORS.off }}></div> Off-campus</span>
          <span className="legend-item"><div className="legend-color" style={{ backgroundColor: COLORS.metro }}></div> Metro</span>
          <span className="legend-item"><div className="legend-color" style={{ backgroundColor: COLORS.acc }}></div> Accommodation</span>
          <span className="legend-item"><div className="legend-color" style={{ backgroundColor: COLORS.food }}></div> Food</span>
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer center={center} zoom={11} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {showColleges && colleges.map(coll => {
            if (!coll.coordinates) return null;
            return (
              <Marker key={coll.id} position={coll.coordinates} icon={getCampusIcon(coll.campus)}>
                <Popup>
                  <div className="map-popup-content">
                    <h3 className="map-popup-title">{coll.name}</h3>
                    <p className="map-popup-meta">{coll.campus} Campus</p>
                    <p className="map-popup-meta" style={{ marginBottom: '1rem' }}>Total Seats: {getSeats(coll.id)}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Link to={`/college/${coll.id}`} className="map-popup-link">View college details</Link>
                      <a href={coll.officialWebsite} target="_blank" rel="noopener noreferrer" className="map-popup-link" style={{ backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}>
                        Official website ↗
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {showMetro && MOCK_METROS.map(m => (
            <Marker key={m.id} position={m.coords} icon={icons.metro}>
              <Popup><strong>{m.name}</strong></Popup>
            </Marker>
          ))}

          {showAcc && MOCK_ACC.map(m => (
            <Marker key={m.id} position={m.coords} icon={icons.acc}>
              <Popup><strong>{m.name}</strong></Popup>
            </Marker>
          ))}

          {showFood && MOCK_FOOD.map(m => (
            <Marker key={m.id} position={m.coords} icon={icons.food}>
              <Popup><strong>{m.name}</strong></Popup>
            </Marker>
          ))}

        </MapContainer>
      </div>
    </div>
  );
}
