package com.example.coffee.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.coffee.domain.entities.User;
import com.example.coffee.repo.UserRepository;

@Service
public class AuthService {
  @Autowired private UserRepository userRepo;
  @Autowired private PasswordEncoder encoder;

  public User validateUser(String email, String rawPassword){
    var u = userRepo.findByEmail(email).orElse(null);
    if (u != null && encoder.matches(rawPassword, u.getPasswordHash()) && u.isActive()) {
      return u;
    }
    return null;
  }
}
