package com.example.task_manager.team;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.task_manager.team.dto.AddTeamMemberRequest;
import com.example.task_manager.team.dto.CreateTeamRequest;
import com.example.task_manager.team.dto.TeamMemberResponse;
import com.example.task_manager.team.dto.TeamResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller for managing teams.
 */
@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

  private final TeamService teamService;

  /**
   * Create new team.
   */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseEntity<TeamResponse> create(
      @Valid @RequestBody CreateTeamRequest request,
      Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED).body(teamService.create(request, authentication.getName()));
  }

  /**
   * Add members in a team.
   */
  @PostMapping("/{teamId}/members")
  public ResponseEntity<TeamMemberResponse> addMember(
      @PathVariable UUID teamId,
      @Valid @RequestBody AddTeamMemberRequest request,
      Authentication authentication) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(teamService.addMember(teamId, request, authentication.getName()));
  }

}
