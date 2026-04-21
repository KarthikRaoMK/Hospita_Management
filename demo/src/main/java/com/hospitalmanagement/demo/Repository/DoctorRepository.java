package com.hospitalmanagement.demo.Repository;

import com.hospitalmanagement.demo.Entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}
