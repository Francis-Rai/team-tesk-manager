package com.example.task_manager.task;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.example.task_manager.activity.ActivityEventRepository;
import com.example.task_manager.activity.ActivityEventService;
import com.example.task_manager.activity.dto.ActivityEventDetails;
import com.example.task_manager.activity.dto.ActivityEventType;
import com.example.task_manager.activity.entity.ActivityEventEntity;
import com.example.task_manager.common.DeletedFilter;
import com.example.task_manager.common.PageResponse;
import com.example.task_manager.exception.api.BadRequestInputException;
import com.example.task_manager.exception.api.ConflictException;
import com.example.task_manager.exception.api.ForbiddenException;
import com.example.task_manager.exception.api.ResourceNotFoundException;
import com.example.task_manager.project.ProjectRepository;
import com.example.task_manager.project.entity.ProjectEntity;
import com.example.task_manager.task.dto.ChangeStatusRequest;
import com.example.task_manager.task.dto.CreateTaskRequest;
import com.example.task_manager.task.dto.CreateTaskUpdateRequest;
import com.example.task_manager.task.dto.TaskResponse;
import com.example.task_manager.task.dto.TaskSearchRequest;
import com.example.task_manager.task.dto.TaskUpdateResponse;
import com.example.task_manager.task.dto.UpdateTaskDetailsRequest;
import com.example.task_manager.task.entity.TaskEntity;
import com.example.task_manager.task.entity.TaskPriority;
import com.example.task_manager.task.entity.TaskStatus;
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
  private final ActivityEventRepository activityEventRepository;
  private final ActivityEventService activityEventService;

  /**
   * Creates task under a project and optionally add a support user.
   */
  @Transactional
  public TaskResponse createTask(
      UUID teamId,
      UUID projectId,
      CreateTaskRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getActiveProject(projectId, teamId);

    validateCanManageProjectTask(teamId, requester.getId());
    validateDates(request.plannedStartDate(), request.plannedDueDate());

    TeamMemberEntity assigneeMember = getMembership(teamId, request.assigneeId());

    TeamMemberEntity supportMember = new TeamMemberEntity();

    if (request.supportId() != null) {
      supportMember = getMembership(teamId, request.supportId());
      validateAssignment(teamId, request.assigneeId(), request.supportId());
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
    activityEventService.recordTaskEvent(
        task,
        requester,
        ActivityEventType.TASK_CREATED,
        emptyActivityDetails(),
        "Task created");
    project.setNextTaskNumber(taskNumber + 1);

    return mapToResponse(task);
  }

  /**
   * Updates task.
   */
  @Transactional
  public TaskResponse updateTask(
      UUID teamId,
      UUID projectId,
      UUID taskId,
      UpdateTaskDetailsRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TaskEntity task = getActiveTask(taskId, projectId, teamId);

    validateCanManageProjectTask(teamId, requester.getId());

    String currentTitle = task.getTitle();
    String currentDescription = task.getDescription();
    TaskPriority currentPriority = task.getPriority();
    Instant currentPlannedStart = task.getPlannedStartDate();
    Instant currentPlannedDue = task.getPlannedDueDate();

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

    TaskDetailsUpdateMessage updateMessage = buildTaskDetailsUpdateMessage(
        currentTitle,
        currentDescription,
        currentPriority == null ? null : currentPriority.name(),
        currentPlannedStart,
        currentPlannedDue,
        task.getTitle(),
        task.getDescription(),
        task.getPriority() == null ? null : task.getPriority().name(),
        task.getPlannedStartDate(),
        task.getPlannedDueDate());

    activityEventService.recordTaskEvent(
        task,
        requester,
        ActivityEventType.TASK_UPDATED,
        new ActivityEventDetails(updateMessage.fields(), null, null, null),
        updateMessage.message());

    return mapToResponse(task);
  }

  /**
   * Deletes task.
   */
  @Transactional
  public void deleteTask(
      UUID teamId,
      UUID projectId,
      UUID taskId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TaskEntity task = getActiveTask(taskId, projectId, teamId);

    validateCanManageProjectTask(teamId, requester.getId());

    task.setDeletedAt(Instant.now());
    activityEventService.recordTaskEvent(
        task,
        requester,
        ActivityEventType.TASK_DELETED,
        emptyActivityDetails(),
        "Task deleted");
  }

  /**
   * Change the status of a task
   */
  @Transactional
  public TaskResponse changeStatus(
      UUID teamId,
      UUID projectId,
      UUID taskId,
      ChangeStatusRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);
    TaskEntity task = getActiveTask(taskId, projectId, teamId);

    validateCanChangeStatusAndUpdate(teamId, task, requester.getId());
    validateStatusTransition(task.getStatus(), request.status());

    TaskStatus current = task.getStatus();
    TaskStatus newStatus = request.status();

    if (newStatus == TaskStatus.IN_PROGRESS && task.getActualStartDate() == null) {
      task.setActualStartDate(Instant.now());
    }

    if (newStatus == TaskStatus.DONE) {
      task.setActualCompletionDate(Instant.now());
    }

    if (current == TaskStatus.DONE && newStatus != null) {
      task.setActualCompletionDate(null);
    }

    String message = "Status changed from " + current + " to " + newStatus;

    task.setStatus(newStatus);
    activityEventService.recordTaskEvent(
        task,
        requester,
        ActivityEventType.TASK_STATUS_CHANGED,
        new ActivityEventDetails(List.of(), current.name(), newStatus.name(), null),
        message);

    return mapToResponse(task);
  }

  /**
   * Change or Assign a Task's Assignee
   */
  @Transactional
  public TaskResponse changeAssignee(
      UUID teamId,
      UUID projectId,
      UUID taskId,
      UUID newAssigneeId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);
    TaskEntity task = getActiveTask(taskId, projectId, teamId);

    validateCanManageProjectTask(teamId, requester.getId());

    UserEntity currentAssignee = task.getAssignee();
    UserEntity currentSupport = task.getSupport();

    if (newAssigneeId.equals(currentAssignee.getId())) {
      return mapToResponse(task);
    }

    UserEntity newAssignee = getMembership(teamId, newAssigneeId).getUser();

    if (currentSupport != null && newAssignee.getId().equals(currentSupport.getId())) {

      task.setAssignee(newAssignee);
      task.setSupport(null);

      activityEventService.recordTaskEvent(
          task,
          requester,
          ActivityEventType.TASK_ASSIGNEE_CHANGED,
          new ActivityEventDetails(List.of(), currentAssignee.getFullName(), newAssignee.getFullName(), null),
          "Assignee changed from " + currentAssignee.getFullName() + " to " + newAssignee.getFullName());

      return mapToResponse(task);
    }

    task.setAssignee(newAssignee);

    activityEventService.recordTaskEvent(
        task,
        requester,
        ActivityEventType.TASK_ASSIGNEE_CHANGED,
        new ActivityEventDetails(List.of(), currentAssignee.getFullName(), newAssignee.getFullName(), null),
        "Assignee changed from " + currentAssignee.getFullName() + " to " + newAssignee.getFullName());

    return mapToResponse(task);
  }

  /**
   * Change or Assign a Task's Support
   */
  @Transactional
  public TaskResponse changeSupport(
      UUID teamId,
      UUID projectId,
      UUID taskId,
      UUID newSupportId,
      String requesterEmail) {

    UserEntity currentUser = getUserByEmail(requesterEmail);
    TaskEntity task = getActiveTask(taskId, projectId, teamId);

    validateCanManageProjectTask(teamId, currentUser.getId());

    UserEntity currentAssignee = task.getAssignee();
    UserEntity currentSupport = task.getSupport();

    if (newSupportId == null) {

      if (currentSupport == null) {
        return mapToResponse(task);
      }

      task.setSupport(null);

      activityEventService.recordTaskEvent(
          task,
          currentUser,
          ActivityEventType.TASK_SUPPORT_REMOVED,
          new ActivityEventDetails(List.of(), currentSupport.getFullName(), null, currentSupport.getFullName()),
          "Support removed (" + currentSupport.getFullName() + ")");

      return mapToResponse(task);
    }

    // New Support is Assignee
    if (newSupportId.equals(currentAssignee.getId())) {
      throw new ConflictException("Support cannot be the same as assignee");
    }

    // New support is Current Support
    if (currentSupport != null &&
        newSupportId.equals(currentSupport.getId())) {
      return mapToResponse(task);
    }

    UserEntity newSupport = getMembership(teamId, newSupportId).getUser();

    task.setSupport(newSupport);

    // Assign new Support
    if (currentSupport == null) {
      activityEventService.recordTaskEvent(
          task,
          currentUser,
          ActivityEventType.TASK_SUPPORT_ASSIGNED,
          new ActivityEventDetails(List.of(), null, null, newSupport.getFullName()),
          "Support assigned to " + newSupport.getFullName());
    } else {
      activityEventService.recordTaskEvent(
          task,
          currentUser,
          ActivityEventType.TASK_SUPPORT_CHANGED,
          new ActivityEventDetails(List.of(), currentSupport.getFullName(), newSupport.getFullName(), null),
          "Support changed from " + currentSupport.getFullName() + " to " + newSupport.getFullName());
    }

    return mapToResponse(task);
  }

  /**
   * Add a progress update to a Task
   */
  @Transactional
  public TaskUpdateResponse addTaskUpdate(
      UUID teamId,
      UUID projectId,
      UUID taskId,
      CreateTaskUpdateRequest request,
      String requesterEmail) {

    UserEntity currentUser = getUserByEmail(requesterEmail);
    TaskEntity task = getActiveTask(taskId, projectId, teamId);

    validateCanChangeStatusAndUpdate(teamId, task, currentUser.getId());

    ActivityEventEntity update = activityEventService.recordTaskComment(
        task,
        currentUser,
        request.message());

    return mapToUpdateResponse(update);
  }

  /**
   * Returns an existing task by id.
   */
  @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
  @Transactional(readOnly = true)
  public TaskResponse getExistingTaskById(
      UUID teamId,
      UUID projectId,
      UUID taskId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TaskEntity team = getExistingTask(taskId, projectId, teamId);

    validateMembership(teamId, requester.getId());

    return mapToResponse(team);
  }

  /**
   * Returns an non-archived task by id.
   */
  @Transactional(readOnly = true)
  public TaskResponse getActiveTaskById(
      UUID teamId,
      UUID projectId,
      UUID taskId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TaskEntity team = getActiveTask(taskId, projectId, teamId);

    validateMembership(teamId, requester.getId());

    return mapToResponse(team);
  }

  /**
   * Retrieves tasks for a projects and team with support for:
   * - Search
   * - Filtering
   * - Sorting
   * - Pagination
   * - Role-based soft-delete visibility
   */
  @Transactional(readOnly = true)
  public PageResponse<TaskResponse> getTasks(
      UUID teamId,
      UUID projectId,
      TaskSearchRequest request,
      Pageable pageable,
      Authentication authentication) {

    UserEntity requester = getUserByEmail(authentication.getName());

    validateProject(projectId, teamId);

    boolean isGlobalAdmin = authentication.getAuthorities()
        .stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));

    if (!isGlobalAdmin) {
      validateMembership(teamId, requester.getId());
    }

    DeletedFilter filter = request.deletedFilter();

    if (!isGlobalAdmin && filter != DeletedFilter.ACTIVE) {
      throw new ForbiddenException("Not allowed to view deleted tasks");
    }

    pageable = validateSorting(pageable);

    Specification<TaskEntity> spec = TaskSpecification.build(
        projectId,
        request.search(),
        request.status(),
        request.priority(),
        request.assigneeId(),
        request.supportId(),
        request.overdue(),
        request.deletedFilter(),
        isGlobalAdmin);

    Page<TaskEntity> page = taskRepository.findAll(spec, pageable);

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
   * Returns all user's task.
   * Assignee and Support
   */
  @Transactional(readOnly = true)
  public PageResponse<TaskResponse> getMyTasks(
      String requesterEmail,
      Pageable pageable) {

    UserEntity requester = getUserByEmail(requesterEmail);

    Page<TaskEntity> page = taskRepository.findMyTasks(requester.getId(),
        pageable);

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
   * Returns all user's task by project.
   * Assignee and Support
   */
  @Transactional(readOnly = true)
  public PageResponse<TaskResponse> getMyTasksByProject(
      UUID projectId,
      String requesterEmail,
      Pageable pageable) {

    UserEntity requester = getUserByEmail(requesterEmail);

    Page<TaskEntity> page = taskRepository.findMyTasksByProject(projectId, requester.getId(), pageable);

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
   * Get all task update for an Active Task
   */
  @Transactional(readOnly = true)
  public PageResponse<TaskUpdateResponse> getAllActiveTaskUpdates(
      UUID teamId,
      UUID taskId,
      Pageable pageable,
      String requesterEmail) {

    UserEntity currentUser = getUserByEmail(requesterEmail);
    validateActiveTask(taskId);

    validateMembership(teamId, currentUser.getId());

    Page<ActivityEventEntity> page = activityEventRepository.findActiveTaskActivity(
        taskId,
        pageable);

    return new PageResponse<>(
        page.map(this::mapToUpdateResponse).getContent(),
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast());
  }

  /**
   * Get all task update for an Existing Task
   */
  @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
  @Transactional(readOnly = true)
  public PageResponse<TaskUpdateResponse> getAllExistingTaskUpdates(
      UUID teamId,
      UUID taskId,
      Pageable pageable,
      String requesterEmail) {

    UserEntity currentUser = getUserByEmail(requesterEmail);
    validateExistingTask(taskId);

    validateMembership(teamId, currentUser.getId());

    Page<ActivityEventEntity> page = activityEventRepository.findByTaskId(
        taskId,
        pageable);

    return new PageResponse<>(
        page.map(this::mapToUpdateResponse).getContent(),
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
   * Maps ActivityEventEntity to TaskUpdateResponse.
   */
  public TaskUpdateResponse mapToUpdateResponse(ActivityEventEntity entity) {
    return activityEventService.toTaskUpdateResponse(entity);
  }

  private TaskDetailsUpdateMessage buildTaskDetailsUpdateMessage(
      String previousTitle,
      String previousDescription,
      String previousPriority,
      Instant previousPlannedStart,
      Instant previousPlannedDue,
      String newTitle,
      String newDescription,
      String newPriority,
      Instant newPlannedStart,
      Instant newPlannedDue) {

    List<String> changes = new ArrayList<>();

    if (!java.util.Objects.equals(previousTitle, newTitle)) {
      changes.add("title");
    }

    if (!java.util.Objects.equals(previousDescription, newDescription)) {
      changes.add("description");
    }

    if (!java.util.Objects.equals(previousPriority, newPriority)) {
      changes.add("priority");
    }

    boolean scheduleChanged = !java.util.Objects.equals(previousPlannedStart, newPlannedStart) ||
        !java.util.Objects.equals(previousPlannedDue, newPlannedDue);

    if (scheduleChanged) {
      changes.add("schedule");
    }

    if (changes.isEmpty()) {
      return new TaskDetailsUpdateMessage("Task details updated", List.of());
    }

    return new TaskDetailsUpdateMessage(
        "Task details updated: " + String.join(", ", changes),
        changes);
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
  private ProjectEntity getActiveProject(UUID projectId, UUID teamId) {
    return projectRepository.findByIdAndTeamIdAndDeletedAtIsNull(projectId, teamId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
  }

  /**
   * Ensures:
   * - Task exists
   * - Task not deleted *
   * Returns task entity.
   * Uses ResourceNotFound to prevent ID probing.
   */
  private TaskEntity getActiveTask(UUID taskId, UUID projectId, UUID teamId) {
    return taskRepository.findByIdAndProjectIdAndProjectTeamIdAndDeletedAtIsNull(taskId, projectId, teamId)
        .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
  }

  /**
   * Ensures:
   * - Task exists
   * - Task not deleted
   */
  private void validateActiveTask(UUID taskId) {
    boolean task = taskRepository.existsByIdAndDeletedAtIsNull(taskId);
    if (!task) {
      new ResourceNotFoundException("Task not found");
    }
  }

  /**
   * Ensures:
   * - Task exists
   * Returns task entity.
   * Uses ResourceNotFound to prevent ID probing.
   */
  private TaskEntity getExistingTask(UUID taskId, UUID projectId, UUID teamId) {
    return taskRepository.findByIdAndProjectIdAndProjectTeamId(taskId, projectId, teamId)
        .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
  }

  /**
   * Ensures:
   * - Task exists
   */
  private void validateExistingTask(UUID taskId) {
    boolean task = taskRepository.existsById(taskId);
    if (!task) {
      new ResourceNotFoundException("Task not found");
    }
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
  private void validateCanChangeStatusAndUpdate(UUID teamId, TaskEntity task, UUID userId) {
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

  /**
   * Creates a log for a task
   * Logs changes for a task
   */
  private ActivityEventDetails emptyActivityDetails() {
    return new ActivityEventDetails(List.of(), null, null, null);
  }

  private record TaskDetailsUpdateMessage(
      String message,
      List<String> fields) {
  }

  /**
   * Get an active project
   */
  private void validateProject(UUID projectId, UUID teamId) {
    boolean project = projectRepository.existsByIdAndTeamId(projectId, teamId);

    if (!project) {
      throw new ResourceNotFoundException("Project not found");
    }
  }

  /*
   * Allowed Sorting Fields
   */
  private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
      "title",
      "priority",
      "status",
      "assignee",
      "support",
      "plannedStartDate",
      "plannedDueDate",
      "createdAt",
      "updatedAt");

  /*
   * Check sort request
   */
  private Pageable validateSorting(Pageable pageable) {

    for (Sort.Order order : pageable.getSort()) {
      if (!ALLOWED_SORT_FIELDS.contains(order.getProperty())) {
        throw new BadRequestInputException(
            "Invalid sort field: " + order.getProperty());
      }
    }

    return pageable;
  }

}
