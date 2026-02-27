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

import jakarta.persistence.EntityManager;

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
  private final EntityManager entityManager;

  /**
   * Creates a new team for the authenticated user.
   * Sets user as the owner
   */
  @Transactional
  public TeamResponse createTeam(
      CreateTeamRequest request,
      String userEmail) {

    UserEntity owner = getUserByEmail(userEmail);

    // (TODO)ADD USER SHOULD BE GLOBAL ADMIN OR SUPER ADMIN

    // Checks uniqueness of Team Name by Owner
    if (teamRepository.existsByOwnerIdAndNameAndDeletedAtIsNull(
        owner.getId(), request.name().trim())) {
      throw new ConflictException("Team name already exists for User");
    }

    TeamEntity team = new TeamEntity();
    team.setName(request.name());
    team.setDescription(request.description());
    team.setOwner(owner);

    // Flush immediately so unique-constraint violations are caught here
    // and mapped to a domain conflict.
    try {
      teamRepository.saveAndFlush(team);
    } catch (DataIntegrityViolationException ex) {
      throw new ConflictException("Team name already exists for User");
    }

    TeamMemberEntity ownerMember = new TeamMemberEntity();
    ownerMember.setTeam(team);
    ownerMember.setUser(owner);
    ownerMember.setRole(TeamRole.OWNER);

    teamMemberRepository.save(ownerMember);

    return mapToResponse(team);
  }

  /**
   * Updates team information.
   * Only Owner can update the team
   */
  @Transactional
  public TeamResponse updateTeam(
      UUID teamId,
      UpdateTeamRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamMemberEntity requesterMembership = validateOwner(teamId, requester.getId());

    TeamEntity team = requesterMembership.getTeam();

    if (request.name() != null) {
      String trimmedName = request.name().trim();

      // Checks if name is blank
      if (trimmedName.isEmpty()) {
        throw new BadRequestInputException("Team name cannot be blank");
      }

      // Checks if name is unique for the user
      if (!trimmedName.equals(team.getName()) &&
          teamRepository.existsByOwnerIdAndNameAndDeletedAtIsNull(
              team.getOwner().getId(), trimmedName)) {
        throw new ConflictException("Team name already exists for User");
      }
      team.setName(trimmedName);
    }

    if (request.description() != null) {
      team.setDescription(request.description().trim());
    }

    return mapToResponse(team);
  }

  /**
   * Soft-deletes a team and cascades soft-delete to all dependent data.
   * Only Owner can soft-delete team
   */
  @Transactional
  public void deleteTeam(
      UUID teamId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamMemberEntity owner = validateOwner(teamId, requester.getId());

    TeamEntity team = owner.getTeam();

    Instant now = Instant.now();

    team.setDeletedAt(now);
    // Bulk repository updates clear persistence context; flush prevents losing
    // the in-memory team update before the transaction commits.
    entityManager.flush();

    // Soft-delete tasks and projects owned by this team.
    taskRepository.softDeleteByTeamId(teamId, now);
    projectRepository.softDeleteByTeamId(teamId, now);
  }

  /**
   * Adds new member in a team
   * New member must be unique for the team
   */
  @Transactional
  public TeamMemberResponse addMember(
      UUID teamId,
      AddTeamMemberRequest request,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamMemberEntity requesterMembership = validateCanManageTeam(teamId, requester.getId());

    TeamEntity team = requesterMembership.getTeam();

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

    // Flush immediately so unique-constraint violations are caught here
    // and mapped to a domain conflict.
    try {
      teamMemberRepository.saveAndFlush(newMember);
    } catch (DataIntegrityViolationException ex) {
      throw new ConflictException("User already in team");
    }

    return mapToMemberResponse(newMember);
  }

  /**
   * Removes a member in a team
   * Only Admin and Owner can remove member
   * Only Owner can remove an Admin and can't remove themselves
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
   * Transfers Team Ownership to another member
   */
  @Transactional
  public TeamMemberResponse transferOwnership(
      UUID teamId,
      UUID newOwnerUserId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamMemberEntity requesterMember = validateOwner(teamId, requester.getId());

    // Cannot transfer to self
    if (requester.getId().equals(newOwnerUserId)) {
      throw new ConflictException("You are already the OWNER");
    }

    validateMembership(teamId, newOwnerUserId);

    TeamMemberEntity newOwner = getMembership(teamId, newOwnerUserId);

    requesterMember.setRole(TeamRole.ADMIN);
    newOwner.setRole(TeamRole.OWNER);

    return mapToMemberResponse(newOwner);
  }

  /**
   * Returns an non-archived team by id.
   * Ensures :
   * - Requester is a member
   */
  @Transactional(readOnly = true)
  public TeamResponse getActiveTeamById(
      UUID teamId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamMemberEntity membership = getMembership(teamId, requester.getId());

    return mapToResponse(membership.getTeam());
  }

  /**
   * Returns an existing team by id.
   * Ensures :
   * - Requester is a member
   */
  @Transactional(readOnly = true)
  public TeamResponse getExistingTeamById(
      UUID teamId,
      String requesterEmail) {

    UserEntity requester = getUserByEmail(requesterEmail);

    TeamMemberEntity membership = teamMemberRepository
        .findByTeamIdAndUserId(teamId, requester.getId())
        .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

    return mapToResponse(membership.getTeam());
  }

  /**
   * Returns all existing team of authenticated user.
   */
  @Transactional(readOnly = true)
  public PageResponse<TeamResponse> getAllExistingTeams(
      String requesterEmail,
      Pageable pageable) {

    UserEntity requester = getUserByEmail(requesterEmail);

    Page<TeamEntity> page = teamRepository.findExistingTeamsByUser(
        requester.getId(),
        pageable);

    return new PageResponse<>(
        page.map(this::mapToResponse).getContent(),
        page.getNumber(),
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast());
  }

  /**
   * Returns all non-archived team of authenticated user.
   */
  @Transactional(readOnly = true)
  public PageResponse<TeamResponse> getAllActiveTeams(
      String requesterEmail,
      Pageable pageable) {

    UserEntity requester = getUserByEmail(requesterEmail);

    Page<TeamEntity> page = teamRepository.findActiveTeamsByUser(
        requester.getId(),
        pageable);

    return new PageResponse<>(
        page.map(this::mapToResponse).getContent(),
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

    validateMembership(teamId, requester.getId());

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
   * Maps a TeamEntity to a Team Response.
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
   * Checks if a User is member of a team
   */
  private void validateMembership(UUID teamId, UUID userId) {
    boolean isMember = teamMemberRepository
        .existsByTeamIdAndUserId(
            teamId, userId);

    if (!isMember) {
      throw new ResourceNotFoundException("User is not a member");
    }
  }

  /**
   * Ensures:
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

  /**
   * Ensures:
   * - User is a member
   * - Role is Owner
   */
  private TeamMemberEntity validateOwner(UUID teamId, UUID userId) {

    TeamMemberEntity member = getMembership(teamId, userId);

    if (member.getRole() != TeamRole.OWNER) {
      throw new ForbiddenException("Only owner allowed");
    }

    return member;
  }

}
