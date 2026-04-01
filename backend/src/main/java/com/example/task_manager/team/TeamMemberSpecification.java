package com.example.task_manager.team;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.example.task_manager.team.entity.TeamMemberEntity;
import com.example.task_manager.user.entity.UserEntity;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;

/**
 * Builds dynamic filtering logic for TeamMemberEntity queries.
 */
public class TeamMemberSpecification {

  public static Specification<TeamMemberEntity> build(
      UUID teamId,
      String search,
      UUID requesterId,
      boolean isGlobalAdmin) {

    return Specification
        .where(belongsToTeam(teamId))
        .and(search(search))
        .and(isAccessibleByUser(requesterId, isGlobalAdmin));
  }

  /**
   * Filter members by team
   */
  private static Specification<TeamMemberEntity> belongsToTeam(UUID teamId) {
    return (root, query, cb) -> {
      if (teamId == null) {
        return cb.conjunction();
      }

      return cb.equal(root.get("team").get("id"), teamId);
    };
  }

  /**
   * Search by user name or email
   */
  private static Specification<TeamMemberEntity> search(String keyword) {
    return (root, query, cb) -> {

      if (keyword == null || keyword.isBlank()) {
        return cb.conjunction();
      }

      String pattern = "%" + keyword.toLowerCase() + "%";

      Join<TeamMemberEntity, UserEntity> userJoin = root.join("user", JoinType.LEFT);

      return cb.or(
          cb.like(cb.lower(userJoin.get("firstName")), pattern),
          cb.like(cb.lower(userJoin.get("lastName")), pattern),
          cb.like(cb.lower(userJoin.get("email")), pattern));
    };
  }

  /**
   * Access control:
   * - Global admin → can see all
   * - Otherwise → only members of the team
   */
  private static Specification<TeamMemberEntity> isAccessibleByUser(
      UUID requesterId,
      boolean isGlobalAdmin) {

    return (root, query, cb) -> {

      if (isGlobalAdmin) {
        return cb.conjunction();
      }

      Join<TeamMemberEntity, UserEntity> userJoin = root.join("user", JoinType.LEFT);

      // Ensure user is part of the team
      return cb.or(
          cb.equal(root.get("team").get("owner").get("id"), requesterId),
          cb.equal(userJoin.get("id"), requesterId));
    };
  }
}