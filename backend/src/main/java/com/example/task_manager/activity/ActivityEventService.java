package com.example.task_manager.activity;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.task_manager.activity.dto.ActivityEntityType;
import com.example.task_manager.activity.dto.ActivityEventDetails;
import com.example.task_manager.activity.dto.ActivityEventType;
import com.example.task_manager.activity.entity.ActivityEventEntity;
import com.example.task_manager.project.dto.ProjectActivityResponse;
import com.example.task_manager.task.dto.TaskUpdateResponse;
import com.example.task_manager.task.entity.TaskEntity;
import com.example.task_manager.team.dto.TeamActivityResponse;
import com.example.task_manager.user.entity.UserEntity;

import lombok.RequiredArgsConstructor;

/**
 * Records and maps unified activity events.
 */
@Service
@RequiredArgsConstructor
public class ActivityEventService {

  private final ActivityEventRepository activityEventRepository;
  private final ActivityEventDetailsMapper detailsMapper;

  public ActivityEventEntity recordTaskEvent(
      TaskEntity task,
      UserEntity actor,
      ActivityEventType eventType,
      ActivityEventDetails details,
      String message) {

    ActivityEventEntity event = new ActivityEventEntity();
    event.setTeamId(task.getProject().getTeam().getId());
    event.setProjectId(task.getProject().getId());
    event.setTaskId(task.getId());
    event.setEntityType(ActivityEntityType.TASK);
    event.setEntityId(task.getId());
    event.setParentEntityType(ActivityEntityType.PROJECT);
    event.setParentEntityId(task.getProject().getId());
    event.setEventType(eventType);
    event.setDetailsJson(detailsMapper.toJson(details));
    event.setMessage(message);
    event.setUser(actor);

    return activityEventRepository.save(event);
  }

  public ActivityEventEntity recordTaskComment(
      TaskEntity task,
      UserEntity actor,
      String message) {
    return recordTaskEvent(
        task,
        actor,
        ActivityEventType.TASK_COMMENTED,
        emptyDetails(),
        message);
  }

  public TaskUpdateResponse toTaskUpdateResponse(ActivityEventEntity entity) {
    TaskUpdateResponse.User user = new TaskUpdateResponse.User(
        entity.getUser().getId(),
        entity.getUser().getFirstName(),
        entity.getUser().getLastName(),
        entity.getUser().getEmail());

    TaskUpdateResponse.Task task = entity.getTaskId() == null
        ? null
        : new TaskUpdateResponse.Task(
            entity.getTaskId(),
            entity.getTask() != null ? entity.getTask().getTitle() : null);

    return new TaskUpdateResponse(
        entity.getId(),
        entity.getMessage(),
        entity.getEventType().name(),
        toFrontendDetails(entity),
        user,
        task,
        entity.getCreatedAt());
  }

  public ProjectActivityResponse toProjectActivityResponse(ActivityEventEntity entity) {
    ProjectActivityResponse.User user = new ProjectActivityResponse.User(
        entity.getUser().getId(),
        entity.getUser().getFirstName(),
        entity.getUser().getLastName(),
        entity.getUser().getEmail());

    ProjectActivityResponse.Task task = entity.getTaskId() == null
        ? null
        : new ProjectActivityResponse.Task(
            entity.getTaskId(),
            entity.getTask() != null ? entity.getTask().getTitle() : null);

    return new ProjectActivityResponse(
        entity.getId(),
        entity.getMessage(),
        entity.getEventType().name(),
        toFrontendDetails(entity),
        user,
        task,
        entity.getCreatedAt());
  }

  public TeamActivityResponse toTeamActivityResponse(ActivityEventEntity entity) {
    TeamActivityResponse.User user = new TeamActivityResponse.User(
        entity.getUser().getId(),
        entity.getUser().getFirstName(),
        entity.getUser().getLastName(),
        entity.getUser().getEmail());

    TeamActivityResponse.Project project = entity.getProjectId() == null
        ? null
        : new TeamActivityResponse.Project(
            entity.getProjectId(),
            entity.getTask() != null ? entity.getTask().getProject().getName() : null);

    TeamActivityResponse.Task task = entity.getTaskId() == null
        ? null
        : new TeamActivityResponse.Task(
            entity.getTaskId(),
            entity.getTask() != null ? entity.getTask().getTitle() : null);

    return new TeamActivityResponse(
        entity.getId(),
        entity.getMessage(),
        entity.getEventType().name(),
        toFrontendDetails(entity),
        user,
        project,
        task,
        entity.getCreatedAt());
  }

  private TaskUpdateResponse.ActivityDetails toFrontendDetails(ActivityEventEntity entity) {
    ActivityEventDetails details = detailsMapper.fromJson(entity.getDetailsJson());

    return new TaskUpdateResponse.ActivityDetails(
        details.fields() == null ? List.of() : details.fields(),
        details.from(),
        details.to(),
        details.target());
  }

  public ActivityEventDetails emptyDetails() {
    return new ActivityEventDetails(List.of(), null, null, null);
  }
}
