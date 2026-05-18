import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/doctors', label: 'Doctors' },
    { path: '/patients', label: 'Patients' },
    { path: '/login', label: 'Login' }
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
