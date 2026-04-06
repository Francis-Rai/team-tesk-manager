package com.example.task_manager.team.dto;

import java.time.Instant;
import java.util.UUID;

public record TeamActivityResponse(
    UUID id,
    String message,
    User user,
    Project project,
    Task task,
    Instant createdAt) {

  public record User(
      UUID id,
      String firstName,
      String lastName,
      String email) {
  }

  public record Project(
      UUID id,
      String title) {
  }

  public record Task(
      UUID id,
      String title) {
  }

}
