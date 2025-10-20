package com.example.coffee.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.coffee.domain.entities.Order;
public interface OrderRepository extends JpaRepository<Order, Long>{}
