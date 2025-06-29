package com.mission.controller;

import com.mission.model.Mission;
import com.mission.service.MissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/missions")
@CrossOrigin(origins = "http://localhost:5173")
public class MissionController {
    private final MissionService missionService;

    @Autowired
    public MissionController(MissionService missionService) {
        this.missionService = missionService;
    }

    @GetMapping
    public ResponseEntity<Page<Mission>> getAllMissions(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<Mission> missions = missionService.getAllMissions(pageRequest);
        return ResponseEntity.ok(missions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mission> getMission(@PathVariable Long id) {
        Mission mission = missionService.getMission(id);
        return ResponseEntity.ok(mission);
    }

    @PostMapping("/operation/{operationId}")
    public ResponseEntity<Mission> createMission(@PathVariable Long operationId, @RequestBody Mission mission) {
        Mission createdMission = missionService.createMission(operationId, mission);
        return ResponseEntity.ok(createdMission);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mission> updateMission(@PathVariable Long id, @RequestBody Mission mission) {
        Mission updatedMission = missionService.updateMission(id, mission);
        return ResponseEntity.ok(updatedMission);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMission(@PathVariable Long id) {
        missionService.deleteMission(id);
        return ResponseEntity.ok().build();
    }
} 