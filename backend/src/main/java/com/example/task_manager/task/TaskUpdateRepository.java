package com.example.task_manager.task;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.task_manager.task.entity.TaskUpdateEntity;

/**
 * Repository interface for TaskUpdate entities.
 */
public interface TaskUpdateRepository extends JpaRepository<TaskUpdateEntity, UUID> {
  Page<TaskUpdateEntity> findByTaskIdAndTaskDeletedAtIsNull(
      UUID taskId,
      Pageable pageable);

  @Query("""
          SELECT tu
          FROM TaskUpdateEntity tu
          JOIN FETCH tu.createdBy
          WHERE tu.task.id = :taskId
            AND tu.task.deletedAt IS NULL
          ORDER BY tu.createdAt DESC
      """)
  List<TaskUpdateEntity> findAllWithUserByTaskId(@Param("taskId") UUID taskId);

}