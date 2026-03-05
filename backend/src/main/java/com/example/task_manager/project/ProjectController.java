package com.example.task_manager.project;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.task_manager.common.PageResponse;
import com.example.task_manager.project.dto.ChangeProjectStatusRequest;
import com.example.task_manager.project.dto.CreateProjectRequest;
import com.example.task_manager.project.dto.ProjectResponse;
import com.example.task_manager.project.dto.UpdateProjectDetailsRequest;
import com.example.task_manager.project.entity.ProjectStatus;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller for managing projects.
 */
@RestController
@RequestMapping("/api/teams/{teamId}/projects")
@RequiredArgsConstructor
public class ProjectController {

  private final ProjectService projectService;

  /**
   * Create new project.
   */
  @PostMapping
  public ResponseEntity<ProjectResponse> createProject(
      @PathVariable UUID teamId,
      @Valid @RequestBody CreateProjectRequest request,
      Authentication authentication) {

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(projectService.createProject(teamId, request, authentication.getName()));

  }

  /**
   * Update project.
   */
  @PatchMapping("/{projectId}")
  public ResponseEntity<ProjectResponse> updateProject(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @Valid @RequestBody UpdateProjectDetailsRequest request,
      Authentication authentication) {

    return ResponseEntity.ok(projectService.updateProject(teamId, projectId, request, authentication.getName()));
  }

  /**
   * Delete project.
   */
  @DeleteMapping("/{projectId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public ResponseEntity<Void> deleteProject(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      Authentication authentication) {

    projectService.deleteProject(teamId, projectId, authentication.getName());

    return ResponseEntity.noContent().build();
  }

  /**
   * GET /api/teams/{teamId}/projects
   *
   * Retrieves projects for a team with support for:
   * - Search (name, description, owner)
   * - Filtering (status, ownerId, date range)
   * - Sorting
   * - Pagination
   * - Role-based soft-delete visibility
   *
   * Default behavior:
   * - Returns only active (non-deleted) projects.
   *
   * SUPER_ADMIN users may include deleted records using:
   * ?includeDeleted=true
   */
  @GetMapping
  public PageResponse<ProjectResponse> getProjects(
      @PathVariable UUID teamId,
      @RequestParam(required = false) String search,
      @RequestParam(required = false) ProjectStatus status,
      @RequestParam(required = false) UUID ownerId,
      @PageableDefault(size = 10) Pageable pageable,
      Authentication authentication) {

    return projectService.getProjects(
        teamId,
        search,
        status,
        ownerId,
        pageable,
        authentication);
  }

  /**
   * Get project by ID.
   */
  @GetMapping("/{projectId}")
  public ResponseEntity<ProjectResponse> getActiveProjectById(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      Authentication authentication) {
    return ResponseEntity.ok(projectService.getActiveProjectById(teamId, projectId, authentication.getName()));
  }

  /**
   * Get project by ID.
   */
  @GetMapping("/{projectId}/existing")
  public ResponseEntity<ProjectResponse> getExistingProjectById(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      Authentication authentication) {
    return ResponseEntity.ok(projectService.getExistingProjectById(teamId, projectId, authentication.getName()));
  }

  /**
   * Change project's status
   */
  @PatchMapping("/{projectId}/status")
  public ResponseEntity<ProjectResponse> changeStatus(
      @PathVariable UUID teamId,
      @PathVariable UUID projectId,
      @Valid @RequestBody ChangeProjectStatusRequest request,
      Authentication authentication) {
    return ResponseEntity.ok(projectService.changeProjectStatus(teamId, projectId, request, authentication.getName()));
  }
}
