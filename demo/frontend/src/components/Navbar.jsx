import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import api from '../services/api';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const checkLogin = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
    };
    
    checkLogin();
    
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, [location]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchPendingCount = async () => {
      try {
        const res = await api.get('/patients');
        const count = res.data.filter(p => p.status === 'PENDING').length;
        setPendingCount(count);
      } catch (err) {
        console.error('Error fetching pending patients:', err);
      }
    };

    fetchPendingCount();
    const intervalId = setInterval(fetchPendingCount, 60000); // 60 seconds

    return () => clearInterval(intervalId);
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const navLinks = [];
  if (isLoggedIn) {
    navLinks.push({ path: '/', label: 'Home' });
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'ADMIN') {
      navLinks.push({ path: '/doctors', label: 'Doctors', showBadge: true });
    }
    navLinks.push({ path: '/patients', label: 'Patients', showBadge: true });
  } else {
    navLinks.push({ path: '/', label: 'Home' });
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand">
          <Activity size={24} color="var(--color-primary)" />
          <span>MediCare</span>
        </Link>
        <div className="nav-links">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {link.label}
              {link.showBadge && pendingCount > 0 && (
                <span style={{
                  backgroundColor: 'var(--color-danger)',
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '0.125rem 0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  lineHeight: 1
                }}>
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
          {isLoggedIn ? (
            <button 
              onClick={handleLogout} 
              className="nav-link" 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
