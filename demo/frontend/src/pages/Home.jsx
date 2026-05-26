import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Stethoscope } from 'lucide-react';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
          Welcome to MediCare
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Advanced Hospital Management System for seamless doctor and patient coordination.
        </p>
      </div>

      <div className="flex justify-center gap-6" style={{ flexWrap: 'wrap' }}>
        {isLoggedIn ? (
          <>
            <div className="card" style={{ width: '300px' }}>
              <div className="card-body flex flex-col items-center" style={{ textAlign: 'center', gap: '1rem' }}>
                <Stethoscope size={48} color="var(--color-primary)" />
                <h3>Doctor Portal</h3>
                <p>Manage doctor schedules, specialties, and new registrations.</p>
                <Link to="/doctors" className="btn btn-primary mt-4" style={{ width: '100%' }}>
                  Manage Doctors
                </Link>
              </div>
            </div>

            <div className="card" style={{ width: '300px' }}>
              <div className="card-body flex flex-col items-center" style={{ textAlign: 'center', gap: '1rem' }}>
                <Users size={48} color="var(--color-secondary)" />
                <h3>Patient Portal</h3>
                <p>Access patient records, medical history, and appointments.</p>
                <Link to="/patients" className="btn btn-secondary mt-4" style={{ width: '100%' }}>
                  Manage Patients
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="card" style={{ width: '300px' }}>
            <div className="card-body flex flex-col items-center" style={{ textAlign: 'center', gap: '1rem' }}>
              <UserPlus size={48} color="var(--color-text-muted)" />
              <h3>System Access</h3>
              <p>Register new staff members or login to your account.</p>
              <Link to="/login" className="btn btn-outline mt-4" style={{ width: '100%' }}>
                Login / Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
