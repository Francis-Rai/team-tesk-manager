package com.example.task_manager.team;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.task_manager.common.PageResponse;
import com.example.task_manager.exception.api.BadRequestInputException;
import com.example.task_manager.exception.api.ConflictException;
import com.example.task_manager.exception.api.ForbiddenException;
import com.example.task_manager.exception.api.ResourceNotFoundException;
import com.example.task_manager.project.ProjectRepository;
import com.example.task_manager.task.TaskRepository;
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
  private final ProjectRepository projectRepository;
  private final TaskRepository taskRepository;

  /**
   * Creates a new team for the authenticated user.
   */
  @Transactional
  public TeamResponse create(
      CreateTeamRequest request,
      String userEmail) {

    UserEntity owner = getUserByEmail(userEmail);

    // (TODO)ADD USER SHOULD BE GLOBAL ADMIN OR SUPER ADMIN

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
  @Transactional
  public TeamMemberResponse addMember(
      UUID teamId,
      AddTeamMemberRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    // Ensures team exists, not deleted, requester is OWNER/ADMIN
    TeamMemberEntity requesterMembership = validateCanManageTeam(teamId, requester.getId());

    TeamEntity team = requesterMembership.getTeam();

    // Soft-delete aware membership check
    if (teamMemberRepository.existsByTeamIdAndUserIdAndTeamDeletedAtIsNull(
        teamId, request.userId())) {
      throw new ConflictException("User already in team");
    }

    UserEntity userToAdd = getUserById(request.userId());

    TeamRole role = request.role() == null
        ? TeamRole.MEMBER
        : request.role();

    // Prevent direct OWNER assignment
    if (role == TeamRole.OWNER) {
      throw new ConflictException("Cannot assign OWNER role");
    }

    TeamMemberEntity newMember = new TeamMemberEntity();
    newMember.setTeam(team);
    newMember.setUser(userToAdd);
    newMember.setRole(role);

    try {
      teamMemberRepository.save(newMember);
    } catch (DataIntegrityViolationException ex) {
      // Protect against concurrent inserts
      throw new ConflictException("User already in team");
    }

    return mapToMemberResponse(newMember);
  }

  /**
   * Removes a member in a team
   */
  @Transactional
  public void removeMember(
      UUID teamId,
      UUID memberUserId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamMemberEntity requesterMembership = validateCanManageTeam(teamId, requester.getId());

    TeamMemberEntity memberToRemove = getMembership(teamId, memberUserId);

    // Cannot remove OWNER
    if (memberToRemove.getRole() == TeamRole.OWNER) {
      throw new ForbiddenException("Transfer ownership before removing OWNER");
    }

    // ADMIN can only remove MEMBER
    if (requesterMembership.getRole() == TeamRole.ADMIN &&
        memberToRemove.getRole() != TeamRole.MEMBER) {
      throw new ForbiddenException("ADMIN can only remove MEMBER");
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

    UserEntity requester = getUserByEmail(requesterEmail);

    // Ensures team exists, requester is member
    TeamMemberEntity requesterMember = validateOwner(teamId, requester.getId());

    // Cannot transfer to self
    if (requester.getId().equals(newOwnerUserId)) {
      throw new ConflictException("You are already the OWNER");
    }

    TeamMemberEntity newOwner = getMembership(teamId, newOwnerUserId);

    if (newOwner.getRole() == TeamRole.OWNER) {
      throw new ConflictException("User is already OWNER");
    }

    // Transfer roles atomically
    requesterMember.setRole(TeamRole.ADMIN);
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

    UserEntity requester = getUserByEmail(requesterEmail);

    // Ensures team exists, not deleted, and requester is OWNER
    TeamMemberEntity requesterMembership = validateOwner(teamId, requester.getId());

    TeamEntity team = requesterMembership.getTeam();

    if (request.name() != null) {
      String trimmedName = request.name().trim();

      // Fix Codex
      if (trimmedName.isEmpty()) {
        throw new BadRequestInputException("Team name cannot be blank");
      }

      team.setName(trimmedName);
    }

    if (request.description() != null) {
      team.setDescription(request.description().trim());
    }

    return mapToResponse(team);
  }

  /**
   * Soft Deletes a team.
   */
  @Transactional
  public void deleteTeam(UUID teamId, String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamMemberEntity owner = validateOwner(teamId, requester.getId());

    TeamEntity team = owner.getTeam();

    Instant now = Instant.now();

    // Soft delete team
    team.setDeletedAt(now);

    // Soft delete projects
    projectRepository.softDeleteByTeamId(teamId, now);

    // Soft delete tasks under team (direct bulk update)
    taskRepository.softDeleteByTeamId(teamId, now);
  }

  /**
   * Returns a team by id.
   */
  @Transactional(readOnly = true)
  public TeamResponse getTeamById(UUID teamId, String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    // Ensures:
    // - Team exists
    // - Team not deleted
    // - User is member
    TeamMemberEntity membership = getMembership(teamId, requester.getId());

    TeamEntity team = membership.getTeam();

    return mapToResponse(team);
  }

  /**
   * Returns all the team of user.
   */
  @Transactional(readOnly = true)
  public PageResponse<TeamResponse> getMyTeams(String requesterEmail, Pageable pageable) {

    UserEntity requester = getUserByEmail(requesterEmail);

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

    UserEntity requester = getUserByEmail(requesterEmail);

    boolean isMember = teamMemberRepository
        .existsByTeamIdAndUserIdAndTeamDeletedAtIsNull(
            teamId, requester.getId());

    if (!isMember) {
      throw new ResourceNotFoundException("Team not found");
    }

    List<TeamMemberEntity> members = teamMemberRepository.findMembersByTeamId(teamId);

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
   * Returns the user by email
   */
  private UserEntity getUserByEmail(String email) {
    UserEntity user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    return user;
  }

  /**
   * Returns the user by id
   */
  private UserEntity getUserById(UUID id) {
    UserEntity user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    return user;
  }

  /**
   * Ensures:
   * - Team exists
   * - Team not deleted
   * - Membership exists
   *
   * Returns membership entity.
   * Uses ResourceNotFound to prevent ID probing.
   */
  private TeamMemberEntity getMembership(UUID teamId, UUID userId) {

    return teamMemberRepository
        .findByTeamIdAndUserIdAndTeamDeletedAtIsNull(teamId, userId)
        .orElseThrow(() -> new ResourceNotFoundException("Team not found"));
  }

  /**
   * Ensures:
   * - Team exists
   * - Team not soft deleted
   * - User is member
   * - Role is OWNER or ADMIN
   */
  private TeamMemberEntity validateCanManageTeam(UUID teamId, UUID userId) {

    TeamMemberEntity membership = getMembership(teamId, userId);

    if (membership.getRole() != TeamRole.OWNER &&
        membership.getRole() != TeamRole.ADMIN) {
      throw new ForbiddenException("Insufficient permissions");
    }

    return membership;
  }

  private TeamMemberEntity validateOwner(UUID teamId, UUID userId) {

    TeamMemberEntity member = getMembership(teamId, userId);

    if (member.getRole() != TeamRole.OWNER) {
      throw new ForbiddenException("Only owner allowed");
    }

    return member;
  }

}
