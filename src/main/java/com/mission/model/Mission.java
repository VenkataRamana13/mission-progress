package com.mission.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Mission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Boolean completed;
    private Integer rating;

    @ManyToOne
    @JoinColumn(name = "operation_id")
    private Operation operation;
} 