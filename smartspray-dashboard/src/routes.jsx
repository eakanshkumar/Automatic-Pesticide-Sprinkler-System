import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import FarmsList from './pages/Farms/FarmsList';
import FarmDetail from './pages/Farms/FarmDetail';
import FarmCreate from './pages/Farms/FarmCreate';
import SprayEvents from './pages/Spray/SprayEvents';
import SprayControl from './pages/Spray/SprayControl';
import Schedule from './pages/Spray/Schedule';
import Analytics from './pages/Analytics/Analytics';
import Reports from './pages/Analytics/Reports';
import Export from './pages/Analytics/Export';
import Notifications from './pages/Notifications/Notifications';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Profile/Settings';
import Subscription from './pages/Profile/Subscription';
import Users from './pages/Admin/Users';
import System from './pages/Admin/System';
import Logs from './pages/Admin/Logs';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/farms" element={<FarmsList />} />
                <Route path="/farms/:id" element={<FarmDetail />} />
                <Route path="/farms/create" element={<FarmCreate />} />
                <Route path="/spray/events" element={<SprayEvents />} />
                <Route path="/spray/control" element={<SprayControl />} />
                <Route path="/spray/schedule" element={<Schedule />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/analytics/reports" element={<Reports />} />
                <Route path="/analytics/export" element={<Export />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/subscription" element={<Subscription />} />
                
                {/* Admin routes */}
                <Route path="/admin/users" element={
                  <ProtectedRoute requiredRole="admin">
                    <Users />
                  </ProtectedRoute>
                } />
                <Route path="/admin/system" element={
                  <ProtectedRoute requiredRole="admin">
                    <System />
                  </ProtectedRoute>
                } />
                <Route path="/admin/logs" element={
                  <ProtectedRoute requiredRole="admin">
                    <Logs />
                  </ProtectedRoute>
                } />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;