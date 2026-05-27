import React from 'react';
import { createPortal } from 'react-dom';

function DischargeModal({ isOpen, onClose, appointment, doctorName }) {
  if (!isOpen || !appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(appointment.date || new Date()).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit'
  });

  return createPortal(
    <div style={overlayStyle} className="print-overlay">
      <div className="card animate-fade-in print-card" style={modalStyle}>
        <div className="card-header no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Discharge Summary</h3>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text)' }}
          >
            &times;
          </button>
        </div>
        <div className="card-body print-body">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>MediCare Hospital</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Official Discharge Summary</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Patient Name</p>
              <p style={{ fontWeight: 600 }}>{appointment.patient?.name}</p>
            </div>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Attending Doctor</p>
              <p style={{ fontWeight: 600 }}>Dr. {doctorName}</p>
            </div>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Diagnosis / Disease</p>
              <p style={{ fontWeight: 600 }}>{appointment.patient?.disease}</p>
            </div>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Date Treated</p>
              <p style={{ fontWeight: 600 }}>{formattedDate}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '2rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Prescription & Notes</p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{appointment.prescription}</p>
          </div>

          <div className="flex gap-2 justify-end no-print">
            <button className="btn btn-outline" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={handlePrint}>Print Summary</button>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-overlay {
            position: absolute;
            left: 0;
            top: 0;
            background: none;
            backdrop-filter: none;
          }
          .print-card, .print-body, .print-body * {
            visibility: visible;
          }
          .print-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            box-shadow: none;
            margin: 0;
            border: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>,
    document.body
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  width: '100%',
  maxWidth: '600px',
  margin: '0 1rem',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  backgroundColor: 'white'
};

export default DischargeModal;
