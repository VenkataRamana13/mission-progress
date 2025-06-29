package com.mission.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Operation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private LocalDateTime startDate = LocalDateTime.now();
    private LocalDateTime endDate;
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, CANCELLED

    @OneToMany(mappedBy = "operation", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Mission> missions = new ArrayList<>();

    // Helper method to add a mission
    public void addMission(Mission mission) {
        missions.add(mission);
        mission.setOperation(this);
    }

    // Helper method to remove a mission
    public void removeMission(Mission mission) {
        missions.remove(mission);
        mission.setOperation(null);
    }
} 