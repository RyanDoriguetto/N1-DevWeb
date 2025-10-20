package com.example.coffee.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.coffee.security.JwtAuthFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

  @Autowired private JwtAuthFilter jwtAuthFilter;

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .cors(cors -> {}) // <— habilita CORS usando o bean de CorsConfig
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/", "/error").permitAll()
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // <— libera preflight

        .requestMatchers("/api/auth/**").permitAll()

        .requestMatchers(HttpMethod.GET, "/api/produtos/**")
          .hasAnyRole("ADMIN","CAIXA","ATENDENTE")
        .requestMatchers(HttpMethod.POST, "/api/produtos/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.PUT, "/api/produtos/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/api/produtos/**").hasRole("ADMIN")

        .requestMatchers(HttpMethod.GET, "/api/pedidos/**")
          .hasAnyRole("ADMIN","CAIXA","ATENDENTE")
        .requestMatchers(HttpMethod.POST, "/api/pedidos/**")
          .hasAnyRole("ADMIN","CAIXA","ATENDENTE")
        .requestMatchers(HttpMethod.PUT, "/api/pedidos/*/status").hasAnyRole("ADMIN","CAIXA")
        .requestMatchers(HttpMethod.PUT, "/api/pedidos/*/pagamento").hasAnyRole("ADMIN","CAIXA")

        .requestMatchers("/api/funcionarios/**").hasRole("ADMIN")
        .anyRequest().authenticated()
      )
      .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

  @Bean
  AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
    return cfg.getAuthenticationManager();
  }
}
