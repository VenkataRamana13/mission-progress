package com.mission.controller;

import com.mission.model.Operation;
import com.mission.service.OperationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/operations")
@CrossOrigin(origins = "http://localhost:5173")
public class OperationController {
    private final OperationService operationService;

    @Autowired
    public OperationController(OperationService operationService) {
        this.operationService = operationService;
    }

    @GetMapping
    public ResponseEntity<List<Operation>> getAllOperations() {
        List<Operation> operations = operationService.getAllOperations();
        return ResponseEntity.ok(operations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Operation> getOperation(@PathVariable Long id) {
        Operation operation = operationService.getOperation(id);
        return ResponseEntity.ok(operation);
    }

    @PostMapping
    public ResponseEntity<Operation> createOperation(@RequestBody Operation operation) {
        Operation createdOperation = operationService.createOperation(operation);
        return ResponseEntity.ok(createdOperation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Operation> updateOperation(@PathVariable Long id, @RequestBody Operation operation) {
        Operation updatedOperation = operationService.updateOperation(id, operation);
        return ResponseEntity.ok(updatedOperation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOperation(@PathVariable Long id) {
        operationService.deleteOperation(id);
        return ResponseEntity.ok().build();
    }
} 