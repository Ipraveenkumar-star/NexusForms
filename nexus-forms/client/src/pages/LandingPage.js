import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { icon:'📋', title:'Drag-and-Drop Builder',    desc:'8 field types — short text, paragraph, MCQ, checkboxes, dropdowns, ratings, dates, and email.' },
  { icon:'🚀', title:'One-Click Publish',         desc:'Generate a unique shareable link instantly. Community members fill forms without any account.' },
  { icon:'📊', title:'Real-Time Responses',       desc:'Watch submissions come in live with an elegant response dashboard and CSV export.' },
  { icon:'🔒', title:'Secure Admin Access',       desc:'JWT-based auth keeps your data private. Community members access forms anonymously.' },
  { icon:'📱', title:'Fully Responsive',          desc:'Forms look great on any device — mobile, tablet, or desktop.' },
  { icon:'⚡', title:'Auto-Save',                desc:'Your builder work is saved automatically as you type — never lose progress.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight:'100vh', position:'relative', zIndex:1 }}>
      {/* Hero */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'100px 24px 80px', position:'relative' }}>
        {/* Floating orbs */}
        <div style={{ position:'absolute', top:'10%', left:'8%', width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.18), transparent)', animation:'float 6s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'20%', right:'10%', width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle, rgba(244,114,182,0.14), transparent)', animation:'float 8s ease-in-out infinite 2s', pointerEvents:'none' }} />

        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)',
          borderRadius:99, padding:'6px 16px', marginBottom:24,
          fontSize:13, color:'var(--brand-light)', fontWeight:500
        }}>
          ⚡ Community Form Builder
        </div>

        <h1 style={{ maxWidth:700, marginBottom:20 }}>
          Build Beautiful Forms for Your{' '}
          <span className="gradient-text">Community</span>
        </h1>

        <p style={{ fontSize:18, maxWidth:520, marginBottom:40, color:'var(--t2)', lineHeight:1.7 }}>
          Create, publish, and collect responses — all in one stunning workspace. No complexity, no compromise.
        </p>

        <div style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center' }}>
          <button
            className="btn btn-primary"
            style={{ padding:'14px 32px', fontSize:16 }}
            onClick={() => navigate('/register')}
          >
            🚀 Get Started Free
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding:'14px 32px', fontSize:16 }}
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding:'60px 24px 100px', maxWidth:1000, margin:'0 auto' }}>
        <h2 style={{ textAlign:'center', marginBottom:48 }}>
          Everything you need,{' '}
          <span className="gradient-text">nothing you don't</span>
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="card card-3d" style={{ padding:24 }}>
              <div style={{ fontSize:32, marginBottom:12 }}>{f.icon}</div>
              <h3 style={{ marginBottom:8 }}>{f.title}</h3>
              <p style={{ fontSize:14 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop:'1px solid var(--glass-border)', padding:'24px', textAlign:'center', color:'var(--t3)', fontSize:13 }}>
        Nexus Forms — Built for communities
      </div>
    </div>
  );
}
