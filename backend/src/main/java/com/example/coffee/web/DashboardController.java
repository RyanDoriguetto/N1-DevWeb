package com.example.coffee.web;

import com.example.coffee.domain.entities.Order;
import com.example.coffee.domain.entities.OrderItem;
import com.example.coffee.domain.enums.OrderStatus;
import com.example.coffee.repo.OrderItemRepository;
import com.example.coffee.repo.OrderRepository;
import com.example.coffee.repo.ProductRepository;
import com.example.coffee.web.dto.OrderStatsDTO;
import com.example.coffee.web.dto.SalesByDayDTO;
import com.example.coffee.web.dto.TopProductDTO;
import com.example.coffee.web.dto.RecentOrderDTO;
import com.example.coffee.web.dto.PaymentResumoDTO;
import com.example.coffee.domain.enums.PaymentMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.coffee.web.dto.OrderStatusResumoDTO;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private OrderItemRepository orderItemRepo;

    // --------------------------------------------------------------------
    // RESUMO GERAL
    // --------------------------------------------------------------------
    @GetMapping("/resumo")
    public OrderStatsDTO getResumoGeral() {

        List<Order> orders = orderRepo.findAll();
        long totalOrders = orders.size();

        BigDecimal totalRevenue = orders.stream()
                .map(Order::getTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageTicket = BigDecimal.ZERO;
        if (totalOrders > 0) {
            averageTicket = totalRevenue.divide(
                    BigDecimal.valueOf(totalOrders),
                    2,
                    RoundingMode.HALF_UP);
        }

        long totalOpenOrders = orders.stream()
                .filter(o -> {
                    OrderStatus st = o.getStatus();
                    return st != null
                            && st != OrderStatus.ENTREGUE
                            && st != OrderStatus.CANCELADO;
                })
                .count();

        long totalProducts = productRepo.count();

        return new OrderStatsDTO(
                totalOrders,
                totalRevenue,
                averageTicket,
                totalOpenOrders,
                totalProducts);
    }

    // --------------------------------------------------------------------
    // VENDAS POR DIA (apenas pedidos ENTREGUE)
    // --------------------------------------------------------------------
    @GetMapping("/vendas-por-dia")
    public List<SalesByDayDTO> getVendasPorDia(
            @RequestParam(defaultValue = "7") int dias) {
        if (dias < 1) {
            dias = 1;
        }

        Instant agora = Instant.now();
        Instant inicio = agora.minus(dias - 1L, ChronoUnit.DAYS);

        List<Order> orders = orderRepo.findByCreatedAtBetween(inicio, agora);

        ZoneId zone = ZoneId.systemDefault();
        Map<LocalDate, BigDecimal> mapa = new TreeMap<>();

        for (Order o : orders) {

            // só considera pedidos ENTREGUE
            if (o.getStatus() != OrderStatus.ENTREGUE) {
                continue;
            }

            LocalDate data = LocalDate.ofInstant(o.getCreatedAt(), zone);
            BigDecimal totalPedido = o.getTotal() != null ? o.getTotal() : BigDecimal.ZERO;

            mapa.merge(data, totalPedido, BigDecimal::add);
        }

        List<SalesByDayDTO> resultado = new ArrayList<>();
        for (Map.Entry<LocalDate, BigDecimal> e : mapa.entrySet()) {
            String dataStr = e.getKey().toString(); // "YYYY-MM-DD"
            resultado.add(new SalesByDayDTO(dataStr, e.getValue()));
        }

        return resultado;
    }

    // --------------------------------------------------------------------
    // TOP PRODUTOS MAIS VENDIDOS (apenas pedidos ENTREGUE)
    // --------------------------------------------------------------------
    @GetMapping("/top-produtos")
    public List<TopProductDTO> getTopProdutos(
            @RequestParam(defaultValue = "7") int dias) {
        if (dias < 1) {
            dias = 1;
        }

        Instant agora = Instant.now();
        Instant inicio = agora.minus(dias - 1L, ChronoUnit.DAYS);

        List<OrderItem> itens = orderItemRepo.findByOrderCreatedAtBetween(inicio, agora);

        Map<String, Long> mapa = new HashMap<>();

        for (OrderItem item : itens) {

            // só considera pedidos ENTREGUE
            Order order = item.getOrder();
            if (order == null || order.getStatus() != OrderStatus.ENTREGUE) {
                continue;
            }

            String nome = item.getProduct().getName();
            long qtd = item.getQuantity();

            mapa.merge(nome, qtd, Long::sum);
        }

        List<TopProductDTO> lista = new ArrayList<>();
        for (Map.Entry<String, Long> e : mapa.entrySet()) {
            lista.add(new TopProductDTO(e.getKey(), e.getValue()));
        }

        // ordena por quantidade desc
        lista.sort(Comparator.comparingLong(TopProductDTO::getQuantity).reversed());

        // devolve no máximo 5
        if (lista.size() > 5) {
            return lista.subList(0, 5);
        }

        return lista;
    }

    // --------------------------------------------------------------------
    // ÚLTIMOS PEDIDOS (qualquer status)
    // --------------------------------------------------------------------
    @GetMapping("/ultimos-pedidos")
    public List<RecentOrderDTO> getUltimosPedidos(
            @RequestParam(defaultValue = "5") int limit) {
        if (limit < 1) {
            limit = 1;
        }
        if (limit > 20) {
            limit = 20;
        }

        List<Order> orders = orderRepo.findTop20ByOrderByCreatedAtDesc();

        List<RecentOrderDTO> resultado = new ArrayList<>();

        int max = Math.min(limit, orders.size());
        for (int i = 0; i < max; i++) {
            Order o = orders.get(i);

            BigDecimal total = o.getTotal() != null ? o.getTotal() : BigDecimal.ZERO;
            String status = o.getStatus() != null ? o.getStatus().name() : null;

            resultado.add(new RecentOrderDTO(
                    o.getId(),
                    o.getCreationType(),
                    o.getTableNumber(),
                    total,
                    status,
                    o.getCreatedAt()));
        }

        return resultado;
    }

    // --------------------------------------------------------------------
    // RESUMO POR STATUS (funil de pedidos)
    // --------------------------------------------------------------------
    @GetMapping("/status-pedidos")
    public OrderStatusResumoDTO getStatusPedidos() {

        java.util.List<Order> orders = orderRepo.findAll();

        long recebido = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.RECEBIDO)
                .count();

        long emPreparo = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.EM_PREPARO)
                .count();

        long pronto = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.PRONTO)
                .count();

        long entregue = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.ENTREGUE)
                .count();

        long cancelado = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.CANCELADO)
                .count();

        return new OrderStatusResumoDTO(
                recebido,
                emPreparo,
                pronto,
                entregue,
                cancelado);
    }

        // --------------------------------------------------------------------
    // PAGAMENTOS POR MÉTODO
    // --------------------------------------------------------------------
    @GetMapping("/pagamentos-por-metodo")
    public PaymentResumoDTO getPagamentosPorMetodo() {

        java.util.List<Order> orders = orderRepo.findAll();

        long pendente = 0L;
        long dinheiro = 0L;
        long cartao = 0L;
        long pix = 0L;

        java.math.BigDecimal totalDinheiro = java.math.BigDecimal.ZERO;
        java.math.BigDecimal totalCartao = java.math.BigDecimal.ZERO;
        java.math.BigDecimal totalPix = java.math.BigDecimal.ZERO;

        for (Order o : orders) {

            PaymentMethod pm = o.getPaymentMethod();
            java.math.BigDecimal total =
                    o.getTotal() != null ? o.getTotal() : java.math.BigDecimal.ZERO;

            // se não tem método definido, considera como pendente
            if (pm == null || pm == PaymentMethod.PENDENTE) {
                pendente++;
                continue;
            }

            switch (pm) {
                case DINHEIRO -> {
                    dinheiro++;
                    totalDinheiro = totalDinheiro.add(total);
                }
                case CARTAO -> {
                    cartao++;
                    totalCartao = totalCartao.add(total);
                }
                case PIX -> {
                    pix++;
                    totalPix = totalPix.add(total);
                }
                default -> {
                    // nada
                }
            }
        }

        java.math.BigDecimal totalGeral =
                totalDinheiro.add(totalCartao).add(totalPix);

        return new PaymentResumoDTO(
                pendente,
                dinheiro,
                cartao,
                pix,
                totalDinheiro,
                totalCartao,
                totalPix,
                totalGeral
        );
    }

}
