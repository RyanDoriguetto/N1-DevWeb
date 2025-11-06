package com.example.coffee.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.coffee.domain.entities.Order;
import com.example.coffee.domain.enums.OrderStatus;
import java.util.List;

@Repository // ← ADICIONAR ESTA LINHA
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByTableNumberAndStatusIn(Integer tableNumber, List<OrderStatus> statuses);
}