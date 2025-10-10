package com.example.coffee.web;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.example.coffee.repo.UserRepository;
import com.example.coffee.domain.entities.User;

@RestController @RequestMapping("/api/funcionarios")
public class EmployeeController {
  @Autowired private UserRepository repo;

  @GetMapping public List<User> list(){ return repo.findAll(); }
  @PostMapping public User create(@RequestBody User u){ return repo.save(u); }
  @PutMapping("/{id}") public User update(@PathVariable Long id, @RequestBody User u){ u.setId(id); return repo.save(u); }
  @DeleteMapping("/{id}") public void delete(@PathVariable Long id){ repo.deleteById(id); }
}
