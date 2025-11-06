package com.example.coffee.web.dto;

import java.util.List;

public class OrderCreateRequest {
  public String creationType; // BALCAO|MESA
  public Integer tableNumber;
  public String notes;
  public java.util.List<OrderItemDTO> items;
}
