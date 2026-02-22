package com.example.task_manager.project;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.task_manager.project.entity.ProjectEntity;

/**
 * Repository interface for Project entities.
 */
public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID> {

  // Page<ProjectEntity> findActiveProjectsByTeam(UUID teamId, String search,
  // Pageable pageable);

  Optional<ProjectEntity> findById(UUID id);

  Optional<ProjectEntity> findByIdAndDeletedAtIsNull(UUID id);

  // All Active Project
  Page<ProjectEntity> findByTeamIdAndDeletedAtIsNull(UUID id, Pageable pageable);

  // All Existing Project
  Page<ProjectEntity> findByTeamId(UUID id, Pageable pageable);

  // Page<ProjectEntity> findActiveProjectsByTeam(UUID teamId, Pageable pageable);

  boolean existsByTeamIdAndNameAndDeletedAtIsNull(UUID teamId, String name);

  @Modifying(clearAutomatically = true)
  @Query("""
          UPDATE ProjectEntity p
          SET p.deletedAt = :deletedAt
          WHERE p.team.id = :teamId
            AND p.deletedAt IS NULL
      """)
  int softDeleteByTeamId(UUID teamId, Instant deletedAt);

}