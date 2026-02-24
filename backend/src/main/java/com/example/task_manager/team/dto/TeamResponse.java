package com.example.task_manager.team.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * DTO for returning team information.
 */
public record TeamResponse(
    UUID id,
    String name,
    String description,
    UUID ownerId,
    Instant createdAt,
    Instant updatedAt) {
}
