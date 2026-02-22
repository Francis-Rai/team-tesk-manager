package com.example.task_manager.project.dto;

import com.example.task_manager.project.entity.ProjectStatus;

import jakarta.validation.constraints.Size;

/**
 * DTO for updating an existing project.
 */
public record UpdateProjectRequest(
    @Size(max = 100) String name,
    @Size(max = 500) String description,
    ProjectStatus status) {

}
