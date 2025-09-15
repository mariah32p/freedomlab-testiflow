import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OutsetaAuthProvider } from './contexts/OutsetaAuthContext';
import { OutsetaProtectedRoute } from './components/OutsetaProtectedRoute';
import { useOutsetaRouteGuard } from './hooks/useOutsetaRouteGuard';
import { OutsetaNavbar } from './components/OutsetaNavbar';
import { Home } from './pages/Home';
import { OutsetaHome } from './pages/OutsetaHome';
import { Dashboard } from './pages/Dashboard';
import { OutsetaPricing } from './pages/OutsetaPricing';
import { OutsetaLogin } from './pages/OutsetaLogin';
import { BillingUpdate } from './pages/BillingUpdate';
import { Paywall } from './pages/Paywall';
import { Forms } from './pages/Forms';
import { Testimonials } from './pages/Testimonials';
import { SubmitTestimonial } from './pages/SubmitTestimonial';
import { Branding } from './pages/Branding';
import { Demo } from './pages/Demo';
import { Tags } from './pages/Tags';

const AppContent: React.FC = () => {
  useOutsetaRouteGuard();

  return (
    <Routes>
      {/* Public form submission - no navbar */}
      <Route path="/submit/:formId" element={<SubmitTestimonial />} />
      
      {/* Demo route - custom header */}
      <Route path="/demo" element={<Demo />} />
      
      {/* All other routes with navbar */}
      <Route path="/*" element={
        <div className="min-h-screen bg-gray-50">
          <OutsetaNavbar />
          <Routes>
            <Route path="/" element={<OutsetaHome />} />
            <Route path="/pricing" element={<OutsetaPricing />} />
            <Route path="/login" element={<OutsetaLogin />} />
            <Route path="/billing-update" element={<BillingUpdate />} />
            <Route path="/paywall" element={<Paywall />} />
            <Route
              path="/forms"
              element={
                <OutsetaProtectedRoute>
                  <Forms />
                </OutsetaProtectedRoute>
              }
            />
            <Route
              path="/branding"
              element={
                <OutsetaProtectedRoute>
                  <Branding />
                </OutsetaProtectedRoute>
              }
            />
            <Route
              path="/tags"
              element={
                <OutsetaProtectedRoute>
                  <Tags />
                </OutsetaProtectedRoute>
              }
            />
            <Route
              path="/testimonials"
              element={
                <OutsetaProtectedRoute>
                  <Testimonials />
                </OutsetaProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <OutsetaProtectedRoute>
                  <Dashboard />
                </OutsetaProtectedRoute>
              }
            />
          </Routes>
        </div>
      } />
    </Routes>
  );
};

function App() {
  return (
    <OutsetaAuthProvider>
      <Router>
        <AppContent />
      </Router>
    </OutsetaAuthProvider>
  );
}

export default App;