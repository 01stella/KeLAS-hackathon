import { useEffect, useState, type ReactNode } from 'react';
import 'leaflet/dist/leaflet.css';

const campusLocation: [number, number] = [-6.2088, 106.8456];

export default function AppMap() {
  const [map, setMap] = useState<ReactNode>(null);

  useEffect(() => {
    const { MapContainer, TileLayer, CircleMarker, Popup } = require('react-leaflet');

    setMap(
      <MapContainer
        center={campusLocation}
        zoom={15}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CircleMarker
          center={campusLocation}
          radius={10}
          pathOptions={{
            color: '#2563EB',
            fillColor: '#2563EB',
            fillOpacity: 1,
          }}
        >
          <Popup>UI Campus Library</Popup>
        </CircleMarker>
      </MapContainer>
    );
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {map ?? <p>Loading map...</p>}
    </div>
  );
}