package com.hospitalmanagement.demo.service;

import com.hospitalmanagement.demo.dto.PatientDTO;
import com.hospitalmanagement.demo.entity.Patient;
import com.hospitalmanagement.demo.entity.Doctor;
import com.hospitalmanagement.demo.entity.Appointment;
import com.hospitalmanagement.demo.repository.PatientRepository;
import com.hospitalmanagement.demo.repository.DoctorRepository;
import com.hospitalmanagement.demo.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Date;

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

    public Patient getPatientById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public Patient updatePatient(Long id, PatientDTO dto) {

        Patient patient = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        patient.setName(dto.getName());
        patient.setAge(dto.getAge());
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setDisease(dto.getDisease());

        return repo.save(patient);
    }

    public void deletePatient(Long id) {
        repo.deleteById(id);
    }

    public List<Patient> searchByDisease(String disease) {
        return repo.findByDisease(disease);
    }

    public Appointment assignDoctor(Long patientId, Long doctorId) {
        Patient patient = getPatientById(patientId);
        Doctor doctor = doctorRepo.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setDate(new Date().toString());
        
        return appointmentRepo.save(appointment);
    }
}