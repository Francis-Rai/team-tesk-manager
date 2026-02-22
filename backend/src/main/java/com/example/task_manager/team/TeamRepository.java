package com.example.task_manager.team;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.task_manager.team.entity.TeamEntity;

/**
 * Repository interface for Team entities.
 */
public interface TeamRepository extends JpaRepository<TeamEntity, UUID> {
  // Optional<TeamEntity> findById(UUID id);
  // Optional<TeamEntity> findByIdAndDeletedAtIsNull(UUID id);
  // Boolean existByIdAndDeletedAtIsNull(UUID id);
}
