// src/pages/Driver.tsx
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../firebase';

export const Driver = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [status, setStatus] = useState("Idle");

  // Check if driver is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // GPS Tracking Logic
  useEffect(() => {
    let watchId: number;
    if (user && isTransmitting && navigator.geolocation) {
      setStatus("Locating satellites...");
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStatus(`Broadcasting: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          
          // Send to Firebase
          set(ref(db, 'vehicles/emergency-unit-1'), {
            lat: latitude,
            lng: longitude,
            lastUpdated: Date.now()
          });
        },
        (err) => setStatus(`Error: ${err.message}`),
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [user, isTransmitting]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert("Login Failed: " + error.message);
    }
  };

  // 1. If NOT logged in, show Login Form
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Driver Login 👮</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="email" placeholder="Email" className="p-3 border rounded-lg"
              value={email} onChange={e => setEmail(e.target.value)} 
            />
            <input 
              type="password" placeholder="Password" className="p-3 border rounded-lg"
              value={password} onChange={e => setPassword(e.target.value)} 
            />
            <button type="submit" className="bg-blue-600 text-white py-3 rounded-lg font-bold">
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. If Logged in, show Driver Controls
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-400">Authorized Driver</h1>
          <p className="text-gray-400 mt-2">{user.email}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl mb-8 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">STATUS</p>
          <p className="text-xl font-mono text-yellow-400">{status}</p>
        </div>

        <button
          onClick={() => setIsTransmitting(!isTransmitting)}
          className={`w-full py-6 rounded-2xl text-2xl font-bold shadow-lg transition-all ${
            isTransmitting 
              ? 'bg-red-600 animate-pulse' 
              : 'bg-green-600 hover:bg-green-500'
          }`}
        >
          {isTransmitting ? "STOP TRACKING" : "START DRIVING"}
        </button>

        <button 
          onClick={() => signOut(auth)} 
          className="mt-8 text-gray-500 underline text-sm"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};