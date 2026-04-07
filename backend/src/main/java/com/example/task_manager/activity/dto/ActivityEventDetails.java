package com.example.task_manager.activity.dto;

import java.util.List;

/**
 * Structured metadata for activity events.
 */
public record ActivityEventDetails(
    List<String> fields,
    String from,
    String to,
    String target) {
}
