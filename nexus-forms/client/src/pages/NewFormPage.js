import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AppShell from '../components/AppShell';
import { useToast } from '../context/ToastContext';

const TEMPLATES = [
  {
    id:'blank', emoji:'✨', name:'Blank Form',
    desc:'Start from scratch with a clean canvas',
    blank:true,
    data:{ title:'Untitled Form', description:'', questions:[] }
  },
  {
    id:'feedback', emoji:'💬', name:'Community Feedback',
    desc:'Collect satisfaction ratings and suggestions',
    data:{
      title:'Community Feedback', description:'Help us improve by sharing your thoughts.',
      questions:[
        { qid:'q1', type:'short_text',      label:'Your name',                         required:true,  options:[] },
        { qid:'q2', type:'multiple_choice', label:'How satisfied are you overall?',    required:true,  options:['Very Satisfied','Satisfied','Neutral','Unsatisfied'] },
        { qid:'q3', type:'rating',          label:'Rate your experience (1–5)',        required:false, options:[] },
        { qid:'q4', type:'paragraph',       label:'Any suggestions for improvement?',  required:false, options:[] },
      ]
    }
  },
  {
    id:'event', emoji:'📅', name:'Event Registration',
    desc:'Capture attendee info for events',
    data:{
      title:'Event Registration', description:'Register your spot for our upcoming event.',
      questions:[
        { qid:'q1', type:'short_text',      label:'Full Name',        required:true,  options:[] },
        { qid:'q2', type:'email',           label:'Email Address',    required:true,  options:[] },
        { qid:'q3', type:'dropdown',        label:'Select Session',   required:true,  options:['Morning (9AM–12PM)','Afternoon (1PM–4PM)','Full Day'] },
        { qid:'q4', type:'checkbox',        label:'Dietary needs',    required:false, options:['Vegetarian','Vegan','Gluten-free','No preference'] },
        { qid:'q5', type:'paragraph',       label:'Anything else?',   required:false, options:[] },
      ]
    }
  },
  {
    id:'survey', emoji:'📊', name:'Quick Survey',
    desc:'Short opinion poll for your community',
    data:{
      title:'Community Survey', description:'Your opinion matters — this takes 2 minutes.',
      questions:[
        { qid:'q1', type:'multiple_choice', label:'How did you hear about us?',       required:true,  options:['Social Media','Friend','Email','Other'] },
        { qid:'q2', type:'rating',          label:'Rate our community (1–5)',          required:true,  options:[] },
        { qid:'q3', type:'checkbox',        label:'What topics interest you?',         required:false, options:['Events','Workshops','Networking','Online Discussions'] },
        { qid:'q4', type:'paragraph',       label:'What would you like to see more of?', required:false, options:[] },
      ]
    }
  },
  {
    id:'contact', emoji:'📬', name:'Contact Form',
    desc:'Simple way for members to reach you',
    data:{
      title:'Contact Us', description:'Get in touch — we typically respond within 24 hours.',
      questions:[
        { qid:'q1', type:'short_text', label:'Your Name',      required:true,  options:[] },
        { qid:'q2', type:'email',      label:'Email Address',  required:true,  options:[] },
        { qid:'q3', type:'dropdown',   label:'Subject',        required:true,  options:['General Enquiry','Technical Support','Partnership','Feedback','Other'] },
        { qid:'q4', type:'paragraph',  label:'Your Message',   required:true,  options:[] },
      ]
    }
  },
];

export default function NewFormPage() {
  const navigate = useNavigate();
  const toast    = useToast();
  const [loading, setLoading] = useState(false);

  const create = async (template) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/forms', template.data);
      toast(`"${data.title}" created!`, 'success');
      navigate(`/builder/${data._id}`);
    } catch (err) {
      toast(err.response?.data?.message || 'Error creating form', 'error');
      setLoading(false);
    }
  };

  return (
    <AppShell title="New Form">
      <div className="page-inner">
        <div style={{ marginBottom:32 }}>
          <h2>Choose a Starting Point</h2>
          <p style={{ marginTop:6 }}>Pick a template or start with a blank canvas</p>
        </div>

        <div className="template-grid">
          {TEMPLATES.map(t => (
            <div
              key={t.id}
              className={`template-card${t.blank ? ' blank' : ''}`}
              onClick={() => !loading && create(t)}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              <div className="template-emoji">{t.emoji}</div>
              <div className="template-name">{t.name}</div>
              <div className="template-desc">{t.desc}</div>
            </div>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign:'center', padding:20, color:'var(--t2)' }}>
            <span className="spinner" /> &nbsp; Creating your form…
          </div>
        )}
      </div>
    </AppShell>
  );
}
