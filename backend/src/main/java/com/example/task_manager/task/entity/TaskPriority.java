package com.example.task_manager.task.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum TaskPriority {
  LOW,
  MEDIUM,
  HIGH,
  CRITICAL;

  // Converts a string to a TaskPriority enum, ignoring case
  @JsonCreator
  public static TaskPriority from(String value) {
    return TaskPriority.valueOf(value.toUpperCase());
  }
}
