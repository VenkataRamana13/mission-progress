package com.mission.repository;

import com.mission.model.Operation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface OperationRepository extends JpaRepository<Operation, Long> {
} 