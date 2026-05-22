import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { SkeletonCard } from '../components/ui/Skeleton';
import { ROLES } from '../contexts/AuthContext';

const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const RoleDashboard = lazy(() => import('../pages/dashboard/RoleDashboard'));
const PatientManagement = lazy(() => import('../pages/patients/PatientManagement'));
const DoctorManagement = lazy(() => import('../pages/doctors/DoctorManagement'));
const Appointments = lazy(() => import('../pages/appointments/Appointments'));
const PharmacyBilling = lazy(() => import('../pages/pharmacy/PharmacyBilling'));
const AIHealthAnalytics = lazy(() => import('../pages/analytics/AIHealthAnalytics'));
const ActivityLogs = lazy(() => import('../pages/activity/ActivityLogs'));
const Settings = lazy(() => import('../pages/settings/Settings'));

function PageLoader() {
  return (
    <div className="loading-page">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<RoleDashboard />} />
          <Route
            path="patients"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST]}>
                <PatientManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="doctors"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.RECEPTIONIST]}>
                <DoctorManagement />
              </ProtectedRoute>
            }
          />
          <Route path="appointments" element={<Appointments />} />
          <Route
            path="pharmacy"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.RECEPTIONIST]}>
                <PharmacyBilling />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR]}>
                <AIHealthAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="activity"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN]}>
                <ActivityLogs />
              </ProtectedRoute>
            }
          />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
