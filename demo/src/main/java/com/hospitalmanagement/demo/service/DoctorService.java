package com.hospitalmanagement.demo.service;

import com.hospitalmanagement.demo.entity.Doctor;
import com.hospitalmanagement.demo.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
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
}