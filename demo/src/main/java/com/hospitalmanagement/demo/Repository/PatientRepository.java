package com.hospitalmanagement.demo.Repository;

import com.hospitalmanagement.demo.Entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient,Long> {

}
