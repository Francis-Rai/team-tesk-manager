package com.example.task_manager.task;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.task_manager.task.entity.TaskUpdateEntity;

/**
 * Repository interface for TaskUpdate entities.
 */
public interface TaskUpdateRepository extends JpaRepository<TaskUpdateEntity, UUID> {
  Page<TaskUpdateEntity> findByTaskIdAndTaskDeletedAtIsNull(UUID taskId, Pageable pageable);

  Page<TaskUpdateEntity> findByTaskId(UUID taskId, Pageable pageable);

  @Query("""
      SELECT u FROM TaskUpdateEntity u
      JOIN u.task t
      WHERE t.project.id = :projectId
      AND t.deletedAt IS NULL """)
  Page<TaskUpdateEntity> findProjectActivity(
      UUID projectId,
      Pageable pageable);

  @Query("""
      SELECT u FROM TaskUpdateEntity u
      JOIN u.task t
      JOIN t.project p
      WHERE p.team.id = :teamId
      AND t.deletedAt IS NULL
            """)
  Page<TaskUpdateEntity> findTeamActivity(
      UUID teamId,
      Pageable pageable);

}