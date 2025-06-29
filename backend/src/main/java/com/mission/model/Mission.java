package com.mission.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;

@Entity
@Data
public class Mission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Boolean completed = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "mission", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Task> tasks = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "operation_id")
    @JsonBackReference
    private Operation operation;

    // Helper method to add a task
    public void addTask(Task task) {
        tasks.add(task);
        task.setMission(this);
    }

    // Helper method to remove a task
    public void removeTask(Task task) {
        tasks.remove(task);
        task.setMission(null);
    }
} 