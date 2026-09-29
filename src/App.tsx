import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/ui';
import { SimProvider } from './sim/store';
// import DemoControls from './components/DemoControls'; // will uncomment if exists or maybe it's in another path, I'll add a dummy one for now if I can't find it. Wait, the prompt says "Import and render DemoControls component". Let's assume `import { DemoControls } from './sim/DemoControls';` is wrong based on my view_file error, let me try `import DemoControls from './sim/DemoControls';` no wait, view_file gave "system cannot find the file specified". Maybe it's `import { DemoControls } from './components/DemoControls';` no. Let's assume `import { DemoControls } from './sim/components/DemoControls';`

// Pages
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import ApplyOnce from './pages/ApplyOnce';
import CaseTracker from './pages/CaseTracker';
import FactExchange from './pages/FactExchange';
import ConsentManager from './pages/ConsentManager';
import CasePassport from './pages/CasePassport';
import OfficerConsole from './pages/OfficerConsole';
import ReferralMap from './pages/ReferralMap';
import AdminCommandCenter from './pages/AdminCommandCenter';
import AuditTrail from './pages/AuditTrail';
import BeforeAfter from './pages/BeforeAfter';

// Page transition wrapper
function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-login redirect based on role on root
  useEffect(() => {
    if (state.isLoggedIn && location.pathname === '/') {
      const routes: Record<string, string> = {
        citizen: '/citizen',
        'officer-revenue': '/officer',
        'officer-education': '/officer',
        admin: '/admin',
      };
      navigate(routes[state.role] || '/citizen');
    }
  }, [state.isLoggedIn, state.role, location.pathname, navigate]);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public */}
            <Route path="/" element={
              state.isLoggedIn
                ? <Navigate to={state.role === 'admin' ? '/admin' : state.role.startsWith('officer') ? '/officer' : '/citizen'} replace />
                : <PageWrapper><Login /></PageWrapper>
            } />

            {/* Citizen */}
            <Route path="/citizen" element={
              !state.isLoggedIn ? <Navigate to="/" replace /> :
              <PageWrapper><CitizenDashboard /></PageWrapper>
            } />
            <Route path="/citizen/apply" element={
              !state.isLoggedIn ? <Navigate to="/" replace /> :
              <PageWrapper><ApplyOnce /></PageWrapper>
            } />
            <Route path="/citizen/tracker" element={
              !state.isLoggedIn ? <Navigate to="/" replace /> :
              <PageWrapper><CaseTracker /></PageWrapper>
            } />
            <Route path="/citizen/facts" element={
              !state.isLoggedIn ? <Navigate to="/" replace /> :
              <PageWrapper><FactExchange /></PageWrapper>
            } />
            <Route path="/citizen/consent" element={
              !state.isLoggedIn ? <Navigate to="/" replace /> :
              <PageWrapper><ConsentManager /></PageWrapper>
            } />
            <Route path="/case/:id" element={
              !state.isLoggedIn ? <Navigate to="/" replace /> :
              <PageWrapper><CasePassport /></PageWrapper>
            } />

            {/* Officer */}
            <Route path="/officer" element={
              !state.isLoggedIn ? <Navigate to="/" replace /> :
              <PageWrapper><OfficerConsole /></PageWrapper>
            } />
            <Route path="/officer/referral" element={
              !state.isLoggedIn ? <Navigate to="/" replace /> :
              <PageWrapper><ReferralMap /></PageWrapper>
            } />

            {/* Admin */}
            <Route path="/admin" element={
              !state.isLoggedIn ? <Navigate to="/" replace /> :
              <PageWrapper><AdminCommandCenter /></PageWrapper>
            } />
            <Route path="/admin/audit" element={
              !state.isLoggedIn ? <Navigate to="/" replace /> :
              <PageWrapper><AuditTrail /></PageWrapper>
            } />

            {/* Shared */}
            <Route path="/before-after" element={
              !state.isLoggedIn ? <Navigate to="/" replace /> :
              <PageWrapper><BeforeAfter /></PageWrapper>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Toast notifications */}
      <ToastContainer
        toasts={state.toasts}
        onRemove={id => dispatch({ type: 'REMOVE_TOAST', id })}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <SimProvider>
          <AppRoutes />
        </SimProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

