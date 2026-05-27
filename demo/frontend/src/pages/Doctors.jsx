import React, { useState, useEffect } from 'react';
import { Plus, Trash2, UserCircle2, CheckCircle2, History, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';
import DischargeModal from '../components/DischargeModal';
import Modal from '../components/Modal';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: '', specialization: '', email: '', password: '' });
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';

  // Treatment Modal State
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [prescription, setPrescription] = useState('');

  // Discharge Summary State
  const [dischargeData, setDischargeData] = useState(null);
  const [showDischarge, setShowDischarge] = useState(false);

  // History Expandable State
  const [expandedHistoryDocs, setExpandedHistoryDocs] = useState({});

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors/with-patients');
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/doctors/register', formData);
      setFormData({ name: '', specialization: '', email: '', password: '' });
      setShowAdd(false);
      fetchDoctors();
    } catch (err) {
      console.error(err);
      alert('Error adding doctor');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(`/doctors/${id}`);
        fetchDoctors();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleTreat = async () => {
    if (!prescription) {
      alert("Please enter a prescription.");
      return;
    }
    try {
      await api.put(`/appointments/${activeAppointment.id}/treat`, { prescription });
      // Keep appointment data for discharge modal
      setDischargeData({ 
        appointment: { ...activeAppointment, prescription }, 
        doctorName: doctors.find(d => d.id === activeAppointment.doctor?.id)?.name || user.name 
      });
      setActiveAppointment(null);
      setPrescription('');
      fetchDoctors();
      setShowDischarge(true);
    } catch (err) {
      console.error(err);
      alert('Error submitting treatment');
    }
  };

  const toggleHistory = (docId) => {
    setExpandedHistoryDocs(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString; // fallback
      return d.toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div className="flex justify-between items-center mb-4">
        <h2 style={{ color: 'var(--color-primary)' }}>Doctor Portal</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
            <Plus size={18} /> {showAdd ? 'Cancel' : 'Add Doctor'}
          </button>
        )}
      </div>

      {showAdd && (
        <div className="card mb-4" style={{ border: '2px solid var(--color-primary)' }}>
          <div className="card-header">
            <h3>Add New Doctor</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Name</label>
                  <input type="text" required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Specialization</label>
                  <input type="text" required className="form-input" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Email</label>
                  <input type="email" required className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Password</label>
                  <input type="password" required className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
              <div>
                <button type="submit" className="btn btn-secondary">Save Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {doctors.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No registered doctors found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {doctors.map(doc => {
            const pendingAppointments = doc.appointments?.filter(a => a.status === 'PENDING') || [];
            const historyAppointments = doc.appointments?.filter(a => a.status === 'TREATED') || [];
            
            return (
              <div key={doc.id} className="card" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <div className="card-header flex justify-between items-center" style={{ backgroundColor: '#f8fafc' }}>
                  <div className="flex items-center gap-3">
                    <UserCircle2 size={32} color="var(--color-primary)" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Dr. {doc.name}</h3>
                        {pendingAppointments.length > 0 && (
                          <span className="badge badge-red" style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>
                            {pendingAppointments.length} Pending
                          </span>
                        )}
                      </div>
                      <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        <span className="badge badge-blue">{doc.specialization}</span> • {doc.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-outline" onClick={() => toggleHistory(doc.id)}>
                      <History size={16} /> History ({historyAppointments.length}) {expandedHistoryDocs[doc.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {isAdmin && (
                      <button className="btn btn-outline" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => handleDelete(doc.id)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="card-body">
                  <h4 style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>Pending Patients</h4>
                  {pendingAppointments.length > 0 ? (
                    <div className="table-wrapper">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Patient Name</th>
                            <th>Disease</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingAppointments.map(app => (
                            <tr key={app.id}>
                              <td>{formatDate(app.date)}</td>
                              <td style={{ fontWeight: 500 }}>{app.patient?.name}</td>
                              <td>{app.patient?.disease}</td>
                              <td>
                                <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} onClick={() => setActiveAppointment({...app, doctor: doc})}>
                                  <CheckCircle2 size={16} /> Mark Treated
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '0.375rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No pending patients for Dr. {doc.name}.
                    </div>
                  )}

                  {expandedHistoryDocs[doc.id] && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                      <h4 style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>Treatment History</h4>
                      {historyAppointments.length > 0 ? (
                        <div className="flex flex-col gap-4">
                          {historyAppointments.map(app => (
                            <div key={app.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', backgroundColor: '#fafafa' }}>
                              <div className="flex justify-between mb-2">
                                <strong>Patient: {app.patient?.name} ({app.patient?.disease})</strong>
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{formatDate(app.date)}</span>
                              </div>
                              <div style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #f1f5f9', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                                {app.prescription}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No treatment history found.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Treatment Modal */}
      <Modal isOpen={!!activeAppointment} onClose={() => setActiveAppointment(null)} title={`Treat Patient: ${activeAppointment?.patient?.name}`}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>Enter the prescription details below:</p>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label text-center">Disease: {activeAppointment?.patient?.disease}</label>
            <textarea 
              className="form-input" 
              rows="4" 
              placeholder="Enter prescription and treatment notes here..." 
              value={prescription} 
              onChange={e => setPrescription(e.target.value)} 
            />
          </div>
          <div className="flex gap-2 justify-center" style={{ marginTop: '1.5rem' }}>
            <button className="btn btn-outline" onClick={() => setActiveAppointment(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleTreat}>Save & Mark Treated</button>
          </div>
        </div>
      </Modal>

      {/* Discharge Summary Modal */}
      <DischargeModal 
        isOpen={showDischarge} 
        onClose={() => setShowDischarge(false)} 
        appointment={dischargeData?.appointment} 
        doctorName={dischargeData?.doctorName} 
      />
    </div>
  );
}

export default Doctors;

