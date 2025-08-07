package com.mission.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @jakarta.validation.constraints.NotBlank(message = "Task title must not be blank")
    @jakarta.validation.constraints.Size(max = 255, message = "Task title must be at most 255 characters")
    private String title;

    @jakarta.validation.constraints.NotNull(message = "Task difficulty must be provided")
    @jakarta.validation.constraints.Min(value = 1, message = "Task difficulty must be at least 1")
    @jakarta.validation.constraints.Max(value = 10, message = "Task difficulty must be at most 10")
    private Integer difficulty;
    private Boolean completed = false;

    @ManyToOne
    @JoinColumn(name = "mission_id")
    @JsonBackReference
    private Mission mission;
} 