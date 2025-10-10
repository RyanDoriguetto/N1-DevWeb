package com.example.coffee.web;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.example.coffee.repo.ProductRepository;
import com.example.coffee.domain.entities.Product;

@RestController
@RequestMapping("/api/produtos")
public class ProductController {

  @Autowired
  private ProductRepository repo;

  @GetMapping
  public List<Product> list() {
    return repo.findAll();
  }

  @PostMapping
  public Product create(@RequestBody Product p) {
    return repo.save(p);
  }

  @PutMapping("/{id}")
  public Product update(@PathVariable("id") Long id, @RequestBody Product p) {
    p.setId(id);
    return repo.save(p);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable("id") Long id) {
    repo.deleteById(id);
  }
}
