// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Donor } from './pages/Donor';
import { Driver } from './pages/Driver';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: Anyone can see this */}
        <Route path="/" element={<Donor />} />

        {/* Driver Route: Only accessible if you know the link */}
        <Route path="/driver" element={<Driver />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;