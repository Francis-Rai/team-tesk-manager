package com.example.task_manager.team;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.task_manager.common.PageResponse;
import com.example.task_manager.exception.api.ConflictException;
import com.example.task_manager.exception.api.ForbiddenException;
import com.example.task_manager.exception.api.ResourceNotFoundException;
import com.example.task_manager.exception.api.UnauthorizedException;
import com.example.task_manager.team.dto.AddTeamMemberRequest;
import com.example.task_manager.team.dto.CreateTeamRequest;
import com.example.task_manager.team.dto.TeamMemberResponse;
import com.example.task_manager.team.dto.TeamResponse;
import com.example.task_manager.team.dto.UpdateTeamRequest;
import com.example.task_manager.team.entity.TeamEntity;
import com.example.task_manager.team.entity.TeamMemberEntity;
import com.example.task_manager.team.entity.TeamRole;
import com.example.task_manager.user.UserRepository;
import com.example.task_manager.user.entity.UserEntity;

import org.springframework.transaction.annotation.Transactional;
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

  /**
   * Removes a member in a team
   */
  public void removeMember(
      UUID teamId,
      UUID memberUserId,
      String requesterEmail) {

    UserEntity requester = userRepository.findByEmail(requesterEmail)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    TeamMemberEntity requesterMembership = teamMemberRepository
        .findByTeamIdAndUserId(teamId, requester.getId())
        .orElseThrow(() -> new ForbiddenException("Not a team member"));

    TeamMemberEntity memberToRemove = teamMemberRepository
        .findByTeamIdAndUserId(teamId, memberUserId)
        .orElseThrow(() -> new ResourceNotFoundException("Member not found"));

    // Cannot remove OWNER
    if (memberToRemove.getRole() == TeamRole.OWNER) {
      throw new ForbiddenException("Transfer ownership before removing OWNER");
    }

    // ADMIN restrictions
    if (requesterMembership.getRole() == TeamRole.ADMIN) {
      if (memberToRemove.getRole() != TeamRole.MEMBER) {
        throw new ForbiddenException("ADMIN can only remove MEMBER");
      }
    }

    // OWNER cannot remove themselves
    if (requesterMembership.getRole() == TeamRole.OWNER &&
        requester.getId().equals(memberUserId)) {
      throw new ForbiddenException("OWNER cannot remove themselves");
    }

    teamMemberRepository.delete(memberToRemove);
  }

  /**
   * Transfers Team Ownership to other member
   */
  @Transactional
  public TeamMemberResponse transferOwnership(
      UUID teamId,
      UUID newOwnerUserId,
      String requesterEmail) {

    UserEntity requester = userRepository.findByEmail(requesterEmail)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    TeamMemberEntity currentOwner = teamMemberRepository
        .findByTeamIdAndUserId(teamId, requester.getId())
        .orElseThrow(() -> new ForbiddenException("Not a team member"));

    if (currentOwner.getRole() != TeamRole.OWNER) {
      throw new ForbiddenException("Only OWNER can transfer ownership");
    }

    TeamMemberEntity newOwner = teamMemberRepository
        .findByTeamIdAndUserId(teamId, newOwnerUserId)
        .orElseThrow(() -> new ResourceNotFoundException("New owner must be team member"));

    if (newOwner.getRole() == TeamRole.OWNER) {
      throw new ConflictException("User is already OWNER");
    }

    // Transfer
    currentOwner.setRole(TeamRole.ADMIN);
    newOwner.setRole(TeamRole.OWNER);

    return mapToMemberResponse(newOwner);
  }

  /**
   * Updates team for the owner.
   */
  @Transactional
  public TeamResponse updateTeam(
      UUID teamId,
      UpdateTeamRequest request,
      String requesterEmail) {

    UserEntity requester = userRepository.findByEmail(requesterEmail)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    TeamMemberEntity membership = teamMemberRepository
        .findByTeamIdAndUserId(teamId, requester.getId())
        .orElseThrow(() -> new ForbiddenException("Not a team member"));

    if (membership.getRole() != TeamRole.OWNER) {
      throw new ForbiddenException("Only OWNER can update team");
    }

    TeamEntity team = membership.getTeam();

    if (request.name() != null) {
      if (request.name().isBlank()) {
        throw new ForbiddenException("Name cannot be blank");
      }
      team.setName(request.name());
    }

    if (request.description() != null) {
      team.setDescription(request.description());
    }

    return mapToResponse(team);
  }

  /**
   * Soft Deletes a team.
   */
  @Transactional
  public void deleteTeam(UUID teamId, String requesterEmail) {

    UserEntity requester = userRepository.findByEmail(requesterEmail)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    TeamMemberEntity membership = teamMemberRepository
        .findByTeamIdAndUserId(teamId, requester.getId())
        .orElseThrow(() -> new ForbiddenException("Not a team member"));

    if (membership.getRole() != TeamRole.OWNER) {
      throw new ForbiddenException("Only OWNER can delete team");
    }

    TeamEntity team = membership.getTeam();
    team.setDeleted(true);
    team.setDeletedAt(LocalDateTime.now());
  }

  /**
   * Returns a team by id.
   */
  public TeamResponse getTeamById(UUID teamId, String requesterEmail) {

    UserEntity requester = userRepository.findByEmail(requesterEmail)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    TeamEntity team = teamRepository.findWithMembersById(teamId)
        .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

    boolean isMember = team.getMembers()
        .stream()
        .anyMatch(m -> m.getUser().getId().equals(requester.getId()));

    if (!isMember) {
      throw new ForbiddenException("You are not a member of this team");
    }

    return mapToResponse(team);
  }

  /**
   * Returns all the team of user.
   */
  @Transactional(readOnly = true)
  public PageResponse<TeamResponse> getMyTeams(String requesterEmail, Pageable pageable) {

    UserEntity requester = userRepository.findByEmail(requesterEmail)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    Page<TeamMemberEntity> page = teamMemberRepository.findByUserId(requester.getId(), pageable);

    List<TeamResponse> content = page.getContent()
        .stream()
        .map(TeamMemberEntity::getTeam)
        .distinct()
        .map(this::mapToResponse)
        .toList();

    return new PageResponse<>(
        content,
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast());
  }

  /**
   * Returns all the team's members.
   */
  @Transactional(readOnly = true)
  public List<TeamMemberResponse> getTeamMembers(
      UUID teamId,
      String requesterEmail) {

    UserEntity requester = userRepository.findByEmail(requesterEmail)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (!teamMemberRepository.existsByTeamIdAndUserId(teamId, requester.getId())) {
      throw new ForbiddenException("Not a team member");
    }

    List<TeamMemberEntity> members = teamMemberRepository.findByTeamId(teamId);

    return members.stream()
        .map(member -> new TeamMemberResponse(
            member.getUser().getId(),
            member.getUser().getEmail(),
            member.getRole(),
            member.getJoinedAt()))
        .toList();
  }

  // HELPERS

  /**
   * Maps a TeamEntity to a TeamResponse.
   */
  public TeamResponse mapToResponse(TeamEntity team) {

    return new TeamResponse(
        team.getId(),
        team.getName(),
        team.getDescription(),
        team.getOwner().getId(),
        team.isDeleted(),
        team.getCreatedAt(),
        team.getUpdatedAt());
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
