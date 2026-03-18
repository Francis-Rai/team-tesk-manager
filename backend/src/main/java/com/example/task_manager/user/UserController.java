package com.example.task_manager.user;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.task_manager.user.dto.UpdatePasswordRequest;
import com.example.task_manager.user.dto.UpdateUserProfileRequest;
import com.example.task_manager.user.dto.UserResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/* 
* REST controller for managing users.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  /*
   * Get All Active Users
   */
  @GetMapping
  public ResponseEntity<List<UserResponse>> getUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
  }

  /*
   * Update User Details
   */
  @PatchMapping("/{userId}")
  public ResponseEntity<UserResponse> updateUserDetails(
      @PathVariable UUID userId,
      @Valid @RequestBody UpdateUserProfileRequest request) {
    return ResponseEntity.ok(userService.updateProfile(userId, request));
  }

  /*
   * Update User Password
   */
  @PatchMapping("/{userId}/password")
  public ResponseEntity<Void> updateUserPassword(
      @PathVariable UUID userId,
      @Valid @RequestBody UpdatePasswordRequest request) {
    userService.updatePassword(userId, request);
    return ResponseEntity.noContent().build();
  }

  /*
   * Get Active User's Details
   */
  @GetMapping("/me")
  public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
    return ResponseEntity.ok(userService.getByEmail(authentication.getName()));
  }
}