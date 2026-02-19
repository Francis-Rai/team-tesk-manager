package com.example.task_manager.team;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.task_manager.common.PageResponse;
import com.example.task_manager.team.dto.AddTeamMemberRequest;
import com.example.task_manager.team.dto.CreateTeamRequest;
import com.example.task_manager.team.dto.TeamMemberResponse;
import com.example.task_manager.team.dto.TeamResponse;
import com.example.task_manager.team.dto.UpdateTeamRequest;

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

  /**
   * Transfer ownership of a team.
   */
  @PatchMapping("/{teamId}/transfer/{userId}")
  public ResponseEntity<TeamMemberResponse> transferOwnership(
      @PathVariable UUID teamId,
      @PathVariable UUID userId,
      Authentication authentication) {
    return ResponseEntity.ok(teamService.transferOwnership(teamId, userId, authentication.getName()));
  }

  /**
   * Remove a member of a team.
   */
  @DeleteMapping("/{teamId}/members/{userId}")
  public ResponseEntity<Void> removeMember(
      @PathVariable UUID teamId,
      @PathVariable UUID userId,
      Authentication authentication) {
    teamService.removeMember(teamId, userId, authentication.getName());
    return ResponseEntity.noContent().build();
  }

  /**
   * Update team info.
   */
  @PatchMapping("/{teamId}")
  public ResponseEntity<TeamResponse> updateTeam(
      @PathVariable UUID teamId,
      @Valid @RequestBody UpdateTeamRequest request,
      Authentication authentication) {
    return ResponseEntity.ok(teamService.updateTeam(teamId, request, authentication.getName()));
  }

  /**
   * Soft delete a team.
   */
  @DeleteMapping("/{teamId}")
  public ResponseEntity<Void> deleteTeam(
      @PathVariable UUID teamId,
      Authentication authentication) {
    teamService.deleteTeam(teamId, authentication.getName());
    return ResponseEntity.noContent().build();
  }

  /**
   * Get team by ID.
   */
  @GetMapping("/{teamId}")
  public ResponseEntity<TeamResponse> getTeam(
      @PathVariable UUID teamId,
      Authentication authentication) {
    TeamResponse response = teamService.getTeamById(teamId, authentication.getName());

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{teamId}/members")
  public ResponseEntity<List<TeamMemberResponse>> getTeamMembers(
      @PathVariable UUID teamId,
      Authentication authentication) {
    return ResponseEntity.ok(teamService.getTeamMembers(teamId, authentication.getName()));
  }

  /**
   * Get all user's teams
   */
  @GetMapping
  public ResponseEntity<PageResponse<TeamResponse>> getMyTeams(
      @PageableDefault(size = 10, sort = "joinedAt", direction = Sort.Direction.DESC) Pageable pageable,
      Authentication authentication) {
    PageResponse<TeamResponse> response = teamService.getMyTeams(authentication.getName(), pageable);

    return ResponseEntity.ok(response);
  }

}
