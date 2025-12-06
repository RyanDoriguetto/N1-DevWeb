package com.example.coffee.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.coffee.domain.entities.OrderItem;

import java.time.Instant;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Busca itens de pedido por intervalo de data de criação do pedido
    List<OrderItem> findByOrderCreatedAtBetween(Instant start, Instant end);
}
