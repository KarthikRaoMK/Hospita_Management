package com.hospitalmanagement.demo.repository;

import com.hospitalmanagement.demo.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient,Long> {

}
