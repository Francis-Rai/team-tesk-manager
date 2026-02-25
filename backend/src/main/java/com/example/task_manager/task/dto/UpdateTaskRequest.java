package com.example.task_manager.task.dto;

import java.time.Instant;
import java.util.UUID;

import com.example.task_manager.task.entity.TaskPriority;

import jakarta.validation.constraints.Size;

/**
 * DTO for updating an existing task.
 */
public record UpdateTaskRequest(
    @Size(max = 100) String title,

    @Size(max = 500) String description,

    TaskPriority priority,

    Instant startDate,

    Instant dueDate,

    UUID assigneeId,

    UUID supportId) {

}
