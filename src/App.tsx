import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppFlowPage from './pages/AppFlowPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app/*" element={<AppFlowPage />} />
    </Routes>
  );
}

export default App;
