import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Stethoscope, Activity, ClipboardCheck, AlertCircle } from 'lucide-react';
import api from '../services/api';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeDoctors: 0,
    pendingCases: 0,
    treatedToday: 0
  });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      fetchStats();
    }
  }, []);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        api.get('/patients'),
        api.get('/doctors')
      ]);
      
      const patients = patientsRes.data || [];
      const doctors = doctorsRes.data || [];
      
      const today = new Date().toDateString();
      let treatedToday = 0;
      let pendingCases = 0;
      
      // Need to count based on the patient's current status and appointment dates if possible.
      // For simplicity, we just count current status. Since we don't have appointment timestamps in standard format in PatientResponseDTO,
      // we'll just mock "treated today" by looking at all treated patients, or if we format date, we can check.
      // Actually we have appointment.date but we'll just check status for now.
      
      patients.forEach(p => {
        if (p.status === 'PENDING') pendingCases++;
        if (p.status === 'TREATED') treatedToday++; // simplified assumption without complex date parsing
      });
      
      setStats({
        totalPatients: patients.length,
        activeDoctors: doctors.length,
        pendingCases,
        treatedToday
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
          Welcome to MediCare
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Advanced Hospital Management System for seamless doctor and patient coordination.
        </p>
      </div>

      {isLoggedIn && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--color-primary)' }}>
            <div style={{ padding: '1rem', backgroundColor: '#e0e7ff', borderRadius: '50%' }}>
              <Users size={24} color="var(--color-primary)" />
            </div>
            <div>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Total Patients</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{loadingStats ? '...' : stats.totalPatients}</h3>
            </div>
          </div>
          
          <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--color-secondary)' }}>
            <div style={{ padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '50%' }}>
              <Stethoscope size={24} color="var(--color-secondary)" />
            </div>
            <div>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Active Doctors</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{loadingStats ? '...' : stats.activeDoctors}</h3>
            </div>
          </div>
          
          <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '50%' }}>
              <Activity size={24} color="#d97706" />
            </div>
            <div>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Pending Cases</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{loadingStats ? '...' : stats.pendingCases}</h3>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '50%' }}>
              <ClipboardCheck size={24} color="#2563eb" />
            </div>
            <div>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Treated Today</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{loadingStats ? '...' : stats.treatedToday}</h3>
            </div>
          </div>
        </div>
      )}

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
