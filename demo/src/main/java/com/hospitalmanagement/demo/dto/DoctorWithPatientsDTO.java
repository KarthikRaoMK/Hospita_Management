package com.hospitalmanagement.demo.dto;

import com.hospitalmanagement.demo.entity.Patient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorWithPatientsDTO {
    private Long id;
    private String name;
    private String specialization;
    private String email;
    private List<AppointmentDTO> appointments;
}
