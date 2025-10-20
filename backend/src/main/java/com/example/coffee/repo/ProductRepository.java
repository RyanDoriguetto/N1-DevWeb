package com.example.coffee.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.coffee.domain.entities.Product;
public interface ProductRepository extends JpaRepository<Product, Long>{}
