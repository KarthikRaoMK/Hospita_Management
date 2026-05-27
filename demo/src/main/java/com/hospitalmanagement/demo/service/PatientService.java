package com.hospitalmanagement.demo.service;

import com.hospitalmanagement.demo.dto.PatientDTO;
import com.hospitalmanagement.demo.entity.Patient;
import com.hospitalmanagement.demo.entity.Doctor;
import com.hospitalmanagement.demo.entity.Appointment;
import com.hospitalmanagement.demo.repository.PatientRepository;
import com.hospitalmanagement.demo.repository.DoctorRepository;
import com.hospitalmanagement.demo.repository.AppointmentRepository;
import com.hospitalmanagement.demo.dto.PatientResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Date;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository repo;

    @Autowired
    private DoctorRepository doctorRepo;

    @Autowired
    private AppointmentRepository appointmentRepo;

    public Patient savePatient(Patient patient) {
        return repo.save(patient);
    }

    public List<Patient> getAllPatients() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public List<PatientResponseDTO> getPatientsForDoctorWithStatus(String doctorEmail) {
        Doctor doctor = doctorRepo.findByEmail(doctorEmail).orElse(null);
        if (doctor == null || doctor.getAppointments() == null) {
            return List.of();
        }
        
        return doctor.getAppointments().stream()
                .map(Appointment::getPatient)
                .distinct()
                .map(p -> mapToDTOForDoctor(p, doctor.getId()))
                .collect(Collectors.toList());
    }

    public Doctor getDoctorByEmail(String email) {
        return doctorRepo.findByEmail(email).orElse(null);
    }

    public Patient getPatientById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public Patient updatePatient(Long id, PatientDTO dto) {
        Patient patient = getPatientById(id);
        patient.setName(dto.getName());
        patient.setAge(dto.getAge());
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setDisease(dto.getDisease());
        
        if (dto.getAssignedDoctorId() != null) {
            Doctor doctor = doctorRepo.findById(dto.getAssignedDoctorId()).orElse(null);
            patient.setAssignedDoctor(doctor);
        }
        
        return repo.save(patient);
    }

    @Transactional(readOnly = true)
    public List<PatientResponseDTO> getAllPatientsWithStatus() {
        return repo.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PatientResponseDTO> searchByDisease(String disease) {
        return repo.findByDiseaseContainingIgnoreCase(disease).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public void deletePatient(Long id) {
        repo.deleteById(id);
    }

    public Appointment assignDoctor(Long patientId, Long doctorId) {
        Patient patient = getPatientById(patientId);
        Doctor doctor = doctorRepo.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        patient.setAssignedDoctor(doctor);
        repo.save(patient);

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setDate(new Date().toString());
        
        return appointmentRepo.save(appointment);
    }

    public Appointment treatPatientByDoctor(Long patientId, String doctorEmail, String prescription) {
        Doctor doctor = doctorRepo.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        Appointment appointment = appointmentRepo.findByPatientIdAndDoctorIdAndStatus(patientId, doctor.getId(), "PENDING")
                .orElseThrow(() -> new RuntimeException("No pending appointment found for this patient and doctor"));
                
        appointment.setStatus("TREATED");
        appointment.setPrescription(prescription);
        
        return appointmentRepo.save(appointment);
    }

    private PatientResponseDTO mapToDTO(Patient patient) {
        PatientResponseDTO dto = new PatientResponseDTO();
        dto.setId(patient.getId());
        dto.setName(patient.getName());
        dto.setAge(patient.getAge());
        dto.setBloodGroup(patient.getBloodGroup());
        dto.setDisease(patient.getDisease());
        
        if (patient.getAssignedDoctor() != null) {
            dto.setAssignedDoctorId(patient.getAssignedDoctor().getId());
            dto.setAssignedDoctorName(patient.getAssignedDoctor().getName());
        }

        if (patient.getAppointments() != null && !patient.getAppointments().isEmpty()) {
            Appointment latestAppt = patient.getAppointments().get(patient.getAppointments().size() - 1);
            dto.setStatus(latestAppt.getStatus());
            dto.setPrescription(latestAppt.getPrescription());
            dto.setAppointmentId(latestAppt.getId());
        }
        return dto;
    }

    private PatientResponseDTO mapToDTOForDoctor(Patient patient, Long doctorId) {
        PatientResponseDTO dto = mapToDTO(patient);
        if (patient.getAppointments() != null) {
            patient.getAppointments().stream()
                .filter(a -> a.getDoctor() != null && a.getDoctor().getId().equals(doctorId))
                .findFirst()
                .ifPresent(appt -> {
                    dto.setStatus(appt.getStatus());
                    dto.setPrescription(appt.getPrescription());
                    dto.setAppointmentId(appt.getId());
                });
        }
        return dto;
    }
}