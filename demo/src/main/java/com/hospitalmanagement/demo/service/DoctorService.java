package com.hospitalmanagement.demo.service;

import com.hospitalmanagement.demo.entity.Doctor;
import com.hospitalmanagement.demo.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    // ✅ Save
    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
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
}