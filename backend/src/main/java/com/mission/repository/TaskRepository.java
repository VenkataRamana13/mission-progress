package com.mission.repository;

import com.mission.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
} 