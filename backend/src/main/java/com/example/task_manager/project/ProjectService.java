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
import com.example.task_manager.team.entity.TeamEntity;
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
   */
  @Transactional
  public ProjectResponse create(
      UUID teamId,
      CreateProjectRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamMemberEntity requesterMembership = validateCanManageTeamProject(teamId, requester.getId());

    TeamEntity team = requesterMembership.getTeam();

    if (projectRepository.existsByTeamIdAndNameAndDeletedAtIsNull(
        teamId, request.name().trim())) {
      throw new ConflictException("Project name already exists in this team");
    }

    ProjectEntity project = new ProjectEntity();
    project.setName(request.name().trim());
    project.setDescription(request.description());
    project.setStatus(ProjectStatus.ACTIVE);
    project.setTeam(team);
    project.setCreatedBy(requester);

    try {
      projectRepository.save(project);
    } catch (DataIntegrityViolationException ex) {
      throw new ConflictException("Project name already exists in this team");
    }

    return mapToResponse(project);
  }

  /**
   * Returns all projects by authenticated user.
   */
  @Transactional(readOnly = true)
  public PageResponse<ProjectResponse> getAllProjects(
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
   * Returns all active projects by authenticated user.
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
   * Returns a projects by id.
   * TODO MODIFY
   */
  @Transactional(readOnly = true)
  public ProjectResponse getProjectById(
      UUID projectId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getActiveProject(projectId);

    validateMembership(project.getTeam().getId(), requester.getId());

    return mapToResponse(project);
  }

  /**
   * Updates an existing project.
   */
  @Transactional
  public ProjectResponse update(
      UUID projectId,
      UpdateProjectRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    ProjectEntity project = getActiveProject(projectId);

    validateCanManageTeamProject(project.getTeam().getId(), requester.getId());

    if (request.name() != null) {
      String trimmed = request.name().trim();

      if (trimmed.isEmpty()) {
        throw new BadRequestInputException("Project name cannot be blank");
      }

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
   * Soft Deletes a project.
   */
  @Transactional
  public void delete(
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

  // HELPERS
  /**
   * Returns the user by email
   */
  private UserEntity getUserByEmail(String email) {
    UserEntity user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    return user;
  }

  private void validateMembership(UUID teamId, UUID userId) {

    boolean isMember = teamMemberRepository
        .existsByTeamIdAndUserId(
            teamId, userId);

    if (!isMember) {
      throw new ResourceNotFoundException("Team not found");
    }
  }

  private ProjectEntity getActiveProject(UUID projectId) {
    return projectRepository
        .findByIdAndDeletedAtIsNull(projectId)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
  }

  private TeamMemberEntity validateCanManageTeamProject(UUID teamId, UUID userId) {
    TeamMemberEntity member = getMembership(teamId, userId);

    if (member.getRole() != TeamRole.OWNER &&
        member.getRole() != TeamRole.ADMIN) {
      throw new ForbiddenException("Insufficient permissions");
    }

    return member;
  }

  private TeamMemberEntity getMembership(UUID teamId, UUID userId) {
    TeamMemberEntity member = teamMemberRepository
        .findByTeamIdAndUserIdAndTeamDeletedAtIsNull(teamId, userId)
        .orElseThrow(() -> new ForbiddenException("User is not a team member"));
    return member;
  }

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
}