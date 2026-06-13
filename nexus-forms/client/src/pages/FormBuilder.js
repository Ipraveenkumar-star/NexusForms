import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import AppShell from '../components/AppShell';
import PublishModal from '../components/PublishModal';
import { useToast } from '../context/ToastContext';

const TYPES = [
  { value:'short_text',      label:'Short Text',       icon:'✏️' },
  { value:'paragraph',       label:'Paragraph',        icon:'📝' },
  { value:'multiple_choice', label:'Multiple Choice',  icon:'🔘' },
  { value:'checkbox',        label:'Checkboxes',       icon:'☑️' },
  { value:'dropdown',        label:'Dropdown',         icon:'⌄' },
  { value:'rating',          label:'Star Rating',      icon:'⭐' },
  { value:'date',            label:'Date',             icon:'📅' },
  { value:'email',           label:'Email',            icon:'📧' },
];

function makeQid() { return Math.random().toString(36).slice(2, 10); }

export default function FormBuilder() {
  const { id }   = useParams();
  const toast    = useToast();

  const [form,    setForm]    = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [activeQ, setActiveQ] = useState(null);
  const [showPub, setShowPub] = useState(false);

  // Load form
  useEffect(() => {
    api.get(`/api/forms/${id}`).then(r => setForm(r.data));
  }, [id]);

  const save = useCallback(async (data) => {
    setSaving(true);
    try {
      const { data: updated } = await api.put(`/api/forms/${id}`, data ?? form);
      setForm(updated);
      toast('Saved', 'success');
    } catch {
      toast('Save failed', 'error');
    } finally { setSaving(false); }
  }, [form, id, toast]);

  // Auto-save debounce
  useEffect(() => {
    if (!form) return;
    const t = setTimeout(() => save(form), 1800);
    return () => clearTimeout(t);
  }, [form]); // eslint-disable-line

  const updateMeta = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addQuestion = () => {
    const q = { qid: makeQid(), type:'short_text', label:'', required:false, options:[] };
    setForm(f => ({ ...f, questions:[...f.questions, q] }));
    setActiveQ(q.qid);
  };

  const updateQ = (qid, patch) =>
    setForm(f => ({ ...f, questions: f.questions.map(q => q.qid===qid ? {...q,...patch} : q) }));

  const deleteQ = (qid) => {
    setForm(f => ({ ...f, questions: f.questions.filter(q => q.qid !== qid) }));
    setActiveQ(null);
  };

  const duplicateQ = (qid) => {
    const src = form.questions.find(q => q.qid === qid);
    const copy = { ...src, qid: makeQid() };
    setForm(f => {
      const idx = f.questions.findIndex(q => q.qid === qid);
      const qs  = [...f.questions];
      qs.splice(idx + 1, 0, copy);
      return { ...f, questions: qs };
    });
  };

  const addOption = (qid) =>
    updateQ(qid, { options: [...(form.questions.find(q=>q.qid===qid)?.options||[]), 'Option'] });

  const updateOption = (qid, idx, val) => {
    const opts = [...(form.questions.find(q=>q.qid===qid)?.options||[])];
    opts[idx] = val;
    updateQ(qid, { options: opts });
  };

  const removeOption = (qid, idx) => {
    const opts = (form.questions.find(q=>q.qid===qid)?.options||[]).filter((_,i)=>i!==idx);
    updateQ(qid, { options: opts });
  };

  const handlePublish = async () => {
    const { data } = await api.put(`/api/forms/${id}`, { ...form, isPublished:true });
    setForm(data);
  };

  if (!form) return (
    <AppShell title="Form Builder">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
        <span className="spinner" style={{ width:40, height:40, borderWidth:3 }} />
      </div>
    </AppShell>
  );

  return (
    <AppShell title={form.title || 'Form Builder'}>
      <div className="page-inner" style={{ maxWidth:720 }}>

        {/* Top bar actions */}
        <div style={{ display:'flex', gap:10, marginBottom:24, flexWrap:'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => save(form)} disabled={saving}>
            {saving ? <span className="spinner" /> : '💾'} Save
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowPub(true)}
            style={{ marginLeft:'auto' }}
          >
            🚀 {form.isPublished ? 'Published ✓' : 'Publish'}
          </button>
          {form.isPublished && form.publicSlug && (
            <a
              href={`/f/${form.publicSlug}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-sm"
            >
              👁 Preview
            </a>
          )}
        </div>

        {/* REQ-005: Form title + description */}
        <div className="card" style={{ padding:24, marginBottom:20 }}>
          <div className="field">
            <label className="field-label">Form Title</label>
            <input
              className="input"
              style={{ fontSize:20, fontWeight:700, fontFamily:"'Space Grotesk', sans-serif" }}
              placeholder="Give your form a title…"
              value={form.title}
              onChange={e => updateMeta('title', e.target.value)}
            />
          </div>
          <div className="field" style={{ marginBottom:0 }}>
            <label className="field-label">Description</label>
            <textarea
              className="input"
              placeholder="Optional: describe what this form is for…"
              value={form.description}
              onChange={e => updateMeta('description', e.target.value)}
            />
          </div>
        </div>

        {/* REQ-006: Questions list */}
        {form.questions.map((q, i) => (
          <div
            key={q.qid}
            className={`question-card${activeQ===q.qid ? ' active' : ''}`}
            onClick={() => setActiveQ(q.qid)}
          >
            <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 }}>
              <div className="q-number">{i+1}</div>
              <div style={{ flex:1 }}>
                {/* Label */}
                <input
                  className="input"
                  placeholder="Question text…"
                  value={q.label}
                  onChange={e => updateQ(q.qid, { label: e.target.value })}
                  style={{ marginBottom:10 }}
                />

                {/* REQ-007: Type selector */}
                <select
                  className="input"
                  style={{ width:'auto', minWidth:180 }}
                  value={q.type}
                  onChange={e => updateQ(q.qid, { type:e.target.value, options:[] })}
                >
                  {TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Options for MCQ / checkbox / dropdown */}
            {['multiple_choice','checkbox','dropdown'].includes(q.type) && (
              <div style={{ marginBottom:12, paddingLeft:36 }}>
                {(q.options||[]).map((opt, oi) => (
                  <div key={oi} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <span style={{ fontSize:12, color:'var(--t3)' }}>
                      {q.type==='multiple_choice' ? '◯' : q.type==='checkbox' ? '☐' : `${oi+1}.`}
                    </span>
                    <input
                      className="input"
                      style={{ flex:1, padding:'8px 12px', fontSize:13 }}
                      value={opt}
                      placeholder={`Option ${oi+1}`}
                      onChange={e => updateOption(q.qid, oi, e.target.value)}
                    />
                    <button
                      className="btn btn-danger btn-xs"
                      onClick={() => removeOption(q.qid, oi)}
                    >✕</button>
                  </div>
                ))}
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop:4, paddingLeft:0 }}
                  onClick={() => addOption(q.qid)}
                >
                  ＋ Add Option
                </button>
              </div>
            )}

            {/* Question actions */}
            <div className="q-actions">
              <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13 }}>
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={e => updateQ(q.qid, { required: e.target.checked })}
                  style={{ accentColor:'var(--brand)' }}
                />
                <span style={{ color:'var(--t2)' }}>Required</span>
              </label>
              <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
                <button className="btn btn-ghost btn-xs" onClick={() => duplicateQ(q.qid)}>📋 Duplicate</button>
                <button className="btn btn-danger btn-xs" onClick={() => deleteQ(q.qid)}>🗑 Delete</button>
              </div>
            </div>
          </div>
        ))}

        {/* REQ-006: Add Question button */}
        <button
          className="btn btn-secondary"
          style={{
            width:'100%', justifyContent:'center',
            border:'2px dashed var(--glass-border)',
            background:'transparent', marginTop:4, padding:'16px'
          }}
          onClick={addQuestion}
        >
          ＋ Add Question
        </button>

        {/* Status indicator */}
        <div style={{ textAlign:'center', color:'var(--t3)', fontSize:12, marginTop:16 }}>
          {saving ? '⏳ Saving…' : '✓ All changes saved'}
        </div>
      </div>

      {showPub && (
        <PublishModal
          form={form}
          onClose={() => setShowPub(false)}
          onPublish={handlePublish}
        />
      )}
    </AppShell>
  );
}
