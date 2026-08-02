import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Lotus from './pages/Lotus';
import Butterfly from './pages/Butterfly';
import HeartFlowers from './pages/HeartFlowers';
import Collision from './pages/Collision';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lotus" element={<Lotus />} />
      <Route path="/magicText" element={<Butterfly />} />
      <Route path="/heartFlowers" element={<HeartFlowers />} />
      <Route path="/collision" element={<Collision />} />
    </Routes>
  );
}
