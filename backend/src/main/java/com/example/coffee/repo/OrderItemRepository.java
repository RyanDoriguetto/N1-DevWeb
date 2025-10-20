package com.example.coffee.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.coffee.domain.entities.OrderItem;
public interface OrderItemRepository extends JpaRepository<OrderItem, Long>{}
