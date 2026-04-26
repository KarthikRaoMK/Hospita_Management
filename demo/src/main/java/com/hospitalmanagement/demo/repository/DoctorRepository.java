package com.hospitalmanagement.demo.repository;

import com.hospitalmanagement.demo.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}
