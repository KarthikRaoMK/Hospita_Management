package com.hospitalmanagement.demo.Service;

import com.hospitalmanagement.demo.Entity.Patient;
import com.hospitalmanagement.demo.Repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    // ✅ Constructor Injection (BEST PRACTICE)
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // ✅ Save Patient
    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    // ✅ Get All Patients
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // ✅ Get Patient By ID
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    // ✅ Update Patient
    public Patient updatePatient(Long id, Patient updatedPatient) {
        Patient patient = getPatientById(id);

        // 🔧 Update fields (change based on your entity)
        patient.setName(updatedPatient.getName());
        patient.setDisease(updatedPatient.getDisease());

        return patientRepository.save(patient);
    }

    // ✅ Delete Patient
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}