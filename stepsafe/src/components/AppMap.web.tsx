import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

// Update props to send the final coordinates back when journey ends
interface AppMapProps {
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
  onDestinationSelect?: (address: string) => void;
  isJourneyStarted?: boolean; 
  onJourneyEnd?: (finalLat: number, finalLng: number) => void; // Updated callback
}

export default function AppMapWeb({ userLocation, onDestinationSelect, isJourneyStarted, onJourneyEnd }: AppMapProps) {
  const [LeafletComponents, setLeafletComponents] = useState<any>(null);
  const [destCoords, setDestCoords] = useState<{lat: number, lng: number} | null>(null);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  
  // State to handle the moving blue dot separately from joystick input
  const [activeLocation, setActiveLocation] = useState<{latitude: number, longitude: number} | null>(null);
  
  // State for the grey trail (breadcrumb history)
  const [trailPath, setTrailPath] = useState<[number, number][]>([]);

  useEffect(() => {
    // Dynamically load react-leaflet for web
    const rl = require('react-leaflet');
    setLeafletComponents(rl);
  }, []);

  // Sync manual joystick movement with the active location dot
  useEffect(() => {
    if (!isJourneyStarted && userLocation) {
      setActiveLocation(userLocation);
    }
  }, [userLocation, isJourneyStarted]);

  // Record every movement of the activeLocation into the trail history
  useEffect(() => {
    if (activeLocation) {
      setTrailPath(prev => {
        const lastPoint = prev[prev.length - 1];
        // Prevent duplicate identical points to save memory
        if (lastPoint && lastPoint[0] === activeLocation.latitude && lastPoint[1] === activeLocation.longitude) {
          return prev;
        }
        return [...prev, [activeLocation.latitude, activeLocation.longitude]];
      });
    }
  }, [activeLocation]);

  // Logic to move the blue dot along the route path when journey starts
  useEffect(() => {
    if (isJourneyStarted && routePath.length > 0) {
      let currentStep = 0;
      const moveInterval = setInterval(() => {
        if (currentStep < routePath.length) {
          setActiveLocation({
            latitude: routePath[currentStep][0],
            longitude: routePath[currentStep][1]
          });
          currentStep++;
        } else {
          // Destination reached! 
          clearInterval(moveInterval);
          
          const finalPos = routePath[routePath.length - 1];
          
          // Clear the active green route and red destination dot
          setRoutePath([]);
          setDestCoords(null);
          
          // Notify HomeScreen with the final coordinates to prevent snapping back
          if (onJourneyEnd) {
            onJourneyEnd(finalPos[0], finalPos[1]);
          }
        }
      }, 100); 

      return () => clearInterval(moveInterval);
    }
  }, [isJourneyStarted, routePath, onJourneyEnd]);

  if (!LeafletComponents) return <div style={{ padding: 20 }}>Loading map module...</div>;
  if (!activeLocation) return <div style={{ padding: 20 }}>Finding your location...</div>;

  const { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMapEvents, useMap } = LeafletComponents;

  // Component to handle Right-Click (Long Press on web)
  function MapEvents() {
    useMapEvents({
      contextmenu: async (e: any) => { 
        // Prevent setting new destination if journey already started
        if (isJourneyStarted) return; 

        const { lat, lng } = e.latlng;
        setDestCoords({ lat, lng });

        try {
          // 1. Fetch walking route from Open Source Routing Machine (OSRM)
          const routeRes = await fetch(`https://router.project-osrm.org/route/v1/foot/${activeLocation!.longitude},${activeLocation!.latitude};${lng},${lat}?overview=full&geometries=geojson`);
          const routeData = await routeRes.json();
          
          if (routeData.routes && routeData.routes[0]) {
            // Convert GeoJSON [lon, lat] to Leaflet [lat, lon]
            const coords = routeData.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
            setRoutePath(coords);
          }

          // 2. Fetch destination name using OpenStreetMap
          if (onDestinationSelect) {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const geoData = await geoRes.json();
            
            if (geoData && geoData.address) {
              const street = geoData.address.road || geoData.address.pedestrian || '';
              const city = geoData.address.city || geoData.address.town || geoData.address.state || '';
              const finalAddress = street && city ? `${street}, ${city}` : street || city || 'Custom Destination';
              
              onDestinationSelect(finalAddress);
            }
          }
        } catch (err) {
          console.error("Failed to fetch route data", err);
        }
      }
    });
    return null;
  }

  function MapUpdater({ coords }: { coords: { latitude: number, longitude: number } }) {
    const map = useMap();
    useEffect(() => {
      map.setView([coords.latitude, coords.longitude], map.getZoom(), { animate: false });
    }, [coords.latitude, coords.longitude, map]);
    return null;
  }

  return (
    <div style={{ width: '100%', height: '100%', zIndex: 1 }}>
      <MapContainer
        center={[activeLocation.latitude, activeLocation.longitude]}
        zoom={16}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater coords={activeLocation} />
        
        {/* Listen for map clicks */}
        <MapEvents />
        
        {/* Route Line (Green) */}
        {routePath.length > 0 && (
          <Polyline 
            positions={routePath} 
            pathOptions={{ color: '#10B981', weight: 6, opacity: 0.8 }} 
          />
        )}

        {/* Grey Trail (Breadcrumbs History) */}
        {trailPath.length > 1 && (
          <Polyline 
            positions={trailPath} 
            pathOptions={{ color: '#64748B', weight: 5, opacity: 0.9, dashArray: '10, 10' }} 
          />
        )}

        {/* Start Point / Moving Blue Dot */}
        <CircleMarker
          center={[activeLocation.latitude, activeLocation.longitude]}
          radius={8}
          pathOptions={{ color: '#FFF', fillColor: '#3B82F6', fillOpacity: 1, weight: 3 }}
        >
          <Popup>Your Current Location</Popup>
        </CircleMarker>

        {/* End Point (Red Dot) - Shows up when destination is set */}
        {destCoords && (
          <CircleMarker
            center={[destCoords.lat, destCoords.lng]}
            radius={8}
            pathOptions={{ color: '#FFF', fillColor: '#EF4444', fillOpacity: 1, weight: 3 }}
          >
            <Popup>Destination</Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}