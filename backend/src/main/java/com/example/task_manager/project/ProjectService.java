package com.example.task_manager.project;

import java.time.Instant;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.task_manager.common.PageResponse;
import com.example.task_manager.exception.api.BadRequestInputException;
import com.example.task_manager.exception.api.ConflictException;
import com.example.task_manager.exception.api.ForbiddenException;
import com.example.task_manager.exception.api.ResourceNotFoundException;
import com.example.task_manager.project.dto.ChangeProjectStatusRequest;
import com.example.task_manager.project.dto.CreateProjectRequest;
import com.example.task_manager.project.dto.ProjectResponse;
import com.example.task_manager.project.dto.UpdateProjectDetailsRequest;
import com.example.task_manager.project.entity.ProjectEntity;
import com.example.task_manager.project.entity.ProjectStatus;
import com.example.task_manager.task.TaskRepository;
import com.example.task_manager.team.TeamMemberRepository;
import com.example.task_manager.team.entity.TeamMemberEntity;
import com.example.task_manager.team.entity.TeamRole;
import com.example.task_manager.user.UserRepository;
import com.example.task_manager.user.entity.UserEntity;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * Contains business logic for managing projects.
 */
@Service
@RequiredArgsConstructor
public class ProjectService {

  private final ProjectRepository projectRepository;
  private final TeamMemberRepository teamMemberRepository;
  private final TaskRepository taskRepository;
  private final UserRepository userRepository;

  /**
   * Creates a new project for the authenticated user.
   * User must be Team Owner or Admin
   * Project name must be unique for Team
   */
  @Transactional
  public ProjectResponse createProject(
      UUID teamId,
      CreateProjectRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamMemberEntity requesterMembership = canManageTeamProject(teamId, requester.getId());

    if (projectRepository.existsByTeamIdAndNameAndDeletedAtIsNull(
        teamId, request.name().trim())) {
      throw new ConflictException("Project name already exists in this team");
    }

    ProjectEntity project = new ProjectEntity();
    project.setName(request.name().trim());
    project.setDescription(request.description());
    project.setStatus(ProjectStatus.ACTIVE);
    project.setTeam(requesterMembership.getTeam());
    project.setCreatedBy(requester);

    // Flush immediately so unique-constraint violations are caught here
    // and mapped to a domain conflict.
    try {
      projectRepository.saveAndFlush(project);
    } catch (DataIntegrityViolationException ex) {
      throw new ConflictException("Project name already exists in this team");
    }

    return mapToResponse(project);
  }

  /**
   * Updates an existing project.
   * Only Owner and Admin can update the project
   */
  @Transactional
  public ProjectResponse updateProject(
      UUID teamId,
      UUID projectId,
      UpdateProjectDetailsRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getActiveProject(projectId, teamId);

    validateCanManageTeamProject(teamId, requester.getId());

    if (request.name() != null) {
      String trimmed = request.name().trim();

      if (trimmed.isEmpty()) {
        throw new BadRequestInputException("Project name cannot be blank");
      }

      if (!trimmed.equals(project.getName()) &&
          projectRepository.existsByTeamIdAndNameAndDeletedAtIsNull(teamId, trimmed)) {
        throw new ConflictException("Project name already exists in this team");
      }

      project.setName(trimmed);
    }

    if (request.description() != null) {
      project.setDescription(request.description().trim());
    }

    return mapToResponse(project);
  }

  /**
   * Soft-deletes a project and cascades soft-delete to all dependent data.
   * Only Owner and Admin can soft-delete project
   */
  @Transactional
  public void deleteProject(
      UUID teamId,
      UUID projectId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getActiveProject(projectId, teamId);

    validateCanManageTeamProject(teamId, requester.getId());

    Instant now = Instant.now();
    project.setDeletedAt(now);

    // cascade soft delete tasks
    taskRepository.softDeleteByProjectId(projectId, now);

  }

  /**
   * Change the status of a project
   * Only admin and owner can change status
   */
  @Transactional
  public ProjectResponse changeProjectStatus(
      UUID teamId,
      UUID projectId,
      ChangeProjectStatusRequest newStatus,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getExistingProject(projectId, teamId);

    validateCanManageTeamProject(teamId, requester.getId());

    validateStatusChange(project, newStatus.status());

    project.setStatus(newStatus.status());

    return mapToResponse(project);
  }

  /**
   * Returns all non-archived projects by authenticated user.
   */
  @Transactional(readOnly = true)
  public PageResponse<ProjectResponse> getAllActiveProjects(
      UUID teamId,
      Pageable pageable,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    validateMembership(teamId, requester.getId());

    Page<ProjectEntity> page = projectRepository.findByTeamIdAndDeletedAtIsNull(teamId, pageable);

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
   * Returns all existing projects by authenticated user.
   */
  @Transactional(readOnly = true)
  public PageResponse<ProjectResponse> getAllExistingProjects(
      UUID teamId,
      Pageable pageable,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    validateMembership(teamId, requester.getId());

    Page<ProjectEntity> page = projectRepository.findByTeamId(teamId, pageable);

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
   * Returns an active projects by id.
   */
  @Transactional(readOnly = true)
  public ProjectResponse getActiveProjectById(
      UUID teamId,
      UUID projectId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getActiveProject(projectId, teamId);

    validateMembership(teamId, requester.getId());

    return mapToResponse(project);
  }

  /**
   * Returns an existing projects by id.
   */
  @Transactional(readOnly = true)
  public ProjectResponse getExistingProjectById(
      UUID teamId,
      UUID projectId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getExistingProject(projectId, teamId);

    validateMembership(teamId, requester.getId());

    return mapToResponse(project);
  }

  // HELPERS

  /**
   * Maps a ProjectEntity to a Project Response.
   */
  private ProjectResponse mapToResponse(ProjectEntity project) {
    ProjectResponse.ProjectUserSummary createdBy = new ProjectResponse.ProjectUserSummary(
        project.getCreatedBy().getId(),
        project.getCreatedBy().getFirstName(),
        project.getCreatedBy().getLastName(),
        project.getCreatedBy().getEmail());

    return new ProjectResponse(
        project.getId(),
        project.getName(),
        project.getDescription(),
        project.getStatus(),
        project.getTeam().getId(),
        createdBy,
        project.getCreatedAt(),
        project.getUpdatedAt());
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
    boolean isMember = teamMemberRepository
        .existsByTeamIdAndUserId(
            teamId, userId);

    if (!isMember) {
      throw new ResourceNotFoundException("Team not found");
    }
  }

  /**
   * Get an active project
   */
  private ProjectEntity getActiveProject(UUID projectId, UUID teamId) {
    return projectRepository
        .findByIdAndTeamIdAndDeletedAtIsNull(projectId, teamId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
  }

  /**
   * Get an existing project
   */
  private ProjectEntity getExistingProject(UUID projectId, UUID teamId) {
    return projectRepository.findByIdAndTeamId(projectId, teamId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
  }

  /**
   * Ensures:
   * - User is Team member
   * - Role is Team OWNER or ADMIN
   */
  private TeamMemberEntity canManageTeamProject(UUID teamId, UUID userId) {
    TeamMemberEntity member = getMembership(teamId, userId);

    if (member.getRole() != TeamRole.OWNER &&
        member.getRole() != TeamRole.ADMIN) {
      throw new ForbiddenException("Insufficient permissions");
    }

    return member;
  }

  /**
   * Checks :
   * - User is Team member
   * - Role is Team OWNER or ADMIN
   */
  private void validateCanManageTeamProject(UUID teamId, UUID userId) {
    TeamMemberEntity member = getMembership(teamId, userId);

    if (member.getRole() != TeamRole.OWNER &&
        member.getRole() != TeamRole.ADMIN) {
      throw new ForbiddenException("Insufficient permissions");
    }
  }

  /**
   * Ensures:
   * - Project status cannot be changed to its current value
   * All transitions between ACTIVE, ON_HOLD, COMPLETED are allowed
   */
  private void validateStatusChange(
      ProjectEntity project,
      ProjectStatus newStatus) {

    if (project.getStatus() == newStatus) {
      throw new ConflictException(
          "Project is already in this status");
    }
  }

}