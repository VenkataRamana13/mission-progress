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

    private String title;
    private Integer difficulty;
    private Boolean completed = false;

    @ManyToOne
    @JoinColumn(name = "mission_id")
    @JsonBackReference
    private Mission mission;
} 