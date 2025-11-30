// src/pages/Donor.tsx
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { MapComponent } from '../components/Map';

export const Donor = () => {
  const [vehicleLocation, setVehicleLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Listen to vehicle location
  useEffect(() => {
    const vehicleRef = ref(db, 'vehicles/emergency-unit-1');
    const unsubscribe = onValue(vehicleRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setVehicleLocation({ lat: data.lat, lng: data.lng });
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="relative w-full h-screen">
      <MapComponent vehicleLocation={vehicleLocation} userLocation={null} />
      
      {/* Donor Info Card */}
      <div className="absolute bottom-0 w-full p-6 bg-white rounded-t-3xl shadow-2xl z-10 pb-10">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-3 rounded-full text-white shadow-lg">
            🚛
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-800">Relief Unit #1</h2>
            <p className="text-gray-500 text-sm">Collecting Donations Now</p>
          </div>
        </div>

        {vehicleLocation ? (
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${vehicleLocation.lat},${vehicleLocation.lng}`}
            target="_blank"
            className="mt-6 block w-full bg-blue-600 text-white text-center py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all"
          >
            Navigate to Vehicle
          </a>
        ) : (
          <div className="mt-6 text-center text-gray-400 text-sm p-4 bg-gray-50 rounded-xl">
            Waiting for driver to start engine...
          </div>
        )}
      </div>
    </div>
  );
};