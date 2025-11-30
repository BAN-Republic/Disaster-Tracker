import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import TruckIcon from '../assets/delivery-truck.png';
// Types
interface Location {
  lat: number;
  lng: number;
}

interface MapProps {
  vehicleLocation: Location | null;
  userLocation: Location | null;
}

const containerStyle = {
  width: '100%',
  height: '100dvh' // Dynamic viewport height for mobile
};

const center = {
  lat: 6.9271, // Default (e.g., Colombo, Sri Lanka)
  lng: 79.8612
};

export const MapComponent: React.FC<MapProps> = ({ vehicleLocation, userLocation }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "" 
  });

  const [, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className="flex justify-center items-center h-screen">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={vehicleLocation || center}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {/* The Emergency Vehicle Marker */}
      {vehicleLocation && (
  <Marker
  position={vehicleLocation}
  icon={{
    // This is a direct link to a Red Bus icon
    url: TruckIcon, 
    scaledSize: new google.maps.Size(55, 55) // Size of the bus (Width, Height)
  }}
  animation={google.maps.Animation.DROP}
/>
      )}

      {/* The User's Location (Optional) */}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "white",
          }}
        />
      )}
    </GoogleMap>
  );
};