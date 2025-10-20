package com.example.coffee.web.dto;
import java.math.BigDecimal;
import com.example.coffee.domain.enums.ProductCategory;
public class ProductDTO {
  public Long id;
  public String name;
  public String description;
  public ProductCategory category;
  public BigDecimal price;
  public int prepTimeMin;
  public boolean available;
}
