import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Stethoscope, Target, Clock, ArrowRight, PenTool, BrainCircuit, Activity, Pill, ShieldCheck, Database, ThumbsUp } from 'lucide-react';
import FloatingBadge from '../components/FloatingBadge';
import { Link } from 'react-router-dom';

function Home() {
  const [stats, setStats] = useState({
    total_patients_analyzed: "50K+",
    certified_specialists: "120+",
    patient_experience: "95%",
    upcoming_appointments: "24/7"
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/dashboard`)
      .then(res => {
        if(res.data) {
          setStats({
            total_patients_analyzed: res.data.total_patients_analyzed + "+",
            certified_specialists: res.data.certified_specialists + "+",
            patient_experience: res.data.patient_experience,
            upcoming_appointments: "24/7"
          });
        }
      })
      .catch(err => console.error(err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.8 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', stiffness: 120, damping: 10, mass: 1.2 } 
    }
  };

  return (
    <div style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
      
      {/* Hero Section */}
      <div className="grid-cols-2" style={{ alignItems: 'center', marginBottom: '4rem' }}>
        <motion.div variants={itemVariants} style={{ maxWidth: '600px' }}>
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.2 }}
            style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(99,102,241,0.1)', color: 'var(--primary-color)', borderRadius: '30px', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '1px' }}
          >
            #1 AI Medical Platform
          </motion.div>
          <motion.h1 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.4 }}
            style={{ fontSize: '4.5rem', lineHeight: '1.1', marginBottom: '1.5rem', color: 'var(--bg-dark)', letterSpacing: '-2px' }}
          >
            Diagnose <span style={{ color: 'var(--primary-color)' }}>Smarter.</span><br />
            Recover <span style={{ color: 'var(--accent-color)' }}>Faster.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '2.5rem', lineHeight: '1.6' }}
          >
            Leverage advanced neural networks to instantly analyze your symptoms, predict potential conditions, and discover optimal medical treatments with 95% clinical accuracy.
          </motion.p>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 150, damping: 10 }}
            style={{ display: 'flex', gap: '1.5rem' }}
          >
            <Link to="/diagnose">
              <button 
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem' }}
              >
                Start AI Diagnosis <ArrowRight size={20} />
              </button>
            </Link>
            <Link to="/diseases">
              <button 
                className="btn-outline"
                style={{ padding: '1rem 2rem' }}
              >
                Browse Diseases
              </button>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Right side with Doctor Image and floating cards over it */}
        <motion.div 
          style={{ position: 'relative', height: '550px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-light)', borderRadius: '40px' }}
          initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.3 }}
        >
          <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.3))', borderRadius: '40px' }}></div>
          
          <motion.img 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800" 
            alt="Doctor" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', mixBlendMode: 'multiply', borderRadius: '40px' }}
          />
          
          {/* Floating cards exactly like the image */}
          <div style={{ position: 'absolute', top: '10%', left: '-10%' }}>
            <motion.div 
              className="glass-panel" 
              style={{ padding: '1.2rem', background: '#ffffff', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                <Database size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Global Health Database</span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--bg-dark)' }}>{stats.total_patients_analyzed}</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>Records</p>
            </motion.div>
          </div>

          <div style={{ position: 'absolute', bottom: '15%', left: '5%' }}>
            <motion.div 
              className="glass-panel" 
              style={{ padding: '1.2rem', background: '#ffffff', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                <Target size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>AI Accuracy</span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--bg-dark)' }}>{stats.patient_experience}</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>Diagnostic Accuracy</p>
            </motion.div>
          </div>

          <div style={{ position: 'absolute', top: '25%', right: '-5%' }}>
            <motion.div 
              className="glass-panel" 
              style={{ padding: '1.2rem', background: '#ffffff', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                <Activity size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>User Satisfaction</span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--bg-dark)' }}>99%</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>Excellent</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main Stats Bar (Below Hero) */}
      <motion.div 
        className="glass-panel"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 4rem', marginBottom: '8rem', background: '#ffffff', borderRadius: '30px', flexWrap: 'wrap', gap: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Users size={48} color="var(--primary-color)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--bg-dark)' }}>{stats.total_patients_analyzed}</h3>
            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '1rem', fontWeight: 500 }}>Patients Helped</p>
          </div>
        </div>
        <div style={{ width: '1px', height: '50px', background: '#e2e8f0' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Stethoscope size={48} color="var(--primary-color)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--bg-dark)' }}>{stats.certified_specialists}</h3>
            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '1rem', fontWeight: 500 }}>Medical Experts</p>
          </div>
        </div>
        <div style={{ width: '1px', height: '50px', background: '#e2e8f0' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Target size={48} color="var(--primary-color)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--bg-dark)' }}>{stats.patient_experience}</h3>
            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '1rem', fontWeight: 500 }}>AI Accuracy</p>
          </div>
        </div>
        <div style={{ width: '1px', height: '50px', background: '#e2e8f0' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Clock size={48} color="var(--primary-color)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--bg-dark)' }}>{stats.upcoming_appointments}</h3>
            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '1rem', fontWeight: 500 }}>Support Available</p>
          </div>
        </div>
      </motion.div>

      {/* How it works Section (Horizontal Stepper) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{ textAlign: 'center', marginBottom: '8rem' }}
      >
        <h5 style={{ color: 'var(--primary-color)', letterSpacing: '3px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>SIMPLE • FAST • ACCURATE</h5>
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>How VitalCare Works</h2>
        <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto 4rem auto', fontSize: '1.1rem' }}>
          Our state-of-the-art NLP engine analyzes your symptoms and cross-references them against thousands of clinical records.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Dashed Line Background */}
          <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '2px', borderTop: '2px dashed #cbd5e1', zIndex: -1, display: window.innerWidth > 768 ? 'block' : 'none' }}></div>

          {[
            { step: '1', title: 'Input Symptoms', desc: 'Type how you feel or select from common symptoms.', icon: <PenTool size={36} color="var(--primary-color)" /> },
            { step: '2', title: 'AI Processing', desc: 'Our machine learning models analyze the exact patterns.', icon: <BrainCircuit size={36} color="var(--primary-color)" /> },
            { step: '3', title: 'Get Diagnosis', desc: 'Receive instant disease predictions and precautions.', icon: <Activity size={36} color="var(--primary-color)" /> },
            { step: '4', title: 'Find Medicines', desc: 'Get suggestions for treatments and specialized articles.', icon: <Pill size={36} color="var(--primary-color)" /> }
          ].map((item, idx) => (
            <motion.div key={idx} variants={itemVariants} style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 800, marginBottom: '1.5rem', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.4)' }}>
                {item.step}
              </div>
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', width: '100%', background: '#ffffff', borderRadius: '24px' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '50%', width: '80px', height: '80px', margin: '0 auto 1.5rem' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Blue Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))', borderRadius: '24px', padding: '3rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', flexWrap: 'wrap', gap: '2rem', boxShadow: '0 20px 40px rgba(79, 70, 229, 0.3)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ border: '2px solid rgba(255,255,255,0.4)', borderRadius: '50%', padding: '1rem' }}>
            <ShieldCheck size={32} color="white" />
          </div>
          <div>
            <h3 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>Your health. Our priority. Always.</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>Trusted by thousands. Powered by AI.</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>f</div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>t</div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>in</div>
          </div>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>© 2026 VitalCare Medical Systems. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
