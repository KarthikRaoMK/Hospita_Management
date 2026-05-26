package com.hospitalmanagement.demo.controller;

import com.hospitalmanagement.demo.entity.Appointment;
import com.hospitalmanagement.demo.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin("*")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @PutMapping("/{id}/treat")
    public ResponseEntity<Appointment> treatPatient(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus("TREATED");
        appointment.setPrescription(payload.get("prescription"));
        
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }
}
