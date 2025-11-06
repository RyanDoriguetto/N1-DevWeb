package com.example.coffee.web;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
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
  public ResponseEntity<?> delete(@PathVariable("id") Long id) {
    try {
      repo.deleteById(id);
      return ResponseEntity.noContent().build();

    } catch (DataIntegrityViolationException e) {
      // Retorna JSON com o erro para o front-end
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", "Não pode excluir um produto em uso");
      errorResponse.put("message", "Este produto está vinculado a pedidos existentes");

      return ResponseEntity.status(409).body(errorResponse);

    } catch (Exception e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", "Erro ao excluir produto");
      errorResponse.put("message", e.getMessage());

      return ResponseEntity.badRequest().body(errorResponse);
    }
  }
}