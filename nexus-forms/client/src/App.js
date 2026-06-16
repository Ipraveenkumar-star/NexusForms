import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import LandingPage   from './pages/LandingPage';
import AuthPage      from './pages/AuthPage';
import Dashboard     from './pages/Dashboard';
import FormsPage     from './pages/FormsPage';
import NewFormPage   from './pages/NewFormPage';
import FormBuilder   from './pages/FormBuilder';
import FormFill      from './pages/FormFill';
import ResponsesPage from './pages/ResponsesPage';

// Protect authenticated routes
function Private({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <span className="spinner" style={{ width:40, height:40, borderWidth:3 }} />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

// Redirect logged-in users away from auth pages
function Guest({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
    const [theme, setTheme] = useState(localStorage.getItem('nf_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nf_theme', theme);
  }, [theme]);
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public */}
            <Route path="/"  element={<LandingPage />} />
            <Route path="/login"    element={<Guest><AuthPage /></Guest>} />
            <Route path="/register" element={<Guest><AuthPage /></Guest>} />

            {/* Public form fill (REQ-010) */}
            <Route path="/f/:slug" element={<FormFill />} />

            {/* Protected admin routes */}
            <Route path="/dashboard"        element={<Private><Dashboard /></Private>} />
            <Route path="/forms"            element={<Private><FormsPage /></Private>} />
            <Route path="/new-form"         element={<Private><NewFormPage /></Private>} />
            <Route path="/builder/:id"      element={<Private><FormBuilder /></Private>} />
            <Route path="/responses/:formId" element={<Private><ResponsesPage /></Private>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
             <button
            className="theme-toggle"
            style={{ position:'fixed', bottom:20, right:20, zIndex:500 }}
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
