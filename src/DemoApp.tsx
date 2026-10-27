import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSession } from '@/store/session';
import { Layout } from '@/components/layout';
import { Login } from '@/pages/Auth/Login';
import { DemoReceipt } from '@/pages/Auth/Receipt';
import { StudentDashboard } from '@/pages/Student/Dashboard';
import { Discovery } from '@/pages/Student/Discovery';
import { Wallet } from '@/pages/Student/Wallet';
import { ApplicationPage } from '@/pages/Student/Application';
import { Apply } from '@/pages/Student/Apply';
import { StudentProfile, FamilyAccess, SavedChanges } from '@/pages/Student/Account';
import { History } from '@/pages/Student/History';
import { GrievancePage } from '@/pages/Student/Grievance';
import { ReviewQueue } from '@/pages/Officer/ReviewQueue';
import { CoverageGap } from '@/pages/Officer/CoverageGap';
import { NotificationsAdmin } from '@/pages/Officer/NotificationsAdmin';
import { AuditLog } from '@/pages/Officer/AuditLog';
import { SvgGallery } from '@/pages/Mockups/SvgGallery';

// ============================================================
// Route table: role-gated portals.
// ============================================================

function Protected({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user } = useSession();
  if (!user) return <Navigate to="/login" replace />;
  if ((role === 'officer' && user.role === 'student') || (role && role !== 'officer' && user.role !== role)) {
    return <Navigate to={user.role === 'student' ? '/student' : '/officer'} replace />;
  }
  return <>{children}</>;
}

export default function DemoApp() {
  const { user, initSession } = useSession();

  useEffect(() => {
    initSession();
  }, [initSession]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/recover" element={<Login />} />
        <Route path="/receipt" element={<DemoReceipt />} />
        <Route
          element={
            user ? (
              <Layout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/student" element={<Protected role="student"><StudentDashboard /></Protected>} />
          <Route path="/student/discovery" element={<Protected role="student"><Discovery /></Protected>} />
          <Route path="/student/wallet" element={<Protected role="student"><Wallet /></Protected>} />
          <Route path="/student/application" element={<Protected role="student"><ApplicationPage /></Protected>} />
          <Route path="/student/application/new" element={<Protected role="student"><Apply /></Protected>} />
          <Route path="/student/profile" element={<Protected role="student"><StudentProfile /></Protected>} />
          <Route path="/student/family" element={<Protected role="student"><FamilyAccess /></Protected>} />
          <Route path="/student/offline" element={<Protected role="student"><SavedChanges /></Protected>} />
          <Route path="/student/history" element={<Protected role="student"><History /></Protected>} />
          <Route path="/student/grievance" element={<Protected role="student"><GrievancePage /></Protected>} />
          <Route path="/officer" element={<Protected role="officer"><ReviewQueue /></Protected>} />
          <Route path="/officer/inspection" element={<Protected role="officer"><ReviewQueue /></Protected>} />
          <Route path="/officer/sanction" element={<Protected role="officer"><ReviewQueue /></Protected>} />
          <Route path="/officer/testing" element={<Protected role="officer"><ReviewQueue /></Protected>} />
          <Route path="/officer/coverage" element={<Protected role="officer"><CoverageGap /></Protected>} />
          <Route path="/officer/broadcasts" element={<Protected role="officer"><NotificationsAdmin /></Protected>} />
          <Route path="/officer/grievances" element={<Protected role="officer"><GrievancePage /></Protected>} />
          <Route path="/officer/audit" element={<Protected role="officer"><AuditLog /></Protected>} />
          <Route path="/mockups" element={<SvgGallery />} />
          <Route path="/student/mockups" element={<Protected role="student"><SvgGallery /></Protected>} />
          <Route path="/officer/mockups" element={<Protected role="officer"><SvgGallery /></Protected>} />
          <Route path="*" element={<Navigate to={user?.role === 'student' ? '/student' : '/officer'} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
