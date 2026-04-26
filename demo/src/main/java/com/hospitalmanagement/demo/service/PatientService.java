package com.hospitalmanagement.demo.service;

import com.hospitalmanagement.demo.dto.PatientDTO;
import com.hospitalmanagement.demo.entity.Patient;
import com.hospitalmanagement.demo.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    @Autowired
    private PatientRepository repo;

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
}