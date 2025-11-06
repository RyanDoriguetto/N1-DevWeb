package com.example.coffee.web.dto;

public class LoginResponse {
  public String accessToken;
  public String role;

  public LoginResponse(String t, String r) {
    this.accessToken = t;
    this.role = r;
  }
}
