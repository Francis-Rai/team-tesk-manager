package com.example.task_manager.team;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.task_manager.team.entity.TeamEntity;

/**
 * Repository interface for Team entities.
 */
public interface TeamRepository extends JpaRepository<TeamEntity, UUID> {

  @EntityGraph(attributePaths = { "members", "members.user" })
  Optional<TeamEntity> findWithMembersById(UUID id);
}
