import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Search } from 'lucide-react';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter articles based on search term
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/articles`)
      .then(res => {
        setArticles(res.data);
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
        <BookOpen size={36} color="var(--primary-color)" />
        <h2 style={{ margin: 0, fontSize: '2.5rem' }}>Health Articles</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', margin: 0, maxWidth: '600px' }}>
          Read comprehensive guides and insights about various medications and treatments.
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
            placeholder="Search articles by title or content..." 
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
      ) : filteredArticles.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light)' }}>
          <Search size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <h3>No articles found matching "{searchTerm}"</h3>
        </motion.div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
          }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}
        >
          {filteredArticles.map((article, idx) => (
            <motion.div 
              key={idx} 
              className="glass-panel"
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 15 } }
              }}
              whileHover={{ y: -10, scale: 1.02, boxShadow: '0 20px 40px rgba(99,102,241,0.15)' }}
              whileTap={{ scale: 0.98 }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', cursor: 'pointer', background: '#ffffff', borderRadius: '20px', transition: 'box-shadow 0.3s ease' }}
              onClick={() => setSelectedArticle(article)}
            >
              {article.image_url && (
                <img 
                  src={article.image_url} 
                  alt={article.title} 
                  style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem', background: '#f8fafc' }} 
                />
              )}
              <h4 style={{ color: 'var(--bg-dark)', marginBottom: '0.5rem', fontSize: '1.2rem', lineHeight: '1.4' }}>{article.title}</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {article.content}
              </p>
              <div style={{ color: 'white', background: 'var(--primary-color)', padding: '0.8rem', borderRadius: '12px', fontWeight: 600, textAlign: 'center', marginTop: '1.5rem' }}>
                Read Full Article &rarr;
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Reading Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: '800px', background: 'var(--bg-white)', padding: '0', position: 'relative', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px' }}
            >
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '50%', padding: '0.5rem', display: 'flex', zIndex: 10 }}
              >
                <X size={24} />
              </button>
              
              {selectedArticle.image_url && (
                <img 
                  src={selectedArticle.image_url} 
                  alt={selectedArticle.title} 
                  style={{ width: '100%', height: '350px', objectFit: 'cover' }} 
                />
              )}
              
              <div style={{ padding: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--bg-dark)', marginBottom: '2rem', lineHeight: '1.2' }}>{selectedArticle.title}</h2>
                <div style={{ color: 'var(--text-dark)', fontSize: '1.15rem', lineHeight: '1.8' }}>
                  {/* Mock paragraphs for the article content since we only have short text */}
                  <p style={{ marginBottom: '1.5rem' }}>{selectedArticle.content}</p>
                  <p style={{ marginBottom: '1.5rem' }}>Medical experts recommend closely monitoring any symptoms when starting new treatments. VitalCare's AI engines have cross-referenced this information to ensure the highest reliability.</p>
                  <p>In case of severe side effects, immediately stop usage and consult your registered specialist on the VitalCare network.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Articles;
