package com.example.task_manager.seed;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.task_manager.seed.dto.SeedDemoDataRequest;
import com.example.task_manager.seed.dto.SeedDemoDataResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Admin endpoint for generating local demo data on demand.
 */
@RestController
@RequestMapping("/api/dev")
@RequiredArgsConstructor
public class DemoDataSeederController {

  private final DemoDataSeederService demoDataSeederService;

  @GetMapping("/test")
  public ResponseEntity<String> TEST() {
    return ResponseEntity.ok("TEST");
  }

  @PostMapping("/seed")
  public ResponseEntity<SeedDemoDataResponse> seedDemoData(
      @Valid @RequestBody SeedDemoDataRequest request,
      Authentication authentication) {
    return ResponseEntity.ok(demoDataSeederService.seed(request, authentication.getName()));
  }
}
