package com.mission.service;

import com.mission.model.Mission;
import com.mission.model.Task;
import com.mission.repository.MissionRepository;
import com.mission.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final MissionRepository missionRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, MissionRepository missionRepository) {
        this.taskRepository = taskRepository;
        this.missionRepository = missionRepository;
    }

    @Transactional
    public Task createTask(Long missionId, Task task) {
        Mission mission = missionRepository.findById(missionId)
            .orElseThrow(() -> new EntityNotFoundException("Mission not found with id: " + missionId));
        
        task.setMission(mission);
        Task savedTask = taskRepository.save(task);
        mission.addTask(savedTask);
        missionRepository.save(mission);
        
        return savedTask;
    }

    public List<Task> getTasksByMissionId(Long missionId) {
        Mission mission = missionRepository.findById(missionId)
            .orElseThrow(() -> new EntityNotFoundException("Mission not found with id: " + missionId));
        return mission.getTasks();
    }

    public Task getTask(Long taskId) {
        return taskRepository.findById(taskId)
            .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));
    }

    @Transactional
    public Task updateTask(Long taskId, Task taskDetails) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));
        
        // Only update fields if they are provided in the request
        if (taskDetails.getTitle() != null) {
            task.setTitle(taskDetails.getTitle());
        }
        if (taskDetails.getDifficulty() != null) {
            task.setDifficulty(taskDetails.getDifficulty());
        }
        if (taskDetails.getCompleted() != null) {
            task.setCompleted(taskDetails.getCompleted());
        }
        
        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));
        
        Mission mission = task.getMission();
        mission.removeTask(task);
        missionRepository.save(mission);
        taskRepository.delete(task);
    }
} 