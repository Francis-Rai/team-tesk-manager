package com.example.task_manager.task;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.task_manager.exception.api.ConflictException;
import com.example.task_manager.exception.api.ForbiddenException;
import com.example.task_manager.exception.api.ResourceNotFoundException;
import com.example.task_manager.exception.api.UnauthorizedException;
import com.example.task_manager.project.ProjectRepository;
import com.example.task_manager.project.entity.ProjectEntity;
import com.example.task_manager.task.dto.CreateTaskRequest;
import com.example.task_manager.task.dto.TaskResponse;
import com.example.task_manager.task.dto.UpdateTaskRequest;
import com.example.task_manager.task.entity.TaskEntity;
import com.example.task_manager.task.entity.TaskStatus;
import com.example.task_manager.team.TeamMemberRepository;
import com.example.task_manager.team.entity.TeamMemberEntity;
import com.example.task_manager.team.entity.TeamRole;
import com.example.task_manager.user.UserRepository;
import com.example.task_manager.user.entity.UserEntity;

import jakarta.transaction.Transactional;
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

  /**
   * Creates task under project and optionally assigns user.
   */
  // public TaskResponse create(
  // UUID projectId,
  // CreateTaskRequest request,
  // String userEmail) {

  // ProjectEntity project = getOwnedProject(projectId, userEmail);

  // UserEntity assignee = resolveAssignee(request.assignedUserId());

  // TaskEntity task = new TaskEntity();
  // task.setTitle(request.title());
  // task.setDescription(request.description());
  // task.setStatus(
  // // default to TODO if no status provided
  // // default to TODO if not assigned to user
  // request.assignedUserId() != null && request.status() != null ?
  // request.status() : TaskStatus.TODO);
  // task.setProject(project);
  // task.setAssignee(assignee);

  // return mapToResponse(taskRepository.save(task));
  // }
  @Transactional
  public TaskResponse createTask(
      UUID projectId,
      CreateTaskRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = projectRepository
        .findByIdAndDeletedAtIsNull(projectId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

    validateCanManageProjectTask(project.getTeam().getId(), requester.getId());

    Long nextNumber = taskRepository
        .findMaxTaskNumberByProject(projectId) + 1;

    // 3️⃣ Create task
    TaskEntity task = new TaskEntity();
    task.setProject(project);
    task.setTaskNumber(nextNumber);
    task.setTitle(request.title());
    task.setDescription(request.description());
    task.setPriority(request.priority());
    task.setStatus(TaskStatus.TODO);

    // validate dates
    validateDates(request.startDate(), request.dueDate());

    task.setStartDate(request.startDate());
    task.setDueDate(request.dueDate());

    // validate assignee + support
    validateAssignment(project.getTeam().getId(),
        request.assigneeId(),
        request.supportId());

    task.setAssignee(getUserById(request.assigneeId()));
    task.setSupport(request.supportId() == null
        ? null
        : getUserById(request.supportId()));

    taskRepository.save(task);

    return mapToResponse(task);
  }

  /**
   * Updates task.
   *
   * Rules:
   * - Only project owner can edit title, description, assignee
   * - Project owner OR assigned user can update status
   */

  // public TaskResponse update(
  // UUID taskId,
  // UpdateTaskRequest request,
  // String userEmail) {

  // TaskEntity task = taskRepository.findById(taskId)
  // .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

  // boolean isOwner = task.getProject()
  // .getCreatedBy()
  // .getEmail()
  // .equals(userEmail);

  // boolean isAssignee = task.getAssignee() != null &&
  // task.getAssignee()
  // .getEmail()
  // .equals(userEmail);

  // if (!isOwner && !isAssignee) {
  // throw new UnauthorizedException();
  // }

  // // OWNER-ONLY FIELDS
  // if (isOwner) {

  // if (request.title() != null) {
  // task.setTitle(request.title());
  // }

  // if (request.description() != null) {
  // task.setDescription(request.description());
  // }

  // if (request.assignedUserId() != null) {
  // task.setAssignee(
  // resolveAssignee(request.assignedUserId()));
  // }
  // }

  // // OWNER OR ASSIGNEE
  // if (request.status() != null) {
  // task.setStatus(request.status());
  // }

  // return mapToResponse(taskRepository.save(task));
  // }
  @Transactional
  public TaskResponse updateTask(
      UUID taskId,
      UpdateTaskRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TaskEntity task = getActiveTask(taskId);

    validateProjectNotArchived(task.getProject());

    validateCanModifyTask(task, requester.getId());

    if (request.title() != null) {
      task.setTitle(request.title());
    }

    if (request.description() != null) {
      task.setDescription(request.description());
    }

    if (request.priority() != null) {
      task.setPriority(request.priority());
    }

    if (request.startDate() != null && request.dueDate() != null) {
      validateDates(request.startDate(), request.dueDate());
      task.setStartDate(request.startDate());
      task.setDueDate(request.dueDate());
    }

    return mapToResponse(task);
  }

  /**
   * Deletes task.
   * Owner only.
   */
  // public void delete(
  // UUID taskId,
  // String userEmail) {

  // TaskEntity task = getOwnedTask(taskId, userEmail);
  // taskRepository.delete(task);
  // }

  @Transactional
  public void deleteTask(UUID taskId, String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TaskEntity task = getActiveTask(taskId);

    validateProjectNotArchived(task.getProject());

    validateOwnerOrAdmin(task.getProject().getTeam().getId(),
        requester.getId());

    task.setDeletedAt(Instant.now());
  }

  // HELPERS

  /**
   * Returns the user by email
   */
  private UserEntity getUserByEmail(String email) {
    UserEntity user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    return user;
  }

  /**
   * Returns all tasks for a project.
   */
  public List<TaskResponse> getByProject(UUID projectId) {

    ProjectEntity project = projectRepository.findById(projectId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

    return taskRepository
        .findByProjectId(project.getId())
        .stream()
        .map(this::mapToResponse)
        .toList();
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
   * Returns the user by email
   */
  private UserEntity getUserById(UUID id) {
    UserEntity user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    return user;
  }

  private ProjectEntity getActiveProjectForUpdate(UUID projectId) {
    return projectRepository.findByIdAndDeletedAtIsNull(projectId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
  }

  private TaskEntity getActiveTask(UUID taskId) {
    return taskRepository.findByIdAndDeletedAtIsNull(taskId)
        .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
  }

  private void validateProjectNotArchived(ProjectEntity project) {
    if (project.getDeletedAt() != null) {
      throw new ConflictException("Project is archived");
    }
  }

  private void validateOwnerOrAdmin(UUID teamId, UUID userId) {
    TeamMemberEntity member = teamMemberRepository
        .findByTeamIdAndUserId(teamId, userId)
        .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

    if (member.getRole() != TeamRole.OWNER &&
        member.getRole() != TeamRole.ADMIN) {
      throw new ForbiddenException("Insufficient permissions");
    }
  }

  private void validateCanModifyTask(TaskEntity task, UUID userId) {

    UUID teamId = task.getProject().getTeam().getId();

    TeamMemberEntity member = teamMemberRepository
        .findByTeamIdAndUserId(teamId, userId)
        .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

    boolean isOwnerOrAdmin = member.getRole() == TeamRole.OWNER ||
        member.getRole() == TeamRole.ADMIN;

    boolean isAssignee = task.getAssignee().getId().equals(userId);

    boolean isSupport = task.getSupport() != null &&
        task.getSupport().getId().equals(userId);

    if (!(isOwnerOrAdmin || isAssignee || isSupport)) {
      throw new ForbiddenException("Insufficient permissions");
    }
  }

  /**
   * Ensures:
   * - User is Team member
   * - Role is Team OWNER or ADMIN
   */
  private TeamMemberEntity validateCanManageProjectTask(UUID teamId, UUID userId) {
    TeamMemberEntity member = getMembership(teamId, userId);

    if (member.getRole() != TeamRole.OWNER &&
        member.getRole() != TeamRole.ADMIN) {
      throw new ForbiddenException("Insufficient permissions");
    }

    return member;
  }

  private void validateDates(Instant start, Instant due) {
    if (due.isBefore(start)) {
      throw new ConflictException("Due date must be after start date");
    }
  }

  private void validateMembership(UUID teamId, UUID userId) {
    if (!teamMemberRepository.existsByTeamIdAndUserId(teamId, userId)) {
      throw new ConflictException("User must belong to the same team");
    }
  }

  private void validateAssignment(
      UUID teamId,
      UUID assigneeId,
      UUID supportId) {

    if (supportId != null && assigneeId.equals(supportId)) {
      throw new ConflictException("Assignee and support cannot be the same");
    }

    validateMembership(teamId, assigneeId);

    if (supportId != null) {
      validateMembership(teamId, supportId);
    }
  }

  /**
   * Resolves assignee by ID or returns null if ID is null.
   */
  private UserEntity resolveAssignee(UUID assigneeId) {

    if (assigneeId == null) {
      return null;
    }

    return userRepository.findById(assigneeId)
        .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
  }

  /**
   * Ensures task exists and belongs to project owned by user.
   */
  private TaskEntity getOwnedTask(
      UUID taskId,
      String userEmail) {

    TaskEntity task = taskRepository.findById(taskId)
        .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

    if (!task.getProject()
        .getCreatedBy()
        .getEmail()
        .equals(userEmail)) {

      throw new UnauthorizedException();
    }

    return task;
  }

  /**
   * Ensures project exists and belongs to user.
   */
  private ProjectEntity getOwnedProject(
      UUID projectId,
      String userEmail) {

    ProjectEntity project = projectRepository.findById(projectId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

    if (!project.getCreatedBy()
        .getEmail()
        .equals(userEmail)) {

      throw new UnauthorizedException();
    }

    return project;
  }

  /**
   * Maps TaskEntity to TaskResponse.
   */
  private TaskResponse mapToResponse(TaskEntity task) {
    TaskResponse.TaskUser assignedTo = null;

    if (task.getAssignee() != null) {
      assignedTo = new TaskResponse.TaskUser(task.getAssignee().getId(),
          task.getAssignee().getFirstName(),
          task.getAssignee().getLastName(),
          task.getAssignee().getEmail());
    }

    return new TaskResponse(
        task.getId(),
        task.getTitle(),
        task.getDescription(),
        task.getStatus(),
        assignedTo,
        task.getCreatedAt(),
        task.getUpdatedAt());
  }
}
