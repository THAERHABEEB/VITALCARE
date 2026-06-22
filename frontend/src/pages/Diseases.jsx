import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, X, AlertTriangle, ShieldCheck, Search } from 'lucide-react';

function Diseases() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter diseases based on search term
  const filteredDiseases = diseases.filter(disease => 
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    disease.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/diseases`)
      .then(res => {
        setDiseases(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Stethoscope size={36} color="var(--primary-color)" />
        <h2 style={{ margin: 0, fontSize: '2.5rem' }}>Medical Dictionary</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', margin: 0, maxWidth: '600px' }}>
          Browse our comprehensive database of medical conditions, their common symptoms, and recommended precautions.
        </p>
        
        {/* Animated Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          style={{ position: 'relative', maxWidth: '500px' }}
        >
          <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)' }}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search for a disease or symptom..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '1rem 1rem 1rem 3rem', 
              borderRadius: '30px', 
              border: '2px solid transparent', 
              background: '#ffffff',
              boxShadow: '0 10px 25px rgba(99,102,241,0.1)',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => e.target.style.border = '2px solid var(--primary-color)'}
            onBlur={(e) => e.target.style.border = '2px solid transparent'}
          />
        </motion.div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: '50px', height: '50px', border: '5px solid var(--primary-color)', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
      ) : filteredDiseases.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light)' }}>
          <Search size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <h3>No diseases found matching "{searchTerm}"</h3>
        </motion.div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 0.1 } }
          }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}
        >
          {filteredDiseases.map((disease, idx) => (
            <motion.div 
              key={idx} 
              className="glass-panel"
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
              }}
              whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 40px rgba(99,102,241,0.15)' }}
              whileTap={{ scale: 0.98 }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', cursor: 'pointer', background: '#ffffff', borderRadius: '20px', transition: 'box-shadow 0.3s ease' }}
              onClick={() => setSelectedDisease(disease)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', borderBottom: '2px dashed #f1f5f9', paddingBottom: '1rem' }}>
                <div style={{ background: '#e0e7ff', padding: '0.8rem', borderRadius: '12px' }}>
                  <ShieldCheck size={24} color="var(--primary-color)" />
                </div>
                <h4 style={{ color: 'var(--bg-dark)', margin: 0, fontSize: '1.3rem' }}>{disease.name}</h4>
              </div>
              <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', flexGrow: 1, lineHeight: '1.6' }}>
                <strong style={{ color: 'var(--primary-color)' }}>Key Symptoms:</strong> {disease.symptoms.join(', ')}...
              </p>
              <div style={{ color: 'white', background: 'var(--primary-color)', padding: '0.8rem', borderRadius: '12px', fontWeight: 600, textAlign: 'center', marginTop: '1rem' }}>
                View Full Details &rarr;
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal for full details */}
      <AnimatePresence>
        {selectedDisease && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.6)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-white)', padding: '2.5rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <button 
                onClick={() => setSelectedDisease(null)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={24} color="var(--text-light)" />
              </button>
              
              <h2 style={{ fontSize: '2rem', color: 'var(--bg-dark)', marginBottom: '1.5rem', paddingRight: '2rem' }}>{selectedDisease.name}</h2>
              
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
                  <AlertTriangle color="#ea580c" size={20} /> Symptoms
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                  {selectedDisease.symptoms.map((s, i) => (
                    <span key={i} style={{ background: '#ffedd5', color: '#9a3412', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 500 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
                  <ShieldCheck color="var(--primary-color)" size={20} /> Precautions
                </h4>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', color: 'var(--text-light)', lineHeight: '1.8' }}>
                  {selectedDisease.precautions.map((p, i) => (
                    <li key={i} style={{ textTransform: 'capitalize' }}>{p}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Diseases;
