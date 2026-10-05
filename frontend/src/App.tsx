import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Players } from './pages/Players';
import { MatchDetails } from './pages/MatchDetails';

function App() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Dispatch a custom event that the Dashboard can listen to
    window.dispatchEvent(new Event('refresh-dashboard'));
    setTimeout(() => setIsRefreshing(false), 1000); // UI feedback
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/players" element={<Players />} />
            <Route path="/matches/:id" element={<MatchDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
