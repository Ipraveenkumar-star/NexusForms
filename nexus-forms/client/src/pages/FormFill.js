import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function FormFill() {
  const { slug } = useParams();

  const [form,     setForm]     = useState(null);
  const [answers,  setAnswers]  = useState({});
  const [loading,  setLoading]  = useState(true);
  const [submitting, setSubmit] = useState(false);
  const [done,     setDone]     = useState(false);
  const [errors,   setErrors]   = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Try slug-based lookup (published forms)
    api.get(`/api/forms/slug/${slug}`)
      .then(r => { setForm(r.data); setLoading(false); })
      .catch(() => {
        // Fallback: direct ID
        api.get(`/api/forms/${slug}`)
          .then(r => { setForm(r.data); setLoading(false); })
          .catch(() => { setNotFound(true); setLoading(false); });
      });
  }, [slug]);

  const setAnswer = (qid, value) =>
    setAnswers(a => ({ ...a, [qid]: value }));

  const toggleCheckbox = (qid, option) => {
    const cur = answers[qid] || [];
    const next = cur.includes(option)
      ? cur.filter(x => x !== option)
      : [...cur, option];
    setAnswer(qid, next);
  };

  const submit = async () => {
    // Validate required fields
    const missing = form.questions
      .filter(q => q.required)
      .filter(q => {
        const v = answers[q.qid];
        return !v || (Array.isArray(v) && !v.length) || v === '';
      });

    if (missing.length) {
      setErrors(missing.map(q => q.qid));
      const first = document.getElementById(`q-${missing[0].qid}`);
      first?.scrollIntoView({ behavior:'smooth', block:'center' });
      return;
    }

    setErrors([]);
    setSubmit(true);
    try {
      const payload = {
        formId: form._id,
        answers: form.questions.map(q => ({
          qid: q.qid,
          label: q.label,
          value: answers[q.qid] ?? null,
        })),
      };
      await api.post('/api/responses', payload);
      setDone(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally { setSubmit(false); }
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span className="spinner" style={{ width:40, height:40, borderWidth:3 }} />
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🔍</div>
        <h2>Form not found</h2>
        <p style={{ marginTop:8 }}>This form may have been closed or the link is incorrect.</p>
      </div>
    </div>
  );

  if (done) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ textAlign:'center', maxWidth:400 }}>
        <div style={{
          fontSize:80, marginBottom:20,
          animation:'float 3s ease-in-out infinite'
        }}>🎉</div>
        <h2 style={{ marginBottom:10 }}>Response submitted!</h2>
        <p>Thank you for filling out <strong>{form.title}</strong>. Your response has been recorded.</p>
        <button
          className="btn btn-primary"
          style={{ marginTop:28 }}
          onClick={() => { setDone(false); setAnswers({}); }}
        >
          Submit another response
        </button>
      </div>
    </div>
  );

  return (
    <div className="public-form-wrap" style={{ position:'relative', zIndex:1 }}>
      {/* Background decorations */}
      <div style={{
        position:'fixed', top:'10%', right:'5%',
        width:280, height:280, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(99,102,241,0.1), transparent)',
        pointerEvents:'none', animation:'float 7s ease-in-out infinite'
      }} />

      <div className="public-form-card" style={{ animation:'modalIn 0.5s cubic-bezier(0.4,0,0.2,1)' }}>
        <div className="form-header-band" />
        <div className="public-form-body">
          {/* Header */}
          <h2 style={{ fontSize:'clamp(1.4rem,3vw,1.8rem)', marginBottom:10 }}>{form.title}</h2>
          {form.description && (
            <p style={{ fontSize:14, marginBottom:24, lineHeight:1.7 }}>{form.description}</p>
          )}

          <div className="divider" />

          {/* Questions */}
          {form.questions.map((q, i) => (
            <div key={q.qid} id={`q-${q.qid}`} className="public-question">
              <div className="public-q-label">
                <span>{i+1}.</span>
                <span>{q.label}</span>
                {q.required && <span className="req-star">*</span>}
              </div>

              {errors.includes(q.qid) && (
                <div style={{ fontSize:12, color:'var(--rose)', marginBottom:8 }}>
                  ⚠ This field is required
                </div>
              )}

              {/* Short text */}
              {q.type === 'short_text' && (
                <input
                  className={`input${errors.includes(q.qid) ? ' input-error' : ''}`}
                  placeholder="Your answer…"
                  value={answers[q.qid]||''}
                  onChange={e => setAnswer(q.qid, e.target.value)}
                  style={errors.includes(q.qid) ? { borderColor:'var(--rose)' } : {}}
                />
              )}

              {/* Email */}
              {q.type === 'email' && (
                <input
                  className="input" type="email"
                  placeholder="your@email.com"
                  value={answers[q.qid]||''}
                  onChange={e => setAnswer(q.qid, e.target.value)}
                  style={errors.includes(q.qid) ? { borderColor:'var(--rose)' } : {}}
                />
              )}

              {/* Paragraph */}
              {q.type === 'paragraph' && (
                <textarea
                  className="input"
                  placeholder="Your detailed answer…"
                  value={answers[q.qid]||''}
                  onChange={e => setAnswer(q.qid, e.target.value)}
                  style={errors.includes(q.qid) ? { borderColor:'var(--rose)' } : {}}
                />
              )}

              {/* Date */}
              {q.type === 'date' && (
                <input
                  className="input" type="date"
                  value={answers[q.qid]||''}
                  onChange={e => setAnswer(q.qid, e.target.value)}
                />
              )}

              {/* Multiple choice */}
              {q.type === 'multiple_choice' && q.options?.map(opt => (
                <div
                  key={opt}
                  className={`option-row${answers[q.qid]===opt ? ' selected' : ''}`}
                  onClick={() => setAnswer(q.qid, opt)}
                >
                  <div className={`option-dot${answers[q.qid]===opt ? ' filled' : ''}`}>
                    {answers[q.qid]===opt && <span style={{ width:8, height:8, background:'#fff', borderRadius:'50%', display:'block' }} />}
                  </div>
                  <span style={{ fontSize:14 }}>{opt}</span>
                </div>
              ))}

              {/* Checkbox */}
              {q.type === 'checkbox' && q.options?.map(opt => {
                const checked = (answers[q.qid]||[]).includes(opt);
                return (
                  <div
                    key={opt}
                    className={`option-row${checked ? ' selected' : ''}`}
                    onClick={() => toggleCheckbox(q.qid, opt)}
                  >
                    <div className={`option-box${checked ? ' checked' : ''}`}>
                      {checked && <span style={{ fontSize:11, color:'#fff' }}>✓</span>}
                    </div>
                    <span style={{ fontSize:14 }}>{opt}</span>
                  </div>
                );
              })}

              {/* Dropdown */}
              {q.type === 'dropdown' && (
                <select
                  className="input"
                  value={answers[q.qid]||''}
                  onChange={e => setAnswer(q.qid, e.target.value)}
                >
                  <option value="">— Select an option —</option>
                  {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              )}

              {/* Rating */}
              {q.type === 'rating' && (
                <div className="star-row">
                  {[1,2,3,4,5].map(n => (
                    <span
                      key={n}
                      className={`star${(answers[q.qid]||0) >= n ? ' lit' : ''}`}
                      onClick={() => setAnswer(q.qid, n)}
                      onMouseEnter={e => {
                        e.currentTarget.parentNode.querySelectorAll('.star').forEach((s,i) => {
                          s.style.filter = i < n ? 'none' : 'grayscale(1) opacity(0.4)';
                        });
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.parentNode.querySelectorAll('.star').forEach((s,i) => {
                          s.style.filter = i < (answers[q.qid]||0) ? 'none' : 'grayscale(1) opacity(0.4)';
                        });
                      }}
                    >⭐</span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Submit */}
          <div style={{ marginTop:32 }}>
            <button
              className="btn btn-primary"
              style={{ width:'100%', justifyContent:'center', padding:'14px' }}
              onClick={submit}
              disabled={submitting}
            >
              {submitting ? <span className="spinner" /> : '🚀 Submit Response'}
            </button>
            <p style={{ fontSize:12, textAlign:'center', marginTop:10, color:'var(--t3)' }}>
              Fields marked with * are required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
