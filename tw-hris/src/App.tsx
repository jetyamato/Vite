import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your components
import DashboardIndex from './landing/dashboard/DashboardIndex';
import Index from './landing/index/Index';
import Indexlogin from './landing/index/IndexLogin';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login state

  // Check login status from sessionStorage when the app loads
  useEffect((): void => {
    const userLoggedIn = sessionStorage.getItem('user'); // Check if there is a session token
    if (userLoggedIn) {
      setIsLoggedIn(true); // If session exists, set logged in state
    } else {
      setIsLoggedIn(false); // Otherwise, set logged out state
    }
  }, []);

  return (
    <div>
      <Routes>
      
        <Route path="/" element={<DashboardIndex />} /> {/* Pass handleLogin to Index */}
        <Route path="/indexlogin" element={<Indexlogin />} />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <DashboardIndex  /> : <Index />} // Pass handleLogout to Dashboard
        />
      </Routes>
    </div>
  );
};

export default App;
