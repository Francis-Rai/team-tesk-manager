package com.example.task_manager.activity;

import org.springframework.stereotype.Component;

import com.example.task_manager.activity.dto.ActivityEventDetails;
import com.example.task_manager.activity.dto.ActivityEventType;

/**
 * Builds human-readable fallback messages from structured events.
 */
@Component
public class ActivityEventMessageBuilder {

  public String build(ActivityEventType eventType, ActivityEventDetails details) {
    return switch (eventType) {
      case TASK_CREATED -> "Task created";
      case TASK_UPDATED -> buildTaskUpdated(details);
      case TASK_DELETED -> "Task deleted";
      case TASK_STATUS_CHANGED -> "Status changed from " + details.from() + " to " + details.to();
      case TASK_ASSIGNEE_CHANGED -> "Assignee changed from " + details.from() + " to " + details.to();
      case TASK_SUPPORT_ASSIGNED -> "Support assigned to " + details.target();
      case TASK_SUPPORT_CHANGED -> "Support changed from " + details.from() + " to " + details.to();
      case TASK_SUPPORT_REMOVED -> "Support removed (" + details.target() + ")";
      case TASK_COMMENTED -> "";
      case PROJECT_UPDATED -> "Project updated";
      case TEAM_UPDATED -> "Team updated";
    };
  }

  private String buildTaskUpdated(ActivityEventDetails details) {
    if (details.fields() == null || details.fields().isEmpty()) {
      return "Task details updated";
    }

    return "Task details updated: " + String.join(", ", details.fields());
  }
}
