package com.hospitalmanagement.demo.dto;



import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class PatientDTO {

    @NotBlank
    private String name;

    @Min(0)
    private int age;

    @NotBlank
    private String disease;

    @NotBlank
    private String bloodGroup;
}