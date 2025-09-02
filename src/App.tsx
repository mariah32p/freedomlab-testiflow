import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useRouteGuard } from './hooks/useRouteGuard';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Pricing } from './pages/Pricing.tsx';
import { Success } from './pages/Success.tsx';
import { Settings } from './pages/Settings';
import { GetStarted } from './pages/GetStarted';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Forms } from './pages/Forms';
import { Testimonials } from './pages/Testimonials';
import { SubmitTestimonial } from './pages/SubmitTestimonial';
import { Branding } from './pages/Branding';
import { Demo } from './pages/Demo';
import { Tags } from './pages/Tags';
import { TestEmailNotification } from './pages/TestEmailNotification';

const AppContent: React.FC = () => {
  useRouteGuard();

  return (
    <Routes>
      {/* Public form submission - no navbar */}
      <Route path="/submit/:formId" element={<SubmitTestimonial />} />
      
      {/* Demo route - custom header */}
      <Route path="/demo" element={<Demo />} />
      
      {/* All other routes with navbar */}
      <Route path="/*" element={
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/success" element={<Success />} />
            <Route
              path="/forms"
              element={
                <ProtectedRoute>
                  <Forms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/branding"
              element={
                <ProtectedRoute>
                  <Branding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tags"
              element={
                <ProtectedRoute>
                  <Tags />
                </ProtectedRoute>
              }
            />
            <Route
              path="/testimonials"
              element={
                <ProtectedRoute>
                  <Testimonials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-email"
              element={
                <ProtectedRoute>
                  <TestEmailNotification />
                </ProtectedRoute>
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
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;