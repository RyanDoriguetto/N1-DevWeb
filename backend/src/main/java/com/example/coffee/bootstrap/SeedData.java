package com.example.coffee.bootstrap;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import com.example.coffee.repo.*;
import com.example.coffee.domain.entities.*;
import com.example.coffee.domain.enums.*;

@Component
public class SeedData implements CommandLineRunner {
  @Autowired private RoleRepository roleRepo;
  @Autowired private UserRepository userRepo;
  @Autowired private ProductRepository productRepo;
  @Autowired private PasswordEncoder encoder;

  @Override
  public void run(String... args) throws Exception {
    // Roles
    for (var rn : RoleName.values()) {
      roleRepo.findByName(rn).orElseGet(() -> {
        var r = new Role(); r.setName(rn); return roleRepo.save(r);
      });
    }
    // Users
    if (userRepo.findByEmail("admin@coffee.local").isEmpty()) {
      createUser("Administrador", "admin@coffee.local", "123456", RoleName.ADMIN);
    }
    if (userRepo.findByEmail("caixa@coffee.local").isEmpty()) {
      createUser("Caixa", "caixa@coffee.local", "123456", RoleName.CAIXA);
    }
    if (userRepo.findByEmail("aten@coffee.local").isEmpty()) {
      createUser("Atendente", "aten@coffee.local", "123456", RoleName.ATENDENTE);
    }
    // Products
    if (productRepo.count() == 0) {
      product("Café Espresso", ProductCategory.CAFE, new java.math.BigDecimal("6.00"), 3, true);
      product("Cappuccino", ProductCategory.BEBIDA, new java.math.BigDecimal("10.00"), 5, true);
      product("Pão de Queijo", ProductCategory.COMIDA, new java.math.BigDecimal("7.50"), 8, true);
      product("Cheesecake", ProductCategory.SOBREMESA, new java.math.BigDecimal("12.00"), 10, true);
    }
  }

  private void createUser(String name, String email, String raw, RoleName rn){
    var u = new User();
    u.setFullName(name);
    u.setEmail(email);
    u.setPasswordHash(encoder.encode(raw));
    u.setType(rn);
    var role = roleRepo.findByName(rn).orElseThrow();
    var set = new java.util.HashSet<Role>();
    set.add(role);
    u.setRoles(set);
    userRepo.save(u);
  }

  private void product(String name, ProductCategory cat, java.math.BigDecimal price, int prep, boolean avail){
    var p = new Product();
    p.setName(name);
    p.setCategory(cat);
    p.setPrice(price);
    p.setPrepTimeMin(prep);
    p.setAvailable(avail);
    productRepo.save(p);
  }
}
