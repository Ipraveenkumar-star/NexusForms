import { useState } from 'react';
import Sidebar from './Sidebar';

export default function AppShell({ title, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="app-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className={`main-content${open ? ' ml-260' : ''}`}>
        {/* Top bar with hamburger — REQ-002 */}
        <div className="topbar">
          <button
            className="hamburger"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle sidebar"
          >
            <span className="ham-line" style={open ? { transform: 'rotate(45deg) translate(5px,5px)' } : {}} />
            <span className="ham-line" style={open ? { opacity: 0 } : {}} />
            <span className="ham-line" style={open ? { transform: 'rotate(-45deg) translate(5px,-5px)' } : {}} />
          </button>
          <span className="topbar-title">{title}</span>
        </div>

        <div className="page-enter">{children}</div>
      </div>
    </div>
  );
}
