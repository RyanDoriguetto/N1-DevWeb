// src/main/java/com/example/coffee/service/MesaService.java
package com.example.coffee.service;

import com.example.coffee.domain.entities.Order;
import com.example.coffee.domain.entities.OrderItem;
import com.example.coffee.domain.enums.OrderStatus;
import com.example.coffee.repo.OrderItemRepository;
import com.example.coffee.repo.OrderRepository;
import com.example.coffee.web.dto.MesaDetalhesDTO;
import com.example.coffee.web.dto.ProdutoMesaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class MesaService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    private final List<OrderStatus> STATUS_ATIVOS = Arrays.asList(
            OrderStatus.RECEBIDO,
            OrderStatus.EM_PREPARO,
            OrderStatus.PRONTO
    );

    /** Números de mesa disponíveis (1..50) */
    public List<Integer> listarMesasNumeros() {
        return java.util.stream.IntStream.rangeClosed(1, 50)
                .boxed()
                .toList();
    }

    /** DETALHES DE UMA MESA ESPECÍFICA */
    public MesaDetalhesDTO buscarDetalhesMesa(Integer numeroMesa) {
        // usa fetch-join para evitar LazyInitialization ao serializar
        List<Order> pedidosAtivos = orderRepository
                .findByTableNumberAndStatusInFetchAll(numeroMesa, STATUS_ATIVOS);

        List<ProdutoMesaDTO> produtos = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (Order pedido : pedidosAtivos) {
            for (OrderItem item : pedido.getItems()) {
                ProdutoMesaDTO produtoDTO = new ProdutoMesaDTO(
                        item.getId(),                          // agora com itemId
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getLineTotal()
                );
                produtos.add(produtoDTO);
                total = total.add(item.getLineTotal());
            }
        }

        return new MesaDetalhesDTO(numeroMesa, produtos, total);
    }

    /** ENCERRA TODOS OS PEDIDOS ATIVOS DA MESA */
    public void encerrarMesa(Integer numeroMesa) {
        List<Order> pedidosAtivos = orderRepository
                .findByTableNumberAndStatusIn(numeroMesa, STATUS_ATIVOS);

        for (Order pedido : pedidosAtivos) {
            pedido.setStatus(OrderStatus.ENTREGUE);
            orderRepository.save(pedido);
        }
    }

    /** Lista os números das mesas que têm pedidos ativos (ocupadas) */
    public List<Integer> listarMesasOcupadas() {
        List<Integer> ocupadas = new ArrayList<>();

        // abordagem simples: varre as mesas e reaproveita a regra de buscarDetalhesMesa
        for (int mesa = 1; mesa <= 50; mesa++) {
            MesaDetalhesDTO detalhes = buscarDetalhesMesa(mesa);
            if (detalhes.getProdutos() != null && !detalhes.getProdutos().isEmpty()) {
                ocupadas.add(mesa);
            }
        }

        return ocupadas;
    }

    /** CANCELA UM ITEM ESPECÍFICO (ajusta total do pedido e remove o item) */
    public void cancelarItem(Long itemId) {
        OrderItem item = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));

        Order order = item.getOrder();

        if (order != null) {
            BigDecimal linha = item.getLineTotal() != null ? item.getLineTotal() : BigDecimal.ZERO;
            BigDecimal totalAtual = order.getTotal() != null ? order.getTotal() : BigDecimal.ZERO;

            BigDecimal novoTotal = totalAtual.subtract(linha);
            if (novoTotal.compareTo(BigDecimal.ZERO) < 0) {
                novoTotal = BigDecimal.ZERO;
            }

            order.setTotal(novoTotal);
            order.getItems().remove(item);
            orderRepository.save(order);
        }

        // remove o item em si
        orderItemRepository.delete(item);
    }
}
