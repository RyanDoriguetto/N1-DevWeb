package com.example.coffee.security.jwt;

import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.*;

@Service
public class JwtService {
  @Value("${security.jwt.secret}") private String secret;
  @Value("${security.jwt.expiration}") private long expiration;

  public String generateToken(String subject, String role){
    Date now = new Date();
    Date exp = new Date(now.getTime() + expiration);
    return Jwts.builder()
      .setSubject(subject)
      .claim("role", role)
      .setIssuedAt(now)
      .setExpiration(exp)
      .signWith(SignatureAlgorithm.HS256, secret.getBytes())
      .compact();
  }

  public Jws<Claims> parse(String token){
    return Jwts.parser().setSigningKey(secret.getBytes()).parseClaimsJws(token);
  }
}
