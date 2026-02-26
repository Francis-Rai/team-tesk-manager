package com.example.task_manager.project;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.task_manager.common.PageResponse;
import com.example.task_manager.project.dto.ChangeProjectStatusRequest;
import com.example.task_manager.project.dto.CreateProjectRequest;
import com.example.task_manager.project.dto.ProjectResponse;
import com.example.task_manager.project.dto.UpdateProjectDetailsRequest;

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
  public ProjectResponse updateProject(
      @PathVariable UUID projectId,
      @Valid @RequestBody UpdateProjectDetailsRequest request,
      Authentication authentication) {

    return projectService.updateProject(projectId, request, authentication.getName());
  }

  /**
   * Delete project.
   */
  @DeleteMapping("/{projectId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteProject(
      @PathVariable UUID projectId,
      Authentication authentication) {

    projectService.deleteProject(projectId, authentication.getName());
  }

  /**
   * Get all existing projects for authenticated user.
   */
  @GetMapping("/projects-all")
  public PageResponse<ProjectResponse> getAllExistingProjects(
      @PathVariable UUID teamId,
      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return projectService.getAllExistingProjects(teamId, pageable, authentication.getName());
  }

  /**
   * Get all active projects for authenticated user.
   */
  @GetMapping
  public PageResponse<ProjectResponse> getAllActiveProjects(
      @PathVariable UUID teamId,
      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return projectService.getAllActiveProjects(teamId, pageable, authentication.getName());
  }

  /**
   * Get project by ID.
   */
  @GetMapping("/{projectId}")
  public ProjectResponse getActiveProjectById(
      @PathVariable UUID projectId,
      Authentication authentication) {
    return projectService.getActiveProjectById(projectId, authentication.getName());
  }

  /**
   * Get project by ID.
   */
  @GetMapping("/{projectId}/existing")
  public ProjectResponse getExistingProjectById(
      @PathVariable UUID projectId,
      Authentication authentication) {
    return projectService.getExistingProjectById(projectId, authentication.getName());
  }

  /**
   * Change project's status
   */
  @PatchMapping("/{projectId}/status")
  public ProjectResponse changeStatus(
      @PathVariable UUID projectId,
      @Valid @RequestBody ChangeProjectStatusRequest request,
      Authentication authentication) {
    return projectService.changeProjectStatus(projectId, request, authentication.getName());
  }
}
