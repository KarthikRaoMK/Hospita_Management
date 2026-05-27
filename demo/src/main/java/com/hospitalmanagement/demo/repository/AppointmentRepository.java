package com.hospitalmanagement.demo.repository;

import com.hospitalmanagement.demo.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByPatientId(Long patientId);
    Optional<Appointment> findByPatientIdAndDoctorIdAndStatus(Long patientId, Long doctorId, String status);
}
