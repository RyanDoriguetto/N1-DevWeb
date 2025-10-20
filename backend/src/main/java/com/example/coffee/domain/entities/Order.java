package com.example.coffee.domain.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import com.example.coffee.domain.enums.*;

@Entity @Table(name="orders")
public class Order {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional=false) private User createdBy;
  @Enumerated(EnumType.STRING) @Column(nullable=false) private RoleName createdByRole;
  @Column(nullable=false) private String creationType; // BALCAO|MESA
  private Integer tableNumber;
  @Column(nullable=false) private BigDecimal total = BigDecimal.ZERO;
  @Enumerated(EnumType.STRING) @Column(nullable=false) private OrderStatus status = OrderStatus.RECEBIDO;
  @Enumerated(EnumType.STRING) @Column(nullable=false) private PaymentMethod paymentMethod = PaymentMethod.PENDENTE;
  @Column(nullable=false) private boolean paid = false;
  private String notes;
  @Column(nullable=false) private Instant createdAt = Instant.now();

  @OneToMany(mappedBy="order", cascade=CascadeType.ALL, orphanRemoval=true)
  private List<OrderItem> items = new ArrayList<>();

  public Long getId(){ return id; }
  public void setId(Long id){ this.id=id; }
  public User getCreatedBy(){ return createdBy; }
  public void setCreatedBy(User u){ this.createdBy=u; }
  public RoleName getCreatedByRole(){ return createdByRole; }
  public void setCreatedByRole(RoleName r){ this.createdByRole=r; }
  public String getCreationType(){ return creationType; }
  public void setCreationType(String s){ this.creationType=s; }
  public Integer getTableNumber(){ return tableNumber; }
  public void setTableNumber(Integer t){ this.tableNumber=t; }
  public BigDecimal getTotal(){ return total; }
  public void setTotal(BigDecimal t){ this.total=t; }
  public OrderStatus getStatus(){ return status; }
  public void setStatus(OrderStatus s){ this.status=s; }
  public PaymentMethod getPaymentMethod(){ return paymentMethod; }
  public void setPaymentMethod(PaymentMethod p){ this.paymentMethod=p; }
  public boolean isPaid(){ return paid; }
  public void setPaid(boolean p){ this.paid=p; }
  public String getNotes(){ return notes; }
  public void setNotes(String n){ this.notes=n; }
  public Instant getCreatedAt(){ return createdAt; }
  public void setCreatedAt(Instant i){ this.createdAt=i; }
  public List<OrderItem> getItems(){ return items; }
  public void setItems(List<OrderItem> it){ this.items=it; }
}
