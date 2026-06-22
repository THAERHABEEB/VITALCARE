import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Award, Calendar, TrendingUp, Activity, FileText, Target, Search, Clock, Lock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#f97316'];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vitalcare_token');
    if (!token) {
        setIsAuthorized(false);
        setLoading(false);
        return;
    }

    axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
          setStats(res.data);
          setLoading(false);
      })
      .catch(err => {
          console.error(err);
          if (err.response?.status === 401) {
              localStorage.removeItem('vitalcare_token');
              setIsAuthorized(false);
          }
          setLoading(false);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 15 } }
  };

  if (!isAuthorized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <motion.div 
          className="glass-panel"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ padding: '3rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}
        >
          <div style={{ background: '#fee2e2', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem auto' }}>
            <Lock size={40} color="#e11d48" />
          </div>
          <h3 style={{ fontSize: '1.8rem', color: 'var(--bg-dark)', marginBottom: '1rem' }}>Access Denied</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>You must be logged in to view the platform analytics and dashboard.</p>
          <Link to="/auth" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '1.1rem' }}>
              Sign In
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
      <h2 style={{ fontSize: '3rem', letterSpacing: '-1px' }}>Platform Analytics</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '3rem', fontSize: '1.2rem' }}>Comprehensive real-time statistics for VitalCare AI.</p>

      {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
             {[1,2,3,4].map(i => (
                 <motion.div key={i} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }} style={{ height: '140px', background: '#e2e8f0', borderRadius: '24px' }}></motion.div>
             ))}
          </div>
      )}

      {stats && !loading && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Top Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            
            <motion.div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#ffffff', borderRadius: '24px' }} variants={cardVariants}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-light)', fontWeight: 600 }}>Total Diagnoses</p>
                <div style={{ background: '#e0e7ff', padding: '0.8rem', borderRadius: '50%' }}><Users size={24} color="var(--primary-color)" /></div>
              </div>
              <h3 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--bg-dark)' }}>{stats.total_patients_analyzed}</h3>
              <p style={{ margin: 0, color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>Real-time database count</p>
            </motion.div>

            <motion.div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#ffffff', borderRadius: '24px' }} variants={cardVariants}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-light)', fontWeight: 600 }}>Registered Users</p>
                <div style={{ background: '#e0e7ff', padding: '0.8rem', borderRadius: '50%' }}><Target size={24} color="var(--primary-color)" /></div>
              </div>
              <h3 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--bg-dark)' }}>{stats.certified_specialists}</h3>
              <p style={{ margin: 0, color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>Real-time user count</p>
            </motion.div>

            <motion.div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#ffffff', borderRadius: '24px' }} variants={cardVariants}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-light)', fontWeight: 600 }}>Avg. Confidence</p>
                <div style={{ background: '#e0e7ff', padding: '0.8rem', borderRadius: '50%' }}><FileText size={24} color="var(--primary-color)" /></div>
              </div>
              <h3 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--bg-dark)' }}>{stats.patient_experience}</h3>
              <p style={{ margin: 0, color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>↑ 2% from last week</p>
            </motion.div>

            <motion.div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#ffffff', borderRadius: '24px' }} variants={cardVariants}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-light)', fontWeight: 600 }}>System Status</p>
                <div style={{ background: '#e0e7ff', padding: '0.8rem', borderRadius: '50%' }}><Activity size={24} color="var(--primary-color)" /></div>
              </div>
              <h3 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--bg-dark)' }}>Online</h3>
              <p style={{ margin: 0, color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>Fuzzy Match Engine Active</p>
            </motion.div>

          </div>

          {/* Charts Row 1 */}
          <div className="grid-cols-2" style={{ marginBottom: '3rem' }}>
            <motion.div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', borderRadius: '24px' }} variants={cardVariants}>
              <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Platform Usage Growth</h3>
              <div style={{ width: '100%', height: '320px' }}>
                <ResponsiveContainer>
                  <AreaChart data={stats.trafficData || []}>
                    <defs>
                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="patients" stroke="var(--primary-color)" fill="url(#colorPv)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', borderRadius: '24px' }} variants={cardVariants}>
              <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Most Common Diagnoses</h3>
              <div style={{ width: '100%', height: '320px' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={stats.diseaseData || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {(stats.diseaseData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

        </motion.div>
      )}
    </div>
  );
}

export default Dashboard;
