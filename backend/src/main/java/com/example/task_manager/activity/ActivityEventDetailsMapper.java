package com.example.task_manager.activity;

import org.springframework.stereotype.Component;

import com.example.task_manager.activity.dto.ActivityEventDetails;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Serializes activity event details for persistence.
 */
@Component
public class ActivityEventDetailsMapper {

  private final ObjectMapper objectMapper;

  public ActivityEventDetailsMapper(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  public String toJson(ActivityEventDetails details) {
    try {
      return objectMapper.writeValueAsString(details);
    } catch (JsonProcessingException ex) {
      throw new IllegalStateException("Failed to serialize activity event details", ex);
    }
  }

  public ActivityEventDetails fromJson(String detailsJson) {
    if (detailsJson == null || detailsJson.isBlank()) {
      return new ActivityEventDetails(java.util.List.of(), null, null, null);
    }

    try {
      return objectMapper.readValue(detailsJson, ActivityEventDetails.class);
    } catch (JsonProcessingException ex) {
      throw new IllegalStateException("Failed to deserialize activity event details", ex);
    }
  }
}
