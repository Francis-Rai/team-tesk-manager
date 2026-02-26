package com.example.task_manager.task;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.task_manager.common.PageResponse;
import com.example.task_manager.exception.api.BadRequestInputException;
import com.example.task_manager.exception.api.ConflictException;
import com.example.task_manager.exception.api.ForbiddenException;
import com.example.task_manager.exception.api.ResourceNotFoundException;
import com.example.task_manager.project.ProjectRepository;
import com.example.task_manager.project.entity.ProjectEntity;
import com.example.task_manager.task.dto.CreateTaskRequest;
import com.example.task_manager.task.dto.TaskResponse;
import com.example.task_manager.task.dto.TaskUpdateResponse;
import com.example.task_manager.task.dto.UpdateTaskRequest;
import com.example.task_manager.task.entity.TaskEntity;
import com.example.task_manager.task.entity.TaskStatus;
import com.example.task_manager.task.entity.TaskUpdateEntity;
import com.example.task_manager.team.TeamMemberRepository;
import com.example.task_manager.team.entity.TeamMemberEntity;
import com.example.task_manager.team.entity.TeamRole;
import com.example.task_manager.user.UserRepository;
import com.example.task_manager.user.entity.UserEntity;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * Handles business logic for tasks.
 */
@Service
@RequiredArgsConstructor
public class TaskService {

  private final TaskRepository taskRepository;
  private final ProjectRepository projectRepository;
  private final TeamMemberRepository teamMemberRepository;
  private final UserRepository userRepository;
  private final TaskUpdateRepository taskUpdateRepository;

  /**
   * Creates task under project and optionally add a support user.
   */
  @Transactional
  public TaskResponse createTask(
      UUID projectId,
      CreateTaskRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getActiveProject(projectId);

    UUID teamId = project.getTeam().getId();

    validateCanManageProjectTask(teamId, requester.getId());
    validateDates(request.plannedStartDate(), request.plannedDueDate());

    TeamMemberEntity assigneeMember = getMembership(teamId, request.assigneeId());

    TeamMemberEntity supportMember = new TeamMemberEntity();

    if (request.supportId() != null) {
      supportMember = getMembership(teamId, request.supportId());
      validateAssignment(project.getTeam().getId(),
          request.assigneeId(),
          request.supportId());
    }

    Long taskNumber = project.getNextTaskNumber();

    TaskEntity task = new TaskEntity();
    task.setProject(project);
    task.setTaskNumber(taskNumber);
    task.setTitle(request.title());
    task.setDescription(request.description());
    task.setStatus(TaskStatus.TODO);
    task.setPriority(request.priority());
    task.setPlannedStartDate(request.plannedStartDate());
    task.setPlannedDueDate(request.plannedDueDate());

    task.setAssignee(assigneeMember.getUser());
    task.setSupport(request.supportId() == null
        ? null
        : supportMember.getUser());

    taskRepository.save(task);
    project.setNextTaskNumber(taskNumber + 1);

    return mapToResponse(task);
  }

  /**
   * Updates task.
   */
  @Transactional
  public TaskResponse updateTask(
      UUID taskId,
      UpdateTaskRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TaskEntity task = getActiveTask(taskId);

    validateCanManageProjectTask(task.getProject().getTeam().getId(), requester.getId());

    if (request.title() != null) {
      task.setTitle(request.title());
    }

    if (request.description() != null) {
      task.setDescription(request.description());
    }

    if (request.priority() != null) {
      task.setPriority(request.priority());
    }

    Instant newPlannedStart = request.plannedStartDate() != null
        ? request.plannedStartDate()
        : task.getPlannedStartDate();

    Instant newPlannedDue = request.plannedDueDate() != null
        ? request.plannedDueDate()
        : task.getPlannedDueDate();

    validateDates(newPlannedStart, newPlannedDue);

    task.setPlannedStartDate(newPlannedStart);
    task.setPlannedDueDate(newPlannedDue);

    return mapToResponse(task);
  }

  /**
   * Deletes task.
   */
  @Transactional
  public void deleteTask(UUID taskId, String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TaskEntity task = getActiveTask(taskId);

    validateCanManageProjectTask(taskId, requester.getId());

    task.setDeletedAt(Instant.now());
  }

  /**
   * Change the status of a task
   */
  @Transactional
  public TaskResponse changeStatus(UUID taskId, TaskStatus newStatus, String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);
    TaskEntity task = getActiveTask(taskId);

    validateCanChangeStatusAndUpdate(task, requester.getId());
    validateStatusTransition(task.getStatus(), newStatus);

    TaskStatus current = task.getStatus();

    // Transition effects
    if (newStatus == TaskStatus.IN_PROGRESS && task.getActualStartDate() == null) {
      task.setActualStartDate(Instant.now());
    }

    if (newStatus == TaskStatus.DONE) {
      task.setActualCompletionDate(Instant.now());
    }

    // Reopen scenario
    if (current == TaskStatus.DONE && newStatus == TaskStatus.IN_PROGRESS) {
      task.setActualCompletionDate(null);
    }

    task.setStatus(newStatus);
    return mapToResponse(task);
  }

  /**
   * Create an update for a task
   */
  @Transactional
  public TaskUpdateResponse addTaskUpdate(UUID taskId, String message, String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TaskEntity task = getActiveTask(taskId);

    validateCanChangeStatusAndUpdate(task, requester.getId());

    TaskUpdateEntity update = new TaskUpdateEntity();
    update.setTask(task);
    update.setMessage(message);
    update.setCreatedBy(requester);

    taskUpdateRepository.save(update);

    return mapToUpdateResponse(update);
  }

  /**
   * Returns all existing tasks of a project.
   */
  public PageResponse<TaskResponse> getAllExistingTaskByProjectId(
      UUID projectId,
      Pageable pageable,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getActiveProject(projectId);

    validateMembership(project.getTeam().getId(), requester.getId());

    Page<TaskEntity> page = taskRepository.findByProjectId(project.getId(), pageable);

    return new PageResponse<>(
        page.map(this::mapToResponse).getContent(),
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast());
  }

  /**
   * Returns all active tasks of a project.
   */
  @Transactional(readOnly = true)
  public PageResponse<TaskResponse> getAllActiveTasksByProjectId(
      UUID projectId,
      String requesterEmail,
      Pageable pageable) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getActiveProject(projectId);

    validateMembership(project.getTeam().getId(), requester.getId());

    Page<TaskEntity> page = taskRepository
        .findByProjectIdAndDeletedAtIsNull(projectId, pageable);

    return new PageResponse<>(
        page.map(this::mapToResponse).getContent(),
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast());
  }

  // HELPERS

  /**
   * Maps TaskEntity to TaskResponse.
   */
  private TaskResponse mapToResponse(TaskEntity task) {
    TaskResponse.TaskUser assignedUser = new TaskResponse.TaskUser(task.getAssignee().getId(),
        task.getAssignee().getFirstName(),
        task.getAssignee().getLastName(),
        task.getAssignee().getEmail());

    TaskResponse.TaskUser supportUser = null;
    if (task.getSupport() != null) {
      supportUser = new TaskResponse.TaskUser(task.getSupport().getId(),
          task.getSupport().getFirstName(),
          task.getSupport().getLastName(),
          task.getSupport().getEmail());
    }

    return new TaskResponse(
        task.getId(),
        task.getTitle(),
        task.getDescription(),
        task.getStatus(),
        task.getPriority(),
        assignedUser,
        supportUser,
        task.getTaskNumber(),
        task.getPlannedStartDate(),
        task.getPlannedDueDate(),
        task.getActualStartDate(),
        task.getActualCompletionDate(),
        task.getCreatedAt(),
        task.getUpdatedAt());
  }

  /**
   * Maps TaskUpdateEntity to TaskUpdateResponse.
   */
  public TaskUpdateResponse mapToUpdateResponse(TaskUpdateEntity entity) {
    return new TaskUpdateResponse(
        entity.getId(),
        entity.getMessage(),
        entity.getCreatedBy().getId(),
        entity.getCreatedBy().getFirstName(),
        entity.getCreatedAt());
  }

  /**
   * Returns the user by email
   */
  private UserEntity getUserByEmail(String email) {
    UserEntity user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    return user;
  }

  /**
   * Ensures:
   * - Team exists
   * - Team not deleted
   * - Membership exists
   *
   * Returns membership entity.
   * Uses ResourceNotFound to prevent ID probing.
   */
  private TeamMemberEntity getMembership(UUID teamId, UUID userId) {
    TeamMemberEntity member = teamMemberRepository
        .findByTeamIdAndUserIdAndTeamDeletedAtIsNull(teamId, userId)
        .orElseThrow(() -> new ForbiddenException("User is not a team member"));
    return member;
  }

  /**
   * Checks if a User is member of a team
   */
  private void validateMembership(UUID teamId, UUID userId) {
    validateUserExist(userId);

    if (!teamMemberRepository.existsByTeamIdAndUserId(teamId, userId)) {
      throw new ConflictException("User must belong to the same team");
    }
  }

  /**
   * Checks if a User exist
   */
  private void validateUserExist(UUID id) {
    boolean user = userRepository.existsById(id);
    if (!user) {
      throw new ResourceNotFoundException("Team not found");
    }
  }

  /**
   * Ensures:
   * - Project exists
   * - Project not deleted
   * - Membership exists
   *
   * Returns project entity.
   * Uses ResourceNotFound to prevent ID probing.
   */
  private ProjectEntity getActiveProject(UUID projectId) {
    return projectRepository.findByIdAndDeletedAtIsNull(projectId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
  }

  /**
   * Ensures:
   * - Task exists
   * - Task not deleted
   * - Membership exists
   *
   * Returns task entity.
   * Uses ResourceNotFound to prevent ID probing.
   */
  private TaskEntity getActiveTask(UUID taskId) {
    return taskRepository.findByIdAndDeletedAtIsNull(taskId)
        .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
  }

  /**
   * Ensures:
   * - User is Team member
   * - Role is Team OWNER or ADMIN
   */
  private void validateCanManageProjectTask(UUID teamId, UUID userId) {
    TeamMemberEntity member = getMembership(teamId, userId);

    if (member.getRole() != TeamRole.OWNER &&
        member.getRole() != TeamRole.ADMIN) {
      throw new ForbiddenException("Insufficient permissions");
    }
  }

  /**
   * Checks if Start Date < Due Date
   */
  private void validateDates(Instant start, Instant due) {
    if (due.isBefore(start)) {
      throw new ConflictException("Due date must be after start date");
    }
  }

  /**
   * Ensures:
   * - User is Owner, Admin, Assignee, or Support
   */
  private void validateCanChangeStatusAndUpdate(TaskEntity task, UUID userId) {
    UUID teamId = task.getProject().getTeam().getId();

    TeamMemberEntity member = getMembership(teamId, userId);

    boolean allowed = member.getRole() == TeamRole.OWNER ||
        member.getRole() == TeamRole.ADMIN ||
        task.getAssignee().getId().equals(userId) ||
        (task.getSupport() != null && task.getSupport().getId().equals(userId));

    if (!allowed) {
      throw new ForbiddenException("Cannot change task status");
    }
  }

  /**
   * Ensures:
   * - Task status cannot be set to todo
   */
  private void validateStatusTransition(TaskStatus current, TaskStatus next) {
    if (next == TaskStatus.TODO && current != TaskStatus.TODO) {
      throw new BadRequestInputException("Cannot transition back to TODO");
    }
  }

  /**
   * Ensures:
   * - Assignee is not Support
   */
  private void validateAssignment(
      UUID teamId,
      UUID assigneeId,
      UUID supportId) {

    if (assigneeId.equals(supportId)) {
      throw new ConflictException("Assignee and support cannot be the same");
    }
  }

}
