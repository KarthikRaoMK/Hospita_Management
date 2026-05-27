package com.hospitalmanagement.demo.controller;

import com.hospitalmanagement.demo.dto.PatientDTO;
import com.hospitalmanagement.demo.entity.Patient;
import com.hospitalmanagement.demo.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin("*")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<?> registerPatient(@Valid @RequestBody PatientDTO dto, Authentication authentication) {

        boolean isDoctor = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DOCTOR"));
        com.hospitalmanagement.demo.entity.Doctor doctor = null;

        if (isDoctor) {
            doctor = patientService.getDoctorByEmail(authentication.getName());
            if (doctor == null) {
                return ResponseEntity.badRequest().body("Doctor profile not found for the logged-in user. Please ask Admin to recreate your Doctor profile.");
            }
        }

        Patient patient = new Patient();
        patient.setName(dto.getName());
        patient.setAge(dto.getAge());
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setDisease(dto.getDisease());

        Patient savedPatient = patientService.savePatient(patient);
        
        if (isDoctor && doctor != null) {
            patientService.assignDoctor(savedPatient.getId(), doctor.getId());
        }

        return ResponseEntity.ok(savedPatient);
    }

    @GetMapping
    public ResponseEntity<List<com.hospitalmanagement.demo.dto.PatientResponseDTO>> getAllPatients(Authentication authentication) {
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DOCTOR"))) {
            return ResponseEntity.ok(patientService.getPatientsForDoctorWithStatus(authentication.getName()));
        }
        return ResponseEntity.ok(patientService.getAllPatientsWithStatus());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<com.hospitalmanagement.demo.dto.PatientResponseDTO> updatePatient(@PathVariable Long id,
                                                 @Valid @RequestBody PatientDTO dto) {

        patientService.updatePatient(id, dto);
        
        // Return updated patient with mapped status/doctor
        Patient updated = patientService.getPatientById(id);
        com.hospitalmanagement.demo.dto.PatientResponseDTO responseDto = new com.hospitalmanagement.demo.dto.PatientResponseDTO();
        responseDto.setId(updated.getId());
        responseDto.setName(updated.getName());
        responseDto.setAge(updated.getAge());
        responseDto.setBloodGroup(updated.getBloodGroup());
        responseDto.setDisease(updated.getDisease());
        if (updated.getAssignedDoctor() != null) {
            responseDto.setAssignedDoctorId(updated.getAssignedDoctor().getId());
            responseDto.setAssignedDoctorName(updated.getAssignedDoctor().getName());
        }
        if (updated.getAppointments() != null && !updated.getAppointments().isEmpty()) {
            com.hospitalmanagement.demo.entity.Appointment latestAppt = updated.getAppointments().get(updated.getAppointments().size() - 1);
            responseDto.setStatus(latestAppt.getStatus());
            responseDto.setPrescription(latestAppt.getPrescription());
            responseDto.setAppointmentId(latestAppt.getId());
        }
        
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok("Patient deleted successfully");
    }


    @GetMapping("/search")
    public ResponseEntity<List<com.hospitalmanagement.demo.dto.PatientResponseDTO>> search(@RequestParam String disease) {
        return ResponseEntity.ok(patientService.searchByDisease(disease));
    }

    @PostMapping("/{patientId}/assign/{doctorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> assignDoctor(@PathVariable Long patientId, @PathVariable Long doctorId) {
        patientService.assignDoctor(patientId, doctorId);
        return ResponseEntity.ok("Patient assigned successfully");
    }

    @PutMapping("/{patientId}/treat")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> treatPatient(@PathVariable Long patientId, @RequestBody java.util.Map<String, String> payload, Authentication authentication) {
        try {
            return ResponseEntity.ok(patientService.treatPatientByDoctor(patientId, authentication.getName(), payload.get("prescription")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}