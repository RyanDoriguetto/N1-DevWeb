package com.example.coffee.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

import com.example.coffee.security.jwt.JwtService;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

  @Autowired
  private JwtService jwtService;
  @Autowired
  private MyUserDetailsService myUserDetailsService;

  // CONSTRUTOR COM DEBUG - ADICIONE ESTAS LINHAS
  public JwtAuthFilter() {
    System.out.println("=== JWT AUTH FILTER CONSTRUÍDO ===");
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    // return uri.startsWith("/api/auth"); // COMENTE
    return false; // DEIXE ASSIM PARA TESTAR
  }

  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {

    String header = req.getHeader("Authorization");

    if (header != null && header.startsWith("Bearer ")) {
      String token = header.substring(7);
      try {
        var claims = jwtService.parse(token).getBody();

        String email = claims.getSubject();
        String roleFromJwt = claims.get("role", String.class);

        // DEBUG: Log dos dados do token
        System.out.println("=== DEBUG JWT FILTER ===");
        System.out.println("Email: " + email);
        System.out.println("Role from JWT: " + roleFromJwt);

        UserDetails user = myUserDetailsService.loadUserByUsername(email);

        // DEBUG: Log das authorities do UserDetails
        System.out.println("Authorities from UserDetails: " + user.getAuthorities());

        List<SimpleGrantedAuthority> authorities = user.getAuthorities().stream()
            .map(a -> new SimpleGrantedAuthority(a.getAuthority()))
            .toList();

        System.out.println("Final authorities: " + authorities);
        System.out.println("Request: " + req.getMethod() + " " + req.getRequestURI());
        System.out.println("=========================");

        var auth = new UsernamePasswordAuthenticationToken(user, null, authorities);
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
        SecurityContextHolder.getContext().setAuthentication(auth);

      } catch (Exception e) {
        System.out.println("JWT Filter error: " + e.getMessage());
      }
    }

    chain.doFilter(req, res);
  }
}