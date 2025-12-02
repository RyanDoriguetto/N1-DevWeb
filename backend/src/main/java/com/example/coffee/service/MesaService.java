// src/main/java/com/example/coffee/service/MesaService.java
package com.example.coffee.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.coffee.repo.OrderRepository;
import com.example.coffee.domain.entities.Order;
import com.example.coffee.domain.entities.OrderItem;
import com.example.coffee.domain.enums.OrderStatus;
import com.example.coffee.web.dto.MesaDetalhesDTO;
import com.example.coffee.web.dto.ProdutoMesaDTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

@Service
public class MesaService {

    @Autowired
    private OrderRepository orderRepository;

    private final List<OrderStatus> STATUS_ATIVOS = Arrays.asList(
            OrderStatus.RECEBIDO,
            OrderStatus.EM_PREPARO,
            OrderStatus.PRONTO);

    public List<Integer> listarMesasNumeros() {
        // retorna 1..50 sempre
        return java.util.stream.IntStream.rangeClosed(1, 50)
                .boxed()
                .toList();
    }

    /** DETALHES DE UMA MESA ESPECÍFICA */
    public MesaDetalhesDTO buscarDetalhesMesa(Integer numeroMesa) {
        // usa fetch-join para evitar LazyInitialization ao serializar
        List<Order> pedidosAtivos = orderRepository.findByTableNumberAndStatusInFetchAll(numeroMesa, STATUS_ATIVOS);

        List<ProdutoMesaDTO> produtos = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (Order pedido : pedidosAtivos) {
            for (OrderItem item : pedido.getItems()) {
                ProdutoMesaDTO produtoDTO = new ProdutoMesaDTO(
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getLineTotal());
                produtos.add(produtoDTO);
                total = total.add(item.getLineTotal());
            }
        }
        return new MesaDetalhesDTO(numeroMesa, produtos, total);
    }

    /** ENCERRA TODOS OS PEDIDOS ATIVOS DA MESA */
    public void encerrarMesa(Integer numeroMesa) {
        List<Order> pedidosAtivos = orderRepository.findByTableNumberAndStatusIn(numeroMesa, STATUS_ATIVOS);
        for (Order pedido : pedidosAtivos) {
            pedido.setStatus(OrderStatus.ENTREGUE);
            orderRepository.save(pedido);
        }
    }
}
