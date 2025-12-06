// src/main/java/com/example/coffee/repo/OrderRepository.java
package com.example.coffee.repo;

import com.example.coffee.domain.entities.Order;
import com.example.coffee.domain.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByTableNumberAndStatusIn(Integer tableNumber, List<OrderStatus> statuses);

    @Query("""
              select distinct o
              from Order o
              left join fetch o.createdBy
              left join fetch o.items
              where o.tableNumber = :tableNumber
                and o.status in :statuses
            """)
    List<Order> findByTableNumberAndStatusInFetchAll(
            @Param("tableNumber") Integer tableNumber,
            @Param("statuses") Collection<OrderStatus> statuses);

    // usado para listar apenas os números de mesas com pedidos ativos
    @Query("select distinct o.tableNumber from Order o where o.status in :statuses")
    List<Integer> findDistinctTableNumbersByStatusIn(@Param("statuses") Collection<OrderStatus> statuses);

    // Busca pedidos por intervalo de data/hora usando o campo createdAt
    java.util.List<com.example.coffee.domain.entities.Order> findByCreatedAtBetween(
            java.time.Instant start,
            java.time.Instant end);

    // últimos pedidos pela data de criação (mais recente primeiro)
    java.util.List<Order> findTop20ByOrderByCreatedAtDesc();
}
