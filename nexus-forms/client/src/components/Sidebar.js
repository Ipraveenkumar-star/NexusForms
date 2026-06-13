import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/forms',     icon: '📋', label: 'My Forms'  },
  { to: '/new-form',  icon: '＋', label: 'New Form'  },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 99,
            background: 'rgba(7,7,26,0.6)',
            display: 'none',
          }}
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar${open ? '' : ' collapsed'}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">⚡</div>
          <div className="logo-text">Nexus<span>Forms</span></div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {LINKS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => window.innerWidth < 768 && onClose()}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}

          <div className="nav-section-label" style={{ marginTop: 12 }}>Account</div>
          <button className="nav-link" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Sign Out
          </button>
        </nav>

        {/* Footer user chip */}
        {user && (
          <div className="sidebar-footer">
            <div className="user-chip">
              <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
              <div>
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
