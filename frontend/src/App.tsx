import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Support from './pages/Support';
import Signup from './pages/Signup';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/support" element={<Support />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
