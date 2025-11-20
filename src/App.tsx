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
import CuestionarioCompletePage from './pages/CuestionarioCompletePage';
import AppointmentsPage from './pages/AppointmentsPage';
import AtencionesPage from './pages/AtencionesPage';
import UsersPage from './pages/UsersPage';
import UserFormPage from './pages/UserFormPage';

// Admin Pages
import EspecialidadesPage from './pages/admin/EspecialidadesPage';
import HorariosClinicaPage from './pages/admin/HorariosClinicaPage';
import FranjasHorariasPage from './pages/admin/FranjasHorariasPage';
import CitasPage from './pages/admin/CitasPage';

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
            <Route
              path="/patients/:pacienteId/historia-completa"
              element={
                <ProtectedRoute requiredRoles={['admin', 'recepcion', 'estudiante', 'docente']}>
                  <CuestionarioCompletePage />
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

            {/* Atenciones routes */}
            <Route
              path="/atenciones"
              element={
                <ProtectedRoute requiredRoles={['admin', 'estudiante', 'docente']}>
                  <AtencionesPage />
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

            {/* Admin routes */}
            <Route
              path="/admin/especialidades"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <EspecialidadesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/horarios-clinica"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <HorariosClinicaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/franjas-horarias"
              element={
                <ProtectedRoute requiredRoles={['admin', 'docente']}>
                  <FranjasHorariasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/citas"
              element={
                <ProtectedRoute requiredRoles={['admin', 'recepcion', 'docente']}>
                  <CitasPage />
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
