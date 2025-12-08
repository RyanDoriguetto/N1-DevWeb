package com.example.coffee.web;

import com.example.coffee.domain.entities.Order;
import com.example.coffee.domain.entities.OrderItem;
import com.example.coffee.domain.enums.OrderStatus;
import com.example.coffee.domain.enums.PaymentMethod;
import com.example.coffee.repo.OrderItemRepository;
import com.example.coffee.repo.OrderRepository;
import com.example.coffee.repo.ProductRepository;
import com.example.coffee.web.dto.OrderStatsDTO;
import com.example.coffee.web.dto.SalesByDayDTO;
import com.example.coffee.web.dto.TopProductDTO;
import com.example.coffee.web.dto.RecentOrderDTO;
import com.example.coffee.web.dto.PaymentResumoDTO;
import com.example.coffee.web.dto.OrderStatusResumoDTO;
import com.example.coffee.web.dto.SalesByHourDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

/**
 * Endpoints do dashboard (resumo, vendas, top produtos, etc).
 */
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

    /**
     * Helper para calcular intervalo de datas baseado em "dias".
     *
     * Ex:
     * - dias = 1 -> hoje 00:00 até amanhã 00:00
     * - dias = 7 -> 6 dias atrás 00:00 até amanhã 00:00
     */
    private static class IntervaloDatas {
        Instant inicio;
        Instant fim;

        IntervaloDatas(Instant inicio, Instant fim) {
            this.inicio = inicio;
            this.fim = fim;
        }
    }

    private IntervaloDatas calcularIntervaloDias(int dias) {
        if (dias < 1) {
            dias = 1;
        }

        ZoneId zone = ZoneId.systemDefault();
        LocalDate hoje = LocalDate.now(zone);
        LocalDate dataInicio = hoje.minusDays(dias - 1L);

        Instant inicio = dataInicio.atStartOfDay(zone).toInstant();
        Instant fim = hoje.plusDays(1).atStartOfDay(zone).toInstant(); // início de amanhã

        return new IntervaloDatas(inicio, fim);
    }

    // --------------------------------------------------------------------
    // RESUMO GERAL
    // (já preparado pra receber ?dias=N no futuro, mas funciona sem parâmetro)
    // --------------------------------------------------------------------
    @GetMapping("/resumo")
    public OrderStatsDTO getResumoGeral(
            @RequestParam(name = "dias", required = false) Integer dias) {

        List<Order> orders;

        if (dias == null || dias <= 0) {
            // comportamento atual: todos os pedidos
            orders = orderRepo.findAll();
        } else {
            // preparado para /resumo?dias=7, se quiser usar depois
            IntervaloDatas intervalo = calcularIntervaloDias(dias);
            orders = orderRepo.findByCreatedAtBetween(intervalo.inicio, intervalo.fim);
        }

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

        IntervaloDatas intervalo = calcularIntervaloDias(dias);

        List<Order> orders = orderRepo.findByCreatedAtBetween(
                intervalo.inicio, intervalo.fim);

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

        IntervaloDatas intervalo = calcularIntervaloDias(dias);

        List<OrderItem> itens = orderItemRepo.findByOrderCreatedAtBetween(
                intervalo.inicio, intervalo.fim);

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
    // RESUMO POR STATUS (funil de pedidos) - geral (sem filtro de dias)
    // --------------------------------------------------------------------
    @GetMapping("/status-pedidos")
    public OrderStatusResumoDTO getStatusPedidos(
            @RequestParam(name = "dias", required = false) Integer dias) {

        List<Order> orders;

        if (dias == null || dias <= 0) {
            // comportamento antigo: todos os pedidos
            orders = orderRepo.findAll();
        } else {
            // usa o mesmo helper de intervalo que já criamos
            IntervaloDatas intervalo = calcularIntervaloDias(dias);
            orders = orderRepo.findByCreatedAtBetween(intervalo.inicio, intervalo.fim);
        }

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
    // PAGAMENTOS POR MÉTODO - COM INTERVALO DE DIAS
    // --------------------------------------------------------------------
    @GetMapping("/pagamentos-por-metodo")
    public PaymentResumoDTO getPagamentosPorMetodo(
            @RequestParam(defaultValue = "7") int dias) {

        IntervaloDatas intervalo = calcularIntervaloDias(dias);

        List<Order> orders = orderRepo.findByCreatedAtBetween(
                intervalo.inicio, intervalo.fim);

        long pendente = 0L;
        long dinheiro = 0L;
        long cartao = 0L;
        long pix = 0L;

        BigDecimal totalDinheiro = BigDecimal.ZERO;
        BigDecimal totalCartao = BigDecimal.ZERO;
        BigDecimal totalPix = BigDecimal.ZERO;

        for (Order o : orders) {

            PaymentMethod pm = o.getPaymentMethod();
            BigDecimal total = o.getTotal() != null ? o.getTotal() : BigDecimal.ZERO;

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

        BigDecimal totalGeral = totalDinheiro.add(totalCartao).add(totalPix);

        return new PaymentResumoDTO(
                pendente,
                dinheiro,
                cartao,
                pix,
                totalDinheiro,
                totalCartao,
                totalPix,
                totalGeral);
    }

    // --------------------------------------------------------------------
    // VENDAS POR HORA (somente HOJE, apenas pedidos ENTREGUE)
    // Usado quando o usuário escolhe "1 dia" no dashboard
    // --------------------------------------------------------------------
    @GetMapping("/vendas-por-hora")
    public List<SalesByHourDTO> getVendasPorHora() {

        // usa o helper para pegar o intervalo de HOJE
        IntervaloDatas intervalo = calcularIntervaloDias(1);

        List<Order> orders = orderRepo.findByCreatedAtBetween(
                intervalo.inicio, intervalo.fim);

        ZoneId zone = ZoneId.systemDefault();

        BigDecimal[] totais = new BigDecimal[24];
        for (int i = 0; i < 24; i++) {
            totais[i] = BigDecimal.ZERO;
        }

        for (Order o : orders) {
            if (o.getStatus() != OrderStatus.ENTREGUE) {
                continue;
            }

            LocalDateTime ldt = LocalDateTime.ofInstant(o.getCreatedAt(), zone);
            int hora = ldt.getHour(); // 0..23

            BigDecimal total = o.getTotal() != null ? o.getTotal() : BigDecimal.ZERO;

            totais[hora] = totais[hora].add(total);
        }

        List<SalesByHourDTO> resultado = new ArrayList<>();
        for (int h = 0; h < 24; h++) {
            resultado.add(new SalesByHourDTO(h, totais[h]));
        }

        return resultado;
    }

}
