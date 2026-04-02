import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import EmployeeAttendance from './pages/EmployeeAttendance';
import StudentAttendance from './pages/StudentAttendance';
import StudentManagement from './pages/StudentManagement';
import UserManagement from './pages/UserManagement';
import Recap from './pages/Recap';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected App Routes */}
          <Route path="/app" element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="absensi-karyawan" element={<EmployeeAttendance />} />
            
            {/* Guru & Admin Only */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'guru']} />}>
              <Route path="absensi-siswa" element={<StudentAttendance />} />
              <Route path="rekap" element={<Recap />} />
            </Route>

            {/* Admin Only */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="data-siswa" element={<StudentManagement />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
