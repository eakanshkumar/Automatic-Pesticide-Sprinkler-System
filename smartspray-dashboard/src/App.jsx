import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// Context Providers
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Layout Components
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Pages
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import FarmsList from './pages/Farms/FarmsList'
import FarmDetail from './pages/Farms/FarmDetail'
import FarmCreate from './pages/Farms/FarmCreate'
import SprayEvents from './pages/Spray/SprayEvents'
import SprayControl from './pages/Spray/SprayControl'
import Schedule from './pages/Spray/Schedule'
import Analytics from './pages/Analytics/Analytics'
import Reports from './pages/Analytics/Reports'
import Export from './pages/Analytics/Export'
import Notifications from './pages/Notifications/Notifications'
import Profile from './pages/Profile/Profile'
import Settings from './pages/Profile/Settings'
import Subscription from './pages/Profile/Subscription'
import Users from './pages/Admin/Users'
import System from './pages/Admin/System'
import Logs from './pages/Admin/Logs'
import ImageUpload from './pages/Profile/ImageUpload';
import DiseaseDetection from './pages/Disease/DiseaseDetection';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// PublicRoute wrapper → prevents logged-in users from visiting login/register
function PublicRoute({ children }) {
  const { user } = useAuth()
  if (user) {
    return <Navigate to="/" replace />
  }
  return children
}

// Logout component → clears auth state and redirects
function Logout() {
  const { logout } = useAuth()
  React.useEffect(() => {
    logout()
  }, [logout])
  return <Navigate to="/login" replace />
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <Router
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <div className="App min-h-screen bg-gray-50">
                  <Routes>
                    {/* Public routes */}
                    <Route
                      path="/login"
                      element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <PublicRoute>
                          <Register />
                        </PublicRoute>
                      }
                    />

                    {/* Logout route */}
                    <Route path="/logout" element={<Logout />} />

                    {/* Protected routes */}
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
                              <Route path="/profile/upload-image" element={<ImageUpload />} />
                              <Route path="/settings" element={<Settings />} />
                              <Route path="/subscription" element={<Subscription />} />
                              <Route path="/admin/users" element={<Users />} />
                              <Route path="/admin/system" element={<System />} />
                              <Route path="/admin/logs" element={<Logs />} />
                              <Route path="/disease-detection" element={<DiseaseDetection />} />
                            </Routes>
                          </Layout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch-all: redirect to login */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                  </Routes>

                  {/* Global toaster */}
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#363636',
                        color: '#fff',
                      },
                    }}
                  />
                </div>
              </Router>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App