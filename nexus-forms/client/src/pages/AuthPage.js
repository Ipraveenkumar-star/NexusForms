import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AuthPage() {
  const [mode, setMode]     = useState('login');   // 'login' | 'register'
  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login }   = useAuth();
  const toast       = useToast();
  const navigate    = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const { data } = await api.post(endpoint, form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      toast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Floating decorative orbs */}
      <div style={{
        position:'fixed', top:'15%', left:'10%',
        width:300, height:300, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(99,102,241,0.12), transparent)',
        animation:'float 6s ease-in-out infinite', pointerEvents:'none'
      }} />
      <div style={{
        position:'fixed', bottom:'20%', right:'8%',
        width:240, height:240, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(244,114,182,0.09), transparent)',
        animation:'float 8s ease-in-out infinite 2s', pointerEvents:'none'
      }} />

      <div className="auth-card">
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            width:56, height:56, borderRadius:16,
            background:'linear-gradient(135deg, #6366f1, #4f52cc)',
            fontSize:28, marginBottom:16,
            boxShadow:'0 8px 32px rgba(99,102,241,0.35)'
          }}>⚡</div>
          <h2 style={{ marginBottom:4 }}>
            <span className="gradient-text">Nexus Forms</span>
          </h2>
          <p style={{ fontSize:14 }}>
            {mode === 'login' ? 'Welcome back — sign in to your workspace' : 'Create your admin account'}
          </p>
        </div>

        <form onSubmit={submit}>
          {mode === 'register' && (
            <div className="field">
              <label className="field-label">Full Name</label>
              <input
                className="input"
                placeholder="Your name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
              />
            </div>
          )}

          <div className="field">
            <label className="field-label">Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <input
              className="input"
              type="password"
              placeholder={mode === 'register' ? 'Minimum 6 characters' : 'Your password'}
              value={form.password}
              onChange={e => set('password', e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width:'100%', justifyContent:'center', marginTop:8 }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : mode === 'login' ? '🔐 Sign In' : '🚀 Create Account'}
          </button>
        </form>

        <div className="divider" />

        <p style={{ textAlign:'center', fontSize:14, color:'var(--t3)' }}>
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{ background:'none', border:'none', color:'var(--brand-light)', cursor:'pointer', fontWeight:600, fontSize:14 }}
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
