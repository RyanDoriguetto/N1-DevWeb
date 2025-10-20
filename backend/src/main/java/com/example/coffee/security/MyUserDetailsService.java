package com.example.coffee.security;

import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.coffee.repo.UserRepository;

@Service
public class MyUserDetailsService implements UserDetailsService {
  @Autowired private UserRepository userRepo;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    var u = userRepo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("not found"));
    var authorities = u.getRoles().stream()
      .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName().name()))
      .collect(Collectors.<GrantedAuthority>toList());
    return new User(u.getEmail(), u.getPasswordHash(), u.isActive(), true, true, true, authorities);
  }
}
