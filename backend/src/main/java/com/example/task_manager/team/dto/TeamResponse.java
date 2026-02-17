package com.example.task_manager.team.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * DTO for returning team information.
 */
public record TeamResponse(
    UUID id,
    String name,
    String description,
    UUID ownerId,
    boolean deleted,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<TeamMemberResponse> members) {
}
