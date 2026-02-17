package com.example.task_manager.team;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.task_manager.exception.api.ConflictException;
import com.example.task_manager.exception.api.ForbiddenException;
import com.example.task_manager.exception.api.ResourceNotFoundException;
import com.example.task_manager.exception.api.UnauthorizedException;
import com.example.task_manager.team.dto.AddTeamMemberRequest;
import com.example.task_manager.team.dto.CreateTeamRequest;
import com.example.task_manager.team.dto.TeamMemberResponse;
import com.example.task_manager.team.dto.TeamResponse;
import com.example.task_manager.team.entity.TeamEntity;
import com.example.task_manager.team.entity.TeamMemberEntity;
import com.example.task_manager.team.entity.TeamRole;
import com.example.task_manager.user.UserRepository;
import com.example.task_manager.user.entity.UserEntity;

import lombok.RequiredArgsConstructor;

/**
 * Contains business logic for managing teams.
 */
@Service
@RequiredArgsConstructor
public class TeamService {

  private final TeamRepository teamRepository;
  private final TeamMemberRepository teamMemberRepository;
  private final UserRepository userRepository;

  /**
   * Creates a new team for the authenticated user.
   */
  public TeamResponse create(CreateTeamRequest request, String userEmail) {

    UserEntity owner = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    TeamEntity team = new TeamEntity();
    team.setName(request.name());
    team.setDescription(request.description());
    team.setOwner(owner);

    teamRepository.save(team);

    TeamMemberEntity ownerMember = new TeamMemberEntity();
    ownerMember.setTeam(team);
    ownerMember.setUser(owner);
    ownerMember.setRole(TeamRole.OWNER);

    teamMemberRepository.save(ownerMember);

    return mapToResponse(team);
  }

  /**
   * Adds new member in a team
   */
  public TeamMemberResponse addMember(
      UUID teamId,
      AddTeamMemberRequest request,
      String requesterEmail) {

    TeamEntity team = teamRepository.findById(teamId)
        .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

    UserEntity requester = userRepository.findByEmail(requesterEmail)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    // Permission check
    validateCanManageMembers(teamId, requester.getId());

    if (teamMemberRepository.existsByTeamIdAndUserId(teamId, request.userId())) {
      throw new ConflictException("User already in team");
    }

    UserEntity userToAdd = userRepository.findById(request.userId())
        .orElseThrow(() -> new ResourceNotFoundException("User to add not found"));

    TeamRole role = request.role() == null
        ? TeamRole.MEMBER
        : request.role();

    if (role == TeamRole.OWNER) {
      throw new IllegalArgumentException("Cannot assign OWNER role");
    }

    TeamMemberEntity newMember = new TeamMemberEntity();
    newMember.setTeam(team);
    newMember.setUser(userToAdd);
    newMember.setRole(role);

    teamMemberRepository.save(newMember);

    return mapToMemberResponse(newMember);
  }

  // HELPERS

  /**
   * Maps a TeamEntity to a TeamResponse.
   */
  public TeamResponse mapToResponse(TeamEntity team) {
    List<TeamMemberResponse> members = team.getMembers()
        .stream()
        .map(this::mapToMemberResponse)
        .toList();

    return new TeamResponse(
        team.getId(),
        team.getName(),
        team.getDescription(),
        team.getOwner().getId(),
        team.isDeleted(),
        team.getCreatedAt(),
        team.getUpdatedAt(),
        members);
  }

  /**
   * Maps a TeamMemberEntity to a TeamMemberResponse.
   */
  private TeamMemberResponse mapToMemberResponse(TeamMemberEntity member) {
    return new TeamMemberResponse(
        member.getUser().getId(),
        member.getUser().getEmail(),
        member.getRole(),
        member.getJoinedAt());
  }

  /**
   * Check if a user can manage team
   * Only Team Admin and Team Owner can manage teams
   */
  private void validateCanManageMembers(UUID teamId, UUID userId) {

    TeamMemberEntity membership = teamMemberRepository
        .findByTeamIdAndUserId(teamId, userId)
        .orElseThrow(() -> new UnauthorizedException());

    if (membership.getRole() != TeamRole.OWNER &&
        membership.getRole() != TeamRole.ADMIN) {
      throw new ForbiddenException("Insufficient permissions");
    }
  }
}
