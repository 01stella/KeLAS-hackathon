import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

// 1. Add props to receive coordinate data from HomeScreen
interface AppMapProps {
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
}

export default function AppMapWeb({ userLocation }: AppMapProps) {
  const [LeafletComponents, setLeafletComponents] = useState<any>(null);

  useEffect(() => {
    // Dynamically load react-leaflet for web
    const rl = require('react-leaflet');
    setLeafletComponents(rl);
  }, []);

  if (!LeafletComponents) return <div style={{ padding: 20 }}>Loading map module...</div>;
  
  // If GPS from HomeScreen hasn't fetched coordinates yet, wait
  if (!userLocation) return <div style={{ padding: 20 }}>Finding your location...</div>;

  const { MapContainer, TileLayer, CircleMarker, Popup, useMap } = LeafletComponents;

  // 2. Create logic to update map camera position when joystick moves
  function MapUpdater({ coords }: { coords: { latitude: number, longitude: number } }) {
    const map = useMap();
    useEffect(() => {
      // Move camera without animation to prevent lag on web
      map.setView([coords.latitude, coords.longitude], map.getZoom(), { animate: false });
    }, [coords.latitude, coords.longitude, map]);
    return null;
  }

  return (
    <div style={{ width: '100%', height: '100%', zIndex: 1 }}>
      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={16}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Call the map camera updater component */}
        <MapUpdater coords={userLocation} />
        
        {/* 3. Render the blue dot exactly at the joystick/GPS coordinates */}
        <CircleMarker
          center={[userLocation.latitude, userLocation.longitude]}
          radius={8}
          pathOptions={{
            color: '#FFF',       // White border
            fillColor: '#3B82F6',// Google Maps style blue color
            fillOpacity: 1,
            weight: 3,
          }}
        >
          <Popup>Your Current Location</Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}