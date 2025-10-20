package com.example.coffee.web;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

  @GetMapping("/roles")
  public String whoAmI(Authentication auth) {
    if (auth == null) return "anonymous";
    String user = auth.getName();
    String roles = auth.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.joining(","));
    return "user=" + user + " roles=[" + roles + "]";
  }
}
