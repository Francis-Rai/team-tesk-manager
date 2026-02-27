package com.example.task_manager.task;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.task_manager.task.entity.TaskEntity;

/**
 * Repository interface for Task entities.
 */
public interface TaskRepository extends JpaRepository<TaskEntity, UUID> {
  Page<TaskEntity> findByProjectId(UUID projectId, Pageable pageable);

  Optional<TaskEntity> findByIdAndDeletedAtIsNull(UUID id);

  boolean existsByIdAndDeletedAtIsNull(UUID id);

  Page<TaskEntity> findByProjectIdAndDeletedAtIsNull(UUID projectId, Pageable pageable);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("""
          UPDATE TaskEntity t
          SET t.deletedAt = :deletedAt
          WHERE t.project.id = :projectId
            AND t.deletedAt IS NULL
      """)
  int softDeleteByProjectId(UUID projectId, Instant deletedAt);

  @Modifying(clearAutomatically = true)
  @Query("""
          UPDATE TaskEntity t
          SET t.deletedAt = :deletedAt
          WHERE t.project.team.id = :teamId
            AND t.deletedAt IS NULL
      """)
  int softDeleteByTeamId(UUID teamId, Instant deletedAt);

  @Query("""
          SELECT COALESCE(MAX(t.taskNumber), 0)
          FROM TaskEntity t
          WHERE t.project.id = :projectId
      """)
  Long findMaxTaskNumberByProject(UUID projectId);
}
