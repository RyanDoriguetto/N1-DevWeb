package com.example.coffee.web;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.ResponseEntity;
import java.math.BigDecimal;
import java.util.List;
import com.example.coffee.domain.entities.*;
import com.example.coffee.domain.enums.*;
import com.example.coffee.web.dto.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.client.RestTemplate;
import com.example.coffee.repo.OrderRepository;
import com.example.coffee.repo.OrderItemRepository;
import com.example.coffee.repo.ProductRepository;
import com.example.coffee.repo.UserRepository;

@RestController
@RequestMapping("/api/pedidos")
public class OrderController {
  @Autowired
  private OrderRepository orderRepo;
  @Autowired
  private OrderItemRepository itemRepo;
  @Autowired
  private ProductRepository productRepo;
  @Autowired
  private UserRepository userRepo;
  @Value("${app.notifier.url}")
  private String notifierUrl;

  @GetMapping
  public List<Order> list() {
    return orderRepo.findAll();
  }

  @PostMapping
  public ResponseEntity<Order> create(@AuthenticationPrincipal UserDetails principal,
      @RequestBody OrderCreateRequest req) {
    var user = userRepo.findByEmail(principal.getUsername()).orElseThrow();
    var order = new Order();
    order.setCreatedBy(user);
    order.setCreatedByRole(user.getType());
    order.setCreationType(req.creationType);
    if ("MESA".equalsIgnoreCase(req.creationType) && req.tableNumber == null) {
      return ResponseEntity.badRequest().build();
    }
    order.setTableNumber(req.tableNumber);
    order.setNotes(req.notes);
    order = orderRepo.save(order);

    BigDecimal total = BigDecimal.ZERO;
    for (var it : req.items) {
      var product = productRepo.findById(it.productId).orElseThrow();
      var oi = new OrderItem();
      oi.setOrder(order);
      oi.setProduct(product);
      oi.setQuantity(it.quantity);
      oi.setUnitPrice(it.unitPrice != null ? it.unitPrice : product.getPrice());
      oi.setLineTotal(oi.getUnitPrice().multiply(BigDecimal.valueOf(oi.getQuantity())));
      itemRepo.save(oi);
      total = total.add(oi.getLineTotal());
    }
    order.setTotal(total);
    order = orderRepo.save(order);
    return ResponseEntity.ok(order);
  }

  @PutMapping("/{id}/status")
  public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
    var order = orderRepo.findById(id).orElse(null);
    if (order == null)
      return ResponseEntity.notFound().build();
    var old = order.getStatus();
    order.setStatus(status);
    orderRepo.save(order);
    try {
      new RestTemplate().postForEntity(notifierUrl + "/events/order-status",
          java.util.Map.of("orderId", order.getId(), "oldStatus", old.name(), "newStatus", status.name()),
          String.class);
    } catch (Exception e) {
      /* ignore dev */ }
    return ResponseEntity.ok(order);
  }

  @PutMapping("/{id}/pagamento")
  public ResponseEntity<Order> updatePayment(@PathVariable Long id, @RequestParam PaymentMethod method,
      @RequestParam boolean paid) {
    var order = orderRepo.findById(id).orElse(null);
    if (order == null)
      return ResponseEntity.notFound().build();
    order.setPaymentMethod(method);
    order.setPaid(paid);
    orderRepo.save(order);
    return ResponseEntity.ok(order);
  }
}
