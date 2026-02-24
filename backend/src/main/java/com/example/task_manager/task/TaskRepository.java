package com.example.task_manager.task;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.task_manager.task.entity.TaskEntity;

/**
 * Repository interface for Task entities.
 */
public interface TaskRepository extends JpaRepository<TaskEntity, UUID> {
  List<TaskEntity> findByProjectId(UUID projectId);

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
}
