package com.mission.service;

import com.mission.model.Mission;
import com.mission.model.Operation;
import com.mission.repository.MissionRepository;
import com.mission.repository.OperationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MissionService {
    private final MissionRepository missionRepository;
    private final OperationRepository operationRepository;

    @Autowired
    public MissionService(MissionRepository missionRepository, OperationRepository operationRepository) {
        this.missionRepository = missionRepository;
        this.operationRepository = operationRepository;
    }

    public List<Mission> getAllMissions() {
        return missionRepository.findAll();
    }

    public Mission getMission(Long id) {
        return missionRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Mission not found with id: " + id));
    }

    @Transactional
    public Mission createMission(Long operationId, Mission mission) {
        Operation operation = operationRepository.findById(operationId)
            .orElseThrow(() -> new EntityNotFoundException("Operation not found with id: " + operationId));
        
        mission.setOperation(operation);
        Mission savedMission = missionRepository.save(mission);
        operation.addMission(savedMission);
        operationRepository.save(operation);
        
        return savedMission;
    }

    @Transactional
    public Mission updateMission(Long id, Mission missionDetails) {
        Mission mission = getMission(id);
        
        mission.setTitle(missionDetails.getTitle());
        mission.setDescription(missionDetails.getDescription());
        mission.setCompleted(missionDetails.getCompleted());
        
        return missionRepository.save(mission);
    }

    @Transactional
    public void deleteMission(Long id) {
        Mission mission = getMission(id);
        Operation operation = mission.getOperation();
        operation.removeMission(mission);
        operationRepository.save(operation);
        missionRepository.delete(mission);
    }
} 