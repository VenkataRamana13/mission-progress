package com.mission.service;

import com.mission.model.Operation;
import com.mission.repository.OperationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OperationService {
    private final OperationRepository operationRepository;

    @Autowired
    public OperationService(OperationRepository operationRepository) {
        this.operationRepository = operationRepository;
    }

    public List<Operation> getAllOperations() {
        return operationRepository.findAll();
    }

    public Operation getOperation(Long id) {
        return operationRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Operation not found with id: " + id));
    }

    @Transactional
    public Operation createOperation(Operation operation) {
        return operationRepository.save(operation);
    }

    @Transactional
    public Operation updateOperation(Long id, Operation operationDetails) {
        Operation operation = getOperation(id);
        
        operation.setName(operationDetails.getName());
        operation.setDescription(operationDetails.getDescription());
        operation.setEndDate(operationDetails.getEndDate());
        operation.setStatus(operationDetails.getStatus());
        
        return operationRepository.save(operation);
    }

    @Transactional
    public void deleteOperation(Long id) {
        Operation operation = getOperation(id);
        operationRepository.delete(operation);
    }
} 