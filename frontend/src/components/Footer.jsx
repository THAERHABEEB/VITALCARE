import React from 'react';

function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '2rem', marginTop: '4rem', color: 'var(--text-light)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
      <p>&copy; {new Date().getFullYear()} VitalCare Medical Systems. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
