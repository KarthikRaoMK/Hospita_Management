import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import api from '../services/api';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [searchDisease, setSearchDisease] = useState('');
  const [formData, setFormData] = useState({ name: '', age: '', bloodGroup: '', disease: '', doctorId: '' });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors');
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    if (!searchDisease) return fetchPatients();
    try {
      const res = await api.get(`/patients/search?disease=${searchDisease}`);
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.doctorId) {
      alert('Please select a doctor for this patient.');
      return;
    }
    try {
      const res = await api.post('/patients', { ...formData, age: parseInt(formData.age) });
      const patientId = res.data.id;
      
      // Assign the patient to the selected doctor
      await api.post(`/patients/${patientId}/assign/${formData.doctorId}`);
      
      setFormData({ name: '', age: '', bloodGroup: '', disease: '', doctorId: '' });
      setShowAdd(false);
      fetchPatients();
    } catch (err) {
      console.error(err);
      alert('Error adding patient or assigning doctor');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await api.delete(`/patients/${id}`);
        fetchPatients();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div className="flex justify-between items-center mb-4">
        <h2 style={{ color: 'var(--color-secondary)' }}>Patient Management</h2>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by disease..." 
              value={searchDisease}
              onChange={e => setSearchDisease(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
              style={{ width: '200px' }}
            />
            <button className="btn btn-outline" onClick={handleSearch}><Search size={18}/></button>
          </div>
          <button className="btn btn-secondary" onClick={() => setShowAdd(!showAdd)}>
            <Plus size={18} /> {showAdd ? 'Cancel' : 'Add Patient'}
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="card mb-4">
          <div className="card-header">
            <h3>Add New Patient</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Name</label>
                  <input type="text" required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Age</label>
                  <input type="number" required min="0" className="form-input" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Blood Group</label>
                  <input type="text" required className="form-input" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Disease</label>
                  <input type="text" required className="form-input" value={formData.disease} onChange={e => setFormData({...formData, disease: e.target.value})} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Assign to Doctor</label>
                <select 
                  className="form-input" 
                  required 
                  value={formData.doctorId} 
                  onChange={e => setFormData({...formData, doctorId: e.target.value})}
                >
                  <option value="">-- Select a Doctor --</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>Dr. {doc.name} - {doc.specialization}</option>
                  ))}
                </select>
              </div>
              <div>
                <button type="submit" className="btn btn-primary">Save Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Blood Grp</th>
              <th>Disease</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(pat => (
              <tr key={pat.id}>
                <td>#{pat.id}</td>
                <td style={{ fontWeight: 500 }}>{pat.name}</td>
                <td>{pat.age}</td>
                <td><span className="badge badge-red">{pat.bloodGroup}</span></td>
                <td>{pat.disease}</td>
                <td>
                  <button className="btn btn-outline" style={{ color: 'var(--color-danger)', borderColor: 'transparent' }} onClick={() => handleDelete(pat.id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No patients found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Patients;
