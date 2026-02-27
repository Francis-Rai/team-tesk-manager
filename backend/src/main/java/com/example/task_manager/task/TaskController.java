package com.example.task_manager.task;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.task_manager.common.PageResponse;
import com.example.task_manager.task.dto.ChangeStatusRequest;
import com.example.task_manager.task.dto.CreateTaskRequest;
import com.example.task_manager.task.dto.TaskResponse;
import com.example.task_manager.task.dto.UpdateTaskDetailsRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller for managing tasks within projects.
 */
@RestController
@RequestMapping("/api/teams/{teamId}/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {

  private final TaskService taskService;

  /**
   * Create a new task within a project.
   * Owner only.
   */
  @PostMapping
  public ResponseEntity<TaskResponse> createTask(
      @PathVariable UUID projectId,
      @Valid @RequestBody CreateTaskRequest request,
      Authentication authentication) {

    return ResponseEntity.status(HttpStatus.CREATED.value())
        .body(taskService.createTask(projectId, request, authentication.getName()));
  }

  /**
   * Update task details (title, description, assignee).
   * Owner only.
   */
  @PatchMapping("/{taskId}")
  public ResponseEntity<TaskResponse> updateTask(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      @Valid @RequestBody UpdateTaskDetailsRequest request,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.updateTask(teamId, taskId, request, authentication.getName()));
  }

  /**
   * Delete a task.
   * Owner only.
   */
  @DeleteMapping("/{taskId}")
  public ResponseEntity<Void> deleteTask(
      @PathVariable UUID projectId,
      @PathVariable UUID taskId,
      Authentication authentication) {

    taskService.deleteTask(taskId, authentication.getName());

    return ResponseEntity.noContent().build();
  }

  /**
   * Change Status of a Task
   */
  @PatchMapping("/{taskId}/status")
  public ResponseEntity<TaskResponse> changeStatus(
      @PathVariable UUID teamId,
      @PathVariable UUID taskId,
      @Valid @RequestBody ChangeStatusRequest request,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.changeStatus(taskId, request, authentication.getName()));
  }

  /**
   * Change Assignee of a Task
   */
  @PatchMapping("/{taskId}/assignee/{userId}")
  public ResponseEntity<TaskResponse> changeAssignee(
      @PathVariable UUID teamId,
      @PathVariable UUID taskId,
      @PathVariable UUID userId,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.changeAssignee(teamId, taskId, userId, authentication.getName()));
  }

  /**
   * Change Support of a Task
   */
  @PatchMapping("/{taskId}/support/{userId}")
  public ResponseEntity<TaskResponse> changeSupport(
      @PathVariable UUID teamId,
      @PathVariable UUID taskId,
      @PathVariable UUID userId,
      Authentication authentication) {

    return ResponseEntity.ok(taskService.changeSupport(teamId, taskId, userId, authentication.getName()));
  }

  /**
   * Get all active tasks for a project.
   */
  @GetMapping("/task-all")
  public PageResponse<TaskResponse> getAllExistingTask(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return taskService.getAllExistingTaskByProjectId(teamId, projectId, authentication.getName(), pageable);
  }

  /**
   * Get all active tasks for a project.
   */
  @GetMapping
  public PageResponse<TaskResponse> getAllActiveTask(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return taskService.getAllActiveTasksByProjectId(teamId, projectId, authentication.getName(), pageable);
  }
}
