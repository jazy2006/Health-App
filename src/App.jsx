import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import SymptomChecker from './pages/SymptomChecker';
import DoctorBooking from './pages/DoctorBooking';
import VideoConsultation from './pages/VideoConsultation';
import MentalHealth from './pages/MentalHealth';
import FamilySharing from './pages/FamilySharing';
import ActivityHistory from './pages/ActivityHistory';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('patient');

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={(role) => { setIsAuthenticated(true); setUserRole(role); }} />}
        />

        {isAuthenticated ? (
          <Route path="/" element={<DashboardLayout userRole={userRole} onLogout={() => setIsAuthenticated(false)} />}>
            <Route index element={<DashboardPage userRole={userRole} />} />
            <Route path="symptoms" element={<SymptomChecker />} />
            <Route path="booking" element={<DoctorBooking />} />
            <Route path="consultation" element={<VideoConsultation />} />
            <Route path="mental-health" element={<MentalHealth />} />
            <Route path="family" element={<FamilySharing />} />
            <Route path="history" element={<ActivityHistory />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
