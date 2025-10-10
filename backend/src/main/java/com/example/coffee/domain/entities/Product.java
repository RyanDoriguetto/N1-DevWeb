package com.example.coffee.domain.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import com.example.coffee.domain.enums.ProductCategory;

@Entity @Table(name="products")
public class Product {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  @Column(nullable=false) private String name;
  private String description;
  @Enumerated(EnumType.STRING) @Column(nullable=false) private ProductCategory category;
  @Column(nullable=false) private BigDecimal price;
  @Column(nullable=false) private int prepTimeMin;
  @Column(nullable=false) private boolean available = true;
  @Column(nullable=false) private Instant createdAt = Instant.now();

  public Long getId(){return id;}
  public void setId(Long id){this.id=id;}
  public String getName(){return name;}
  public void setName(String s){this.name=s;}
  public String getDescription(){return description;}
  public void setDescription(String s){this.description=s;}
  public ProductCategory getCategory(){return category;}
  public void setCategory(ProductCategory c){this.category=c;}
  public java.math.BigDecimal getPrice(){return price;}
  public void setPrice(java.math.BigDecimal p){this.price=p;}
  public int getPrepTimeMin(){return prepTimeMin;}
  public void setPrepTimeMin(int m){this.prepTimeMin=m;}
  public boolean isAvailable(){return available;}
  public void setAvailable(boolean a){this.available=a;}
  public Instant getCreatedAt(){return createdAt;}
  public void setCreatedAt(Instant i){this.createdAt=i;}
}
