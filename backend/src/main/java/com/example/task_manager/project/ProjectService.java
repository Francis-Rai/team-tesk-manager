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
import com.example.task_manager.project.dto.CreateProjectRequest;
import com.example.task_manager.project.dto.ProjectResponse;
import com.example.task_manager.project.dto.UpdateProjectRequest;
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
   */
  @Transactional
  public ProjectResponse createProject(
      UUID teamId,
      CreateProjectRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamMemberEntity requesterMembership = validateCanManageTeamProject(teamId, requester.getId());

    // Checks uniqueness of Project Name in Team
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
      UUID projectId,
      UpdateProjectRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getActiveProject(projectId);

    validateCanManageTeamProject(project.getTeam().getId(), requester.getId());

    // Checks if name is blank
    if (request.name() != null) {
      String trimmed = request.name().trim();

      if (trimmed.isEmpty()) {
        throw new BadRequestInputException("Project name cannot be blank");
      }

      // Checks if name is unique for the team
      if (!trimmed.equals(project.getName()) &&
          projectRepository.existsByTeamIdAndNameAndDeletedAtIsNull(
              project.getTeam().getId(), trimmed)) {
        throw new ConflictException("Project name already exists in this team");
      }

      project.setName(trimmed);
    }

    if (request.description() != null) {
      project.setDescription(request.description().trim());
    }

    if (request.status() != null) {
      project.setStatus(request.status());
    }

    return mapToResponse(project);
  }

  /**
   * Soft-deletes a project and cascades soft-delete to all dependent data.
   * Only Owner and Admin can soft-delete project
   */
  @Transactional
  public void deleteProject(
      UUID projectId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getActiveProject(projectId);

    validateCanManageTeamProject(project.getTeam().getId(), requester.getId());

    Instant now = Instant.now();
    project.setDeletedAt(now);

    // cascade soft delete tasks
    taskRepository.softDeleteByProjectId(projectId, now);

  }

  // TODO - Change Project Status

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

    Page<ProjectEntity> page = projectRepository.findByTeamIdAndDeletedAtIsNull(
        teamId,
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
   * Returns all existing projects by authenticated user.
   */
  @Transactional(readOnly = true)
  public PageResponse<ProjectResponse> getAllExistingProjects(
      UUID teamId,
      Pageable pageable,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    validateMembership(teamId, requester.getId());

    Page<ProjectEntity> page = projectRepository.findByTeamId(
        teamId,
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
   * Returns an active projects by id.
   */
  @Transactional(readOnly = true)
  public ProjectResponse getActiveProjectById(
      UUID projectId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getActiveProject(projectId);

    validateMembership(project.getTeam().getId(), requester.getId());

    return mapToResponse(project);
  }

  /**
   * Returns an existing projects by id.
   */
  @Transactional(readOnly = true)
  public ProjectResponse getExistingProjectById(
      UUID projectId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getExistingProject(projectId);

    validateMembership(project.getTeam().getId(), requester.getId());

    return mapToResponse(project);
  }

  @Transactional
  public ProjectResponse changeProjectStatus(
      UUID projectId,
      ProjectStatus newStatus,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getExistingProject(projectId);

    validateCanManageTeamProject(project.getTeam().getId(), requester.getId());

    validateStatusChange(project, newStatus);

    project.setStatus(newStatus);

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
   * Ensures:
   * - Project is active
   */
  private ProjectEntity getActiveProject(UUID projectId) {
    return projectRepository
        .findByIdAndDeletedAtIsNull(projectId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
  }

  /**
   * Ensures:
   * - Project is existing
   */
  private ProjectEntity getExistingProject(UUID projectId) {
    return projectRepository
        .findById(projectId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
  }

  /**
   * Ensures:
   * - User is Team member
   * - Role is Team OWNER or ADMIN
   */
  private TeamMemberEntity validateCanManageTeamProject(UUID teamId, UUID userId) {
    TeamMemberEntity member = getMembership(teamId, userId);

    if (member.getRole() != TeamRole.OWNER &&
        member.getRole() != TeamRole.ADMIN) {
      throw new ForbiddenException("Insufficient permissions");
    }

    return member;
  }

  private void validateStatusChange(
      ProjectEntity project,
      ProjectStatus newStatus) {

    if (project.getDeletedAt() != null) {
      throw new ConflictException(
          "Archived projects cannot change status");
    }

    if (project.getStatus() == newStatus) {
      throw new ConflictException(
          "Project is already in this status");
    }

    // All transitions between ACTIVE, ON_HOLD, COMPLETED are allowed
  }

}