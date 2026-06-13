import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import AppShell from '../components/AppShell';
import { useToast } from '../context/ToastContext';

export default function ResponsesPage() {
  const { formId } = useParams();
  const navigate   = useNavigate();
  const toast      = useToast();

  const [form,      setForm]      = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState(null);   // expanded response

  useEffect(() => {
    Promise.all([
      api.get(`/api/forms/${formId}`),
      api.get(`/api/responses/${formId}`),
    ]).then(([fRes, rRes]) => {
      setForm(fRes.data);
      setResponses(rRes.data);
      setLoading(false);
    });
  }, [formId]);

  const del = async (id) => {
    if (!window.confirm('Delete this response?')) return;
    await api.delete(`/api/responses/${id}`);
    setResponses(r => r.filter(x => x._id !== id));
    setSelected(null);
    toast('Response deleted', 'success');
  };

  // CSV export
  const exportCSV = () => {
    if (!form || !responses.length) return;
    const headers = ['Submitted At', 'Submitter', ...form.questions.map(q => q.label)];
    const rows = responses.map(r => [
      new Date(r.createdAt).toLocaleString(),
      r.submitter || 'Anonymous',
      ...form.questions.map(q => {
        const ans = r.answers?.find(a => a.qid === q.qid);
        const v   = ans?.value;
        return Array.isArray(v) ? v.join('; ') : (v ?? '');
      }),
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(c => `"${String(c).replace(/"/g,'""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${form.title}-responses.csv`; a.click();
    toast('CSV exported!', 'success');
  };

  return (
    <AppShell title="Responses">
      <div className="page-inner">
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginBottom:28, flexWrap:'wrap' }}>
          <div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginBottom:8, paddingLeft:0 }}
              onClick={() => navigate(`/builder/${formId}`)}
            >
              ← Back to Builder
            </button>
            <h2>{form?.title || 'Responses'}</h2>
            <p style={{ marginTop:4 }}>
              {responses.length} response{responses.length !== 1 ? 's' : ''} collected
            </p>
          </div>
          <button className="btn btn-secondary" onClick={exportCSV} disabled={!responses.length}>
            📥 Export CSV
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:80 }}>
            <span className="spinner" style={{ width:36, height:36, borderWidth:3 }} />
          </div>
        ) : responses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">No responses yet</div>
            <p style={{ marginBottom:24 }}>Share your form link to start collecting responses</p>
            {form?.isPublished && form?.publicSlug && (
              <button
                className="btn btn-primary"
                onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/f/${form.publicSlug}`); toast('Link copied!','success'); }}
              >
                🔗 Copy Share Link
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Stats strip */}
            <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
              {[
                { label:'Total Responses', value:responses.length, color:'var(--brand)' },
                { label:'Today', value:responses.filter(r=>new Date(r.createdAt).toDateString()===new Date().toDateString()).length, color:'var(--teal)' },
                { label:'This Week', value:responses.filter(r=>Date.now()-new Date(r.createdAt)<7*86400000).length, color:'var(--rose)' },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding:'14px 20px', minWidth:120 }}>
                  <div style={{ fontSize:24, fontWeight:700, color:s.color, fontFamily:"'Space Grotesk',sans-serif" }}>{s.value}</div>
                  <div style={{ fontSize:12, color:'var(--t3)', marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="card" style={{ overflow:'auto' }}>
              <table className="resp-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Submitted</th>
                    {form?.questions?.slice(0,3).map(q => (
                      <th key={q.qid} style={{ maxWidth:180 }}>
                        {q.label.length > 30 ? q.label.slice(0,30)+'…' : q.label}
                      </th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((r, i) => (
                    <>
                      <tr
                        key={r._id}
                        style={{ cursor:'pointer' }}
                        onClick={() => setSelected(selected===r._id ? null : r._id)}
                      >
                        <td style={{ color:'var(--t3)' }}>{responses.length - i}</td>
                        <td>{new Date(r.createdAt).toLocaleString()}</td>
                        {form?.questions?.slice(0,3).map(q => {
                          const ans = r.answers?.find(a => a.qid === q.qid);
                          const v   = ans?.value;
                          const display = Array.isArray(v) ? v.join(', ') : (v ?? '—');
                          return (
                            <td key={q.qid} style={{ maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                              {display}
                            </td>
                          );
                        })}
                        <td onClick={e => e.stopPropagation()}>
                          <button className="btn btn-danger btn-xs" onClick={() => del(r._id)}>🗑</button>
                        </td>
                      </tr>
                      {/* Expanded detail */}
                      {selected === r._id && (
                        <tr key={`exp-${r._id}`}>
                          <td colSpan={5 + (form?.questions?.length > 3 ? 0 : 0)} style={{ padding:'0 16px 16px' }}>
                            <div style={{ background:'var(--ink-3)', borderRadius:12, padding:20 }}>
                              <h4 style={{ marginBottom:14, color:'var(--t1)' }}>All Answers</h4>
                              {form?.questions?.map(q => {
                                const ans = r.answers?.find(a => a.qid === q.qid);
                                const v   = ans?.value;
                                const display = Array.isArray(v) ? v.join(', ') : (v ?? '—');
                                return (
                                  <div key={q.qid} style={{ marginBottom:12 }}>
                                    <div style={{ fontSize:12, color:'var(--t3)', marginBottom:3 }}>{q.label}</div>
                                    <div style={{ fontSize:14, color:'var(--t1)' }}>{display || '—'}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
