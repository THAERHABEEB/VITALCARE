import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Award, Calendar, TrendingUp, Activity, FileText, Target, Search, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const trafficData = [
  { name: 'Jan', patients: 400, accuracy: 92 },
  { name: 'Feb', patients: 300, accuracy: 94 },
  { name: 'Mar', patients: 550, accuracy: 96 },
  { name: 'Apr', patients: 480, accuracy: 95 },
  { name: 'May', patients: 700, accuracy: 98 },
  { name: 'Jun', patients: 850, accuracy: 99 },
];

const diseaseData = [
  { name: 'Fungal Infection', value: 400 },
  { name: 'Allergy', value: 300 },
  { name: 'GERD', value: 300 },
  { name: 'Migraine', value: 200 },
  { name: 'Malaria', value: 278 },
  { name: 'Diabetes', value: 189 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#f97316'];

const recentActivity = [
  { id: 1, user: "Ahmed Y.", action: "Diagnosed with Migraine", time: "2 mins ago" },
  { id: 2, user: "Sarah K.", action: "Read 'Managing Allergy'", time: "15 mins ago" },
  { id: 3, user: "Dr. Hassan", action: "Updated database records", time: "1 hr ago" },
  { id: 4, user: "Mona L.", action: "Searched for 'GERD symptoms'", time: "2 hrs ago" },
  { id: 5, user: "System", action: "AI Model Retrained (Accuracy 99%)", time: "5 hrs ago" }
];

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/dashboard`)
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 15 } }
  };

  return (
    <div style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
      <h2 style={{ fontSize: '3rem', letterSpacing: '-1px' }}>Platform Analytics</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '3rem', fontSize: '1.2rem' }}>Comprehensive real-time statistics for VitalCare AI.</p>

      {stats && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Top Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            
            <motion.div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#ffffff', borderRadius: '24px' }} variants={cardVariants}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-light)', fontWeight: 600 }}>Total Diagnoses</p>
                <div style={{ background: '#e0e7ff', padding: '0.8rem', borderRadius: '50%' }}><Users size={24} color="var(--primary-color)" /></div>
              </div>
              <h3 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--bg-dark)' }}>{stats.total_patients_analyzed}</h3>
              <p style={{ margin: 0, color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>↑ 12% from last month</p>
            </motion.div>

            <motion.div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#ffffff', borderRadius: '24px' }} variants={cardVariants}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-light)', fontWeight: 600 }}>AI Accuracy</p>
                <div style={{ background: '#e0e7ff', padding: '0.8rem', borderRadius: '50%' }}><Target size={24} color="var(--primary-color)" /></div>
              </div>
              <h3 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--bg-dark)' }}>{stats.patient_experience}</h3>
              <p style={{ margin: 0, color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>↑ 2% improvement</p>
            </motion.div>

            <motion.div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#ffffff', borderRadius: '24px' }} variants={cardVariants}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-light)', fontWeight: 600 }}>Articles Read</p>
                <div style={{ background: '#e0e7ff', padding: '0.8rem', borderRadius: '50%' }}><FileText size={24} color="var(--primary-color)" /></div>
              </div>
              <h3 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--bg-dark)' }}>12.4K</h3>
              <p style={{ margin: 0, color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>↑ 8% from last week</p>
            </motion.div>

            <motion.div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#ffffff', borderRadius: '24px' }} variants={cardVariants}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-light)', fontWeight: 600 }}>Search Queries</p>
                <div style={{ background: '#e0e7ff', padding: '0.8rem', borderRadius: '50%' }}><Search size={24} color="var(--primary-color)" /></div>
              </div>
              <h3 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--bg-dark)' }}>152K</h3>
              <p style={{ margin: 0, color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>Processing ~1k/day</p>
            </motion.div>

          </div>

          {/* Charts Row 1 */}
          <div className="grid-cols-2" style={{ marginBottom: '3rem' }}>
            <motion.div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', borderRadius: '24px' }} variants={cardVariants}>
              <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Platform Usage Growth</h3>
              <div style={{ width: '100%', height: '320px' }}>
                <ResponsiveContainer>
                  <AreaChart data={trafficData}>
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
                      data={diseaseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {diseaseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Interactive Row 2 */}
          <div className="grid-cols-2" style={{ marginBottom: '3rem' }}>
             <motion.div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', borderRadius: '24px' }} variants={cardVariants}>
              <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Recent Platform Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentActivity.map((activity, idx) => (
                  <motion.div 
                    key={activity.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ x: 10, backgroundColor: 'rgba(99,102,241,0.05)' }}
                    style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.2rem', borderBottom: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    <div style={{ background: 'var(--primary-color)', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                      {activity.user.charAt(0)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: 'var(--bg-dark)' }}>{activity.user}</p>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>{activity.action}</p>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                      <Clock size={14} /> {activity.time}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', borderRadius: '24px' }} variants={cardVariants}>
              <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Weekly Traffic Breakdown</h3>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer>
                  <BarChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                    <Bar dataKey="patients" fill="var(--primary-color)" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
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
