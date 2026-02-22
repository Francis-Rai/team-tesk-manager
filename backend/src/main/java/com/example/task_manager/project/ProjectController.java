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
import com.example.task_manager.project.dto.CreateProjectRequest;
import com.example.task_manager.project.dto.ProjectResponse;
import com.example.task_manager.project.dto.UpdateProjectRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller for managing projects.
 */
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

  private final ProjectService projectService;

  /**
   * Create new project.
   */
  @PostMapping("/teams/{teamId}/projects")
  public ResponseEntity<ProjectResponse> create(
      @PathVariable UUID teamId,
      @Valid @RequestBody CreateProjectRequest request,
      Authentication authentication) {

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(projectService.create(teamId, request, authentication.getName()));

  }

  /**
   * Get all existing projects for authenticated user.
   */
  @GetMapping("/teams/{teamId}/projects-all")
  public PageResponse<ProjectResponse> getAllProjects(
      @PathVariable UUID teamId,
      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {

    return projectService.getAllProjects(teamId, pageable, authentication.getName());
  }

  /**
   * Get all active projects for authenticated user.
   */
  @GetMapping("/teams/{teamId}/projects")
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
  public ProjectResponse getProject(
      @PathVariable UUID projectId,
      Authentication authentication) {
    return projectService.getProjectById(projectId, authentication.getName());
  }

  /**
   * Update project.
   */
  @PatchMapping("/{projectId}")
  public ProjectResponse updateProject(
      @PathVariable UUID projectId,
      @Valid @RequestBody UpdateProjectRequest request,
      Authentication authentication) {

    return projectService.update(projectId, request, authentication.getName());
  }

  /**
   * Delete project.
   */
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteProject(
      @PathVariable UUID projectId,
      Authentication authentication) {

    projectService.delete(projectId, authentication.getName());
  }
}
