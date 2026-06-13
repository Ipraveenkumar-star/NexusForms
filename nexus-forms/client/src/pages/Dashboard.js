import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AppShell from '../components/AppShell';
import { useAuth } from '../context/AuthContext';

const STATS_COLORS = ['indigo','rose','teal','amber'];
const STATS_ICONS  = ['📋','🔗','📊','✅'];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [forms, setForms]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/forms').then(r => {
      setForms(r.data);
      setLoading(false);
    });
  }, []);

  const totalForms     = forms.length;
  const publishedForms = forms.filter(f => f.isPublished).length;
  const draftForms     = totalForms - publishedForms;

  const stats = [
    { label:'Total Forms',     value: totalForms,     color:'indigo', icon:'📋' },
    { label:'Active Links',    value: publishedForms, color:'teal',   icon:'🔗' },
    { label:'Drafts',          value: draftForms,     color:'amber',  icon:'✏️' },
    { label:'Total Responses', value: '—',            color:'rose',   icon:'📊' },
  ];

  const recent = forms.slice(0, 5);

  return (
    <AppShell title="Dashboard">
      <div className="page-inner">
        {/* Welcome */}
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:'clamp(1.5rem,3vw,2.2rem)', marginBottom:6 }}>
            Good to see you, <span className="gradient-text">{user?.name?.split(' ')[0]} 👋</span>
          </h1>
          <p>Here's what's happening in your Nexus workspace.</p>
        </div>

        {/* REQ-003: Stats grid */}
        <div className="stats-grid">
          {stats.map(s => (
            <div key={s.label} className={`card card-3d stat-card ${s.color}`}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-num">
                {loading ? <span className="spinner" /> : s.value}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display:'flex', gap:12, marginBottom:32, flexWrap:'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/new-form')}>
            ＋ New Form
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/forms')}>
            View All Forms
          </button>
        </div>

        {/* Recent forms */}
        <div className="card" style={{ padding:24 }}>
          <h3 style={{ marginBottom:20 }}>Recent Forms</h3>
          {loading ? (
            <div style={{ textAlign:'center', padding:40 }}>
              <span className="spinner" style={{ width:32, height:32, borderWidth:3 }} />
            </div>
          ) : recent.length === 0 ? (
            <div className="empty-state" style={{ padding:'40px 0' }}>
              <div className="empty-icon">📋</div>
              <div className="empty-title">No forms yet</div>
              <p style={{ marginBottom:20 }}>Create your first form to get started</p>
              <button className="btn btn-primary" onClick={() => navigate('/new-form')}>
                ＋ Create Form
              </button>
            </div>
          ) : (
            <table className="resp-table">
              <thead>
                <tr>
                  <th>Form Title</th>
                  <th>Status</th>
                  <th>Questions</th>
                  <th>Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recent.map(f => (
                  <tr key={f._id} style={{ cursor:'pointer' }} onClick={() => navigate(`/builder/${f._id}`)}>
                    <td style={{ fontWeight:500, color:'var(--t1)' }}>{f.title}</td>
                    <td>
                      <span className={`badge badge-${f.isPublished ? 'green' : 'amber'}`}>
                        {f.isPublished ? '● Live' : '○ Draft'}
                      </span>
                    </td>
                    <td>{f.questions?.length ?? 0} Qs</td>
                    <td>{new Date(f.updatedAt).toLocaleDateString()}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => navigate(`/responses/${f._id}`)}
                      >
                        Responses
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppShell>
  );
}
