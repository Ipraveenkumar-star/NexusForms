import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AppShell from '../components/AppShell';
import { useToast } from '../context/ToastContext';

export default function FormsPage() {
  const [forms, setForms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast    = useToast();

  const load = () =>
    api.get('/api/forms').then(r => { setForms(r.data); setLoading(false); });

  useEffect(() => { load(); }, []);

  const del = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this form? This cannot be undone.')) return;
    await api.delete(`/api/forms/${id}`);
    toast('Form deleted', 'success');
    load();
  };

  const copyLink = (e, slug) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/f/${slug}`);
    toast('Link copied!', 'success');
  };

  return (
    <AppShell title="My Forms">
      <div className="page-inner">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <h2>My Forms</h2>
            <p style={{ marginTop:4 }}>{forms.length} form{forms.length !== 1 ? 's' : ''} in your workspace</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/new-form')}>
            ＋ New Form
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:80 }}>
            <span className="spinner" style={{ width:36, height:36, borderWidth:3 }} />
          </div>
        ) : forms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">No forms yet</div>
            <p style={{ marginBottom:24 }}>Start by creating your first community form</p>
            <button className="btn btn-primary" onClick={() => navigate('/new-form')}>
              ＋ Create Your First Form
            </button>
          </div>
        ) : (
          <div className="forms-grid">
            {forms.map(f => (
              <div
                key={f._id}
                className="card card-3d form-list-card"
                onClick={() => navigate(`/builder/${f._id}`)}
              >
                {/* Color band */}
                <div style={{
                  height:4, borderRadius:'4px 4px 0 0', marginBottom:16,
                  background:'linear-gradient(90deg, var(--brand), var(--rose))',
                  marginTop:-1, marginLeft:-1, marginRight:-1
                }} />

                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                  <div className="form-card-title">{f.title}</div>
                  <span className={`badge badge-${f.isPublished ? 'green' : 'amber'}`}>
                    {f.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>

                {f.description && (
                  <p style={{ fontSize:13, color:'var(--t3)', margin:'6px 0 12px', lineHeight:1.5,
                    display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden'
                  }}>
                    {f.description}
                  </p>
                )}

                <div className="form-card-meta">
                  <span>📋 {f.questions?.length ?? 0} questions</span>
                  <span>🕐 {new Date(f.updatedAt).toLocaleDateString()}</span>
                </div>

                <div style={{ display:'flex', gap:8, marginTop:16 }} onClick={e => e.stopPropagation()}>
                  <button className="btn btn-secondary btn-xs" onClick={() => navigate(`/responses/${f._id}`)}>
                    📊 Responses
                  </button>
                  {f.isPublished && f.publicSlug && (
                    <button className="btn btn-ghost btn-xs" onClick={e => copyLink(e, f.publicSlug)}>
                      🔗 Copy Link
                    </button>
                  )}
                  <button className="btn btn-danger btn-xs" onClick={e => del(e, f._id)}
                    style={{ marginLeft:'auto' }}>
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
