import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
    };
    
    // Check initially
    checkLogin();
    
    // In a real app we'd use a Context, but this listens to storage changes 
    // or we can just rely on normal navigation
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, [location]); // re-check on route change since login sets localStorage then navigates

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const navLinks = isLoggedIn 
    ? [
        { path: '/', label: 'Home' },
        { path: '/doctors', label: 'Doctors' },
        { path: '/patients', label: 'Patients' }
      ]
    : [
        { path: '/', label: 'Home' }
      ];

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
            >
              {link.label}
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
