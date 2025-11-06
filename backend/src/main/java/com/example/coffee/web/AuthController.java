package com.example.coffee.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.example.coffee.security.jwt.JwtService;
import com.example.coffee.service.AuthService;
import com.example.coffee.web.dto.*;
import com.example.coffee.repo.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  private AuthService authService;
  @Autowired
  private JwtService jwtService;
  @Autowired
  private UserRepository userRepo;
  @Autowired
  private PasswordEncoder encoder;

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody @Validated LoginRequest req) {
    var u = authService.validateUser(req.email, req.password);
    if (u == null)
      return ResponseEntity.status(401).build();
    String token = jwtService.generateToken(u.getEmail(), u.getType().name());
    return ResponseEntity.ok(new LoginResponse(token, u.getType().name()));
  }
}
