package com.hospitalmanagement.demo.dto;

import com.hospitalmanagement.demo.entity.Patient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {
    private Long id;
    private String date;
    private String status;
    private String prescription;
    private Patient patient;
}
