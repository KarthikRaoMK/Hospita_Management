import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'DOCTOR' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('user', JSON.stringify(response.data));
        window.dispatchEvent(new Event('storage'));
        navigate('/');
      } else {
        await api.post('/auth/register', formData);
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in flex justify-center" style={{ paddingTop: '4rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-header text-center">
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
        </div>
        <div className="card-body">
          {error && (
            <div className={`mb-4 p-4 rounded ${isLogin && error.includes('successful') ? 'bg-green-100 text-green-700' : 'badge-red'}`} style={{ borderRadius: '0.375rem', padding: '0.75rem' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: errors.email ? '0.5rem' : '1rem' }}>
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                style={errors.email ? { borderColor: 'var(--color-danger)' } : {}}
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              {errors.email && <span style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>{errors.email}</span>}
            </div>
            
            <div className="form-group" style={{ marginBottom: errors.password ? '0.5rem' : '1rem' }}>
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                style={errors.password ? { borderColor: 'var(--color-danger)' } : {}}
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              {errors.password && <span style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>{errors.password}</span>}
            </div>
            
            {isLogin && (
              <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <button type="button" onClick={() => alert('Password reset link sent to your email!')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.875rem', cursor: 'pointer' }}>
                  Forgot password?
                </button>
              </div>
            )}

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Role</label>
                <select 
                  className="form-input"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="DOCTOR">Doctor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            )}

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
              </button>
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ flex: 1, color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                onClick={() => setFormData({ email: '', password: '', role: 'DOCTOR' })}
              >
                Logout
              </button>
            </div>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 500 }}
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
