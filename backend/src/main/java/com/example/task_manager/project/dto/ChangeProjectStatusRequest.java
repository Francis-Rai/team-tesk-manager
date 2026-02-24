package com.example.task_manager.project.dto;

import com.example.task_manager.project.entity.ProjectStatus;

public record ChangeProjectStatusRequest(
    ProjectStatus status) {
}
