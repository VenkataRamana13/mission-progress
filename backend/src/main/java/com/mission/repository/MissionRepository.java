package com.mission.repository;

import com.mission.model.Mission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {
} 