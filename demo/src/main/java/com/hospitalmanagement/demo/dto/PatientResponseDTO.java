package com.hospitalmanagement.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponseDTO {
    private Long id;
    private String name;
    private int age;
    private String bloodGroup;
    private String disease;
    private String status;
    private String prescription;
    private Long appointmentId;
    private Long assignedDoctorId;
    private String assignedDoctorName;
}
