import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import PatientFormPage from './pages/PatientFormPage';
import PatientDetailPage from './pages/PatientDetailPage';
import CuestionarioPage from './pages/CuestionarioPage';
import AppointmentsPage from './pages/AppointmentsPage';
import UsersPage from './pages/UsersPage';
import UserFormPage from './pages/UserFormPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Patients routes */}
            <Route
              path="/patients"
              element={
                <ProtectedRoute requiredRoles={['admin', 'recepcion', 'estudiante', 'docente']}>
                  <PatientsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/new"
              element={
                <ProtectedRoute requiredRoles={['admin', 'recepcion']}>
                  <PatientFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/:id"
              element={
                <ProtectedRoute requiredRoles={['admin', 'recepcion', 'estudiante', 'docente']}>
                  <PatientDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/:id/edit"
              element={
                <ProtectedRoute requiredRoles={['admin', 'recepcion']}>
                  <PatientFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/:pacienteId/cuestionario"
              element={
                <ProtectedRoute requiredRoles={['admin', 'recepcion', 'estudiante', 'docente']}>
                  <CuestionarioPage />
                </ProtectedRoute>
              }
            />

            {/* Appointments routes */}
            <Route
              path="/appointments"
              element={
                <ProtectedRoute requiredRoles={['admin', 'recepcion', 'estudiante', 'docente']}>
                  <AppointmentsPage />
                </ProtectedRoute>
              }
            />

            {/* Users routes */}
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/new"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <UserFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id/edit"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <UserFormPage />
                </ProtectedRoute>
              }
            />

            {/* Settings routes - placeholder */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Configuración</h1>
                    <p className="text-gray-600 mt-2">Próximamente...</p>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Redirect to dashboard for authenticated users */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
