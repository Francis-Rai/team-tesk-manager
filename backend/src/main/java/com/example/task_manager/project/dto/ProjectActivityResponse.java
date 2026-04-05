package com.example.task_manager.project.dto;

import java.time.Instant;
import java.util.UUID;

public record ProjectActivityResponse(
    UUID id,
    String message,
    User user,
    Task task,
    Instant createdAt) {

  public record User(
      UUID id,
      String firstName,
      String lastName,
      String email) {
  }

  public record Task(
      UUID id,
      String title) {
  }

}
