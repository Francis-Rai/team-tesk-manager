package com.example.task_manager.user;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.example.task_manager.team.entity.TeamMemberEntity;
import com.example.task_manager.user.entity.UserEntity;

public class UserSpecification {

  public static Specification<UserEntity> availableUsers(
      UUID teamId,
      String search) {
    return (root, query, cb) -> {

      var predicates = cb.conjunction();

      var subquery = query.subquery(UUID.class);
      var subRoot = subquery.from(TeamMemberEntity.class);

      subquery.select(subRoot.get("user").get("id"))
          .where(cb.equal(subRoot.get("team").get("id"), teamId));

      predicates = cb.and(predicates,
          cb.not(root.get("id").in(subquery)));

      if (search != null && !search.isBlank()) {
        String like = "%" + search.toLowerCase() + "%";

        predicates = cb.and(predicates,
            cb.or(
                cb.like(cb.lower(root.get("firstName")), like),
                cb.like(cb.lower(root.get("lastName")), like),
                cb.like(cb.lower(root.get("email")), like)));
      }

      return predicates;
    };
  }
}