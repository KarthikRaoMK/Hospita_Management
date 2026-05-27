package com.hospitalmanagement.demo.service;

import com.hospitalmanagement.demo.entity.Doctor;
import com.hospitalmanagement.demo.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.security.crypto.password.PasswordEncoder;
import com.hospitalmanagement.demo.entity.User;
import com.hospitalmanagement.demo.entity.Role;
import com.hospitalmanagement.demo.repository.UserRepository;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Doctor saveDoctor(Doctor doctor) {
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
        Doctor savedDoctor = doctorRepository.save(doctor);

        userRepository.findByEmail(savedDoctor.getEmail()).ifPresentOrElse(
            existingUser -> {
                existingUser.setRole(Role.DOCTOR);
                existingUser.setPassword(savedDoctor.getPassword());
                userRepository.save(existingUser);
            },
            () -> {
                User user = new User();
                user.setEmail(savedDoctor.getEmail());
                user.setPassword(savedDoctor.getPassword());
                user.setRole(Role.DOCTOR);
                userRepository.save(user);
            }
        );

        return savedDoctor;
    }

    // ✅ Get All
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // ✅ Get By ID
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    // ✅ Update
    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {
        Doctor doctor = getDoctorById(id);

        doctor.setName(updatedDoctor.getName()); // adjust fields
        doctor.setSpecialization(updatedDoctor.getSpecialization());

        return doctorRepository.save(doctor);
    }

    // ✅ Delete
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    public List<com.hospitalmanagement.demo.dto.DoctorWithPatientsDTO> getDoctorsWithPatients() {
        List<Doctor> doctors = doctorRepository.findAll();
        return doctors.stream().map(doctor -> {
            com.hospitalmanagement.demo.dto.DoctorWithPatientsDTO dto = new com.hospitalmanagement.demo.dto.DoctorWithPatientsDTO();
            dto.setId(doctor.getId());
            dto.setName(doctor.getName());
            dto.setSpecialization(doctor.getSpecialization());
            dto.setEmail(doctor.getEmail());
            
            List<com.hospitalmanagement.demo.dto.AppointmentDTO> appointments = doctor.getAppointments() != null 
                    ? doctor.getAppointments().stream()
                        .map(app -> {
                            com.hospitalmanagement.demo.dto.AppointmentDTO appDto = new com.hospitalmanagement.demo.dto.AppointmentDTO();
                            appDto.setId(app.getId());
                            appDto.setDate(app.getDate());
                            appDto.setStatus(app.getStatus());
                            appDto.setPrescription(app.getPrescription());
                            appDto.setPatient(app.getPatient());
                            return appDto;
                        })
                        .toList()
                    : java.util.Collections.emptyList();
            dto.setAppointments(appointments);
            return dto;
        }).toList();
    }

    public List<com.hospitalmanagement.demo.dto.PatientResponseDTO> getPatientsForDoctorIdAndStatus(Long doctorId, String status) {
        Doctor doctor = getDoctorById(doctorId);
        if (doctor.getAppointments() == null) return List.of();
        
        return doctor.getAppointments().stream()
                .filter(app -> status == null || status.equalsIgnoreCase(app.getStatus()))
                .map(app -> {
                    com.hospitalmanagement.demo.entity.Patient p = app.getPatient();
                    com.hospitalmanagement.demo.dto.PatientResponseDTO dto = new com.hospitalmanagement.demo.dto.PatientResponseDTO();
                    dto.setId(p.getId());
                    dto.setName(p.getName());
                    dto.setAge(p.getAge());
                    dto.setBloodGroup(p.getBloodGroup());
                    dto.setDisease(p.getDisease());
                    if (p.getAssignedDoctor() != null) {
                        dto.setAssignedDoctorId(p.getAssignedDoctor().getId());
                        dto.setAssignedDoctorName(p.getAssignedDoctor().getName());
                    }
                    dto.setStatus(app.getStatus());
                    dto.setPrescription(app.getPrescription());
                    dto.setAppointmentId(app.getId());
                    return dto;
                })
                .distinct() // This might be tricky if the same patient has multiple appointments. But distinct on DTO doesn't work out of box without equals/hashcode. Let's just group by Patient ID or just return the list.
                .toList();
    }
}