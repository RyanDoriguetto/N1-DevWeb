package com.example.coffee.domain.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity @Table(name="order_items")
public class OrderItem {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional=false) private Order order;
  @ManyToOne(optional=false) private Product product;
  @Column(nullable=false) private int quantity;
  @Column(nullable=false) private BigDecimal unitPrice;
  @Column(nullable=false) private BigDecimal lineTotal;

  public Long getId(){ return id; }
  public void setId(Long id){ this.id=id; }
  public Order getOrder(){ return order; }
  public void setOrder(Order o){ this.order=o; }
  public Product getProduct(){ return product; }
  public void setProduct(Product p){ this.product=p; }
  public int getQuantity(){ return quantity; }
  public void setQuantity(int q){ this.quantity=q; }
  public BigDecimal getUnitPrice(){ return unitPrice; }
  public void setUnitPrice(BigDecimal u){ this.unitPrice=u; }
  public BigDecimal getLineTotal(){ return lineTotal; }
  public void setLineTotal(BigDecimal l){ this.lineTotal=l; }
}
