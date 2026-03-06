import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppFlowPage from './pages/AppFlowPage';
import RouteTracker from './components/shared/RouteTracker';

function App() {
  return (
    <>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app/*" element={<AppFlowPage />} />
      </Routes>
    </>
  );
}

export default App;
