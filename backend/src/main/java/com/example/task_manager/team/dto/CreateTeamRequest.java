package com.example.task_manager.team.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for creating a new team.
 */
public record CreateTeamRequest(
    @NotBlank String name,
    String description) {
}
