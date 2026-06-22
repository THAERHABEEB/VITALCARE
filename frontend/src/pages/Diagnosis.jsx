import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Activity, AlertCircle, ShieldAlert, Pill, Check } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Diagnosis() {
  const [symptoms, setSymptoms] = useState('');
  const [commonSymptoms, setCommonSymptoms] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/symptoms`)
      .then(res => setCommonSymptoms(res.data))
      .catch(err => console.error("Failed to load symptoms", err));
  }, []);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleDiagnose = async (e) => {
    e.preventDefault();

    const currentSymptoms = symptoms || '';
    const currentTags = selectedTags || [];

    if (currentSymptoms.trim() === '' && currentTags.length === 0) {
      toast.error("Please describe your symptoms or select at least one from the quick-list above.");
      return;
    }

    setLoading(true);
    setResult(null);

    const token = localStorage.getItem('vitalcare_token');
    if (!token) {
      toast.error("You must be logged in to use the diagnostic tool.");
      setTimeout(() => window.location.href = '/auth', 2000);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/diagnose`, {
        symptoms: currentSymptoms,
        selected_symptoms: currentTags
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(response.data);
      toast.success("Diagnosis complete!");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem('vitalcare_token');
        setTimeout(() => window.location.href = '/auth', 2000);
      } else {
        toast.error(err.response?.data?.detail || 'An error occurred during diagnosis. Make sure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
      style={{ padding: '3rem', maxWidth: '900px', margin: '2rem auto' }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ display: 'inline-block' }}>
          <Activity size={64} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
        </motion.div>
        <motion.h2 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} style={{ fontSize: '2.8rem', letterSpacing: '-1px' }}>AI-Powered Diagnosis v2</motion.h2>
        <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ color: 'var(--text-light)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Select your symptoms below or describe them in detail. Our advanced neural network will analyze your inputs using fuzzy matching and instantly predict the condition.
        </motion.p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Check size={20} color="var(--primary-color)" /> Quick Select Symptoms
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {commonSymptoms.map((sym, idx) => (
            <div
              key={idx}
              onClick={() => toggleTag(sym)}
              className={`symptom-tag ${selectedTags.includes(sym) ? 'selected' : ''}`}
            >
              {sym}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleDiagnose} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>Describe your condition</h4>
          <textarea
            rows="5"
            placeholder="E.g., I have a headache in the middle of my head, feeling dizzy..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            style={{ resize: 'vertical', width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}
          ></textarea>
        </div>
        <motion.button
          type="submit"
          className="btn-primary"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ alignSelf: 'center', width: '250px', padding: '1rem', fontSize: '1.1rem' }}
        >
          {loading ? 'Analyzing Data...' : 'Run Diagnostics'}
        </motion.button>
      </form>

      {loading && (
        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ height: '150px', background: '#e2e8f0', borderRadius: '20px' }}></motion.div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} style={{ height: '100px', background: '#e2e8f0', borderRadius: '16px', flex: 1 }}></motion.div>
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} style={{ height: '100px', background: '#e2e8f0', borderRadius: '16px', flex: 1 }}></motion.div>
          </div>
        </div>
      )}

      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{ marginTop: '3rem', borderTop: '2px solid rgba(13, 148, 136, 0.1)', paddingTop: '3rem' }}
        >
          <motion.div
            initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ background: 'linear-gradient(135deg, var(--bg-dark), var(--primary-color))', color: 'white', padding: '2.5rem', borderRadius: '20px', marginBottom: '2.5rem', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)' }}
          >
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white', fontSize: '2.2rem', margin: 0, letterSpacing: '-1px' }}>
              <ShieldAlert color="white" size={36} /> {result.disease}
            </h3>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem 1.5rem', borderRadius: '12px' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Confidence Score</p>
                <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>{(result.confidence * 100).toFixed(1)}%</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem 1.5rem', borderRadius: '12px', flex: 1 }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Symptoms Matched</p>
                <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, textTransform: 'capitalize' }}>{result.matched_symptoms.join(' • ')}</p>
              </div>
            </div>
          </motion.div>

          {result.precautions && result.precautions.length > 0 && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} style={{ marginBottom: '3rem' }}>
              <h4 style={{ fontSize: '1.6rem', color: 'var(--bg-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={24} color="var(--primary-color)" /> Recommended Precautions
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {result.precautions.map((p, i) => (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    key={i}
                    className="glass-panel"
                    style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}
                  >
                    <div style={{ background: 'var(--bg-light)', padding: '0.8rem', borderRadius: '50%' }}>
                      <Check size={24} color="var(--primary-color)" />
                    </div>
                    <span style={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '1.1rem' }}>{p}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {result.medicines && result.medicines.length > 0 && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
              <h4 style={{ fontSize: '1.6rem', color: 'var(--bg-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pill size={24} color="var(--primary-color)" /> Suggested Medications
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {result.medicines.map((med, idx) => (
                  <motion.div
                    whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(99,102,241,0.2)' }}
                    key={idx}
                    className="glass-panel"
                    style={{ padding: '2rem', background: '#ffffff', borderRadius: '20px', display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px dashed #e2e8f0' }}>
                      <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: '16px' }}><Pill color="var(--primary-color)" size={32} /></div>
                      <div>
                        <h5 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--bg-dark)' }}>{med.name}</h5>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>By {med.manufacturer}</p>
                      </div>
                    </div>
                    {med.image_url && <img src={med.image_url} alt={med.name} style={{ width: '100%', height: '180px', objectFit: 'contain', marginBottom: '1.5rem', borderRadius: '12px', background: '#f8fafc', padding: '1rem' }} />}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                      <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: '12px' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--primary-color)', margin: '0 0 0.3rem 0', fontWeight: 700, textTransform: 'uppercase' }}>Composition</p>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-dark)', margin: 0, fontWeight: 500 }}>{med.composition}</p>
                      </div>
                      <div style={{ background: '#fff1f2', padding: '1rem', borderRadius: '12px' }}>
                        <p style={{ fontSize: '0.85rem', color: '#e11d48', margin: '0 0 0.3rem 0', fontWeight: 700, textTransform: 'uppercase' }}>Side effects</p>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-dark)', margin: 0, fontWeight: 500 }}>{med.side_effects}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default Diagnosis;
