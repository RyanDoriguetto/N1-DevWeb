package com.example.coffee.domain.entities;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import com.example.coffee.domain.enums.RoleName;

@Entity @Table(name="users")
public class User {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  @Column(nullable=false) private String fullName;
  @Column(nullable=false, unique=true) private String email;
  @Column(nullable=false) private String passwordHash;
  @Enumerated(EnumType.STRING) @Column(nullable=false) private RoleName type;
  @Column(nullable=false) private boolean active = true;
  @Column(nullable=false) private Instant createdAt = Instant.now();

  @ManyToMany(fetch=FetchType.EAGER)
  @JoinTable(name="user_roles",
    joinColumns=@JoinColumn(name="user_id"),
    inverseJoinColumns=@JoinColumn(name="role_id"))
  private Set<Role> roles = new HashSet<>();

  public Long getId(){return id;}
  public void setId(Long id){this.id=id;}
  public String getFullName(){return fullName;}
  public void setFullName(String s){this.fullName=s;}
  public String getEmail(){return email;}
  public void setEmail(String s){this.email=s;}
  public String getPasswordHash(){return passwordHash;}
  public void setPasswordHash(String s){this.passwordHash=s;}
  public RoleName getType(){return type;}
  public void setType(RoleName t){this.type=t;}
  public boolean isActive(){return active;}
  public void setActive(boolean a){this.active=a;}
  public Instant getCreatedAt(){return createdAt;}
  public void setCreatedAt(Instant i){this.createdAt=i;}
  public Set<Role> getRoles(){return roles;}
  public void setRoles(Set<Role> r){this.roles=r;}
}
