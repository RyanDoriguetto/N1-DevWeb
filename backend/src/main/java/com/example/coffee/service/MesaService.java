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

    public MesaDetalhesDTO buscarDetalhesMesa(Integer numeroMesa) {
        // Buscar pedidos ativos da mesa
        List<Order> pedidosAtivos = orderRepository.findByTableNumberAndStatusIn(numeroMesa, STATUS_ATIVOS);
        
        List<ProdutoMesaDTO> produtos = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        
        // Processar todos os itens de todos os pedidos
        for (Order pedido : pedidosAtivos) {
            for (OrderItem item : pedido.getItems()) {
                ProdutoMesaDTO produtoDTO = new ProdutoMesaDTO(
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

    public void encerrarMesa(Integer numeroMesa) {
        // Buscar pedidos ativos da mesa
        List<Order> pedidosAtivos = orderRepository.findByTableNumberAndStatusIn(numeroMesa, STATUS_ATIVOS);
        
        // Atualizar status para ENTREGUE (encerrado)
        for (Order pedido : pedidosAtivos) {
            pedido.setStatus(OrderStatus.ENTREGUE);
            orderRepository.save(pedido);
        }
    }
}