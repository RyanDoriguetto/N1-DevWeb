package com.example.coffee.infra;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class NotifierClient {
  private final RestTemplate http = new RestTemplate();

  @Value("${notifier.url}")
  private String notifierUrl;

  public void emitOrderStatus(Long orderId, String status) {
    try {
      Map<String, Object> body = new HashMap<>();
      body.put("orderId", orderId);
      body.put("status", status);
      http.postForEntity(notifierUrl + "/events/order-status", body, Void.class);
    } catch (Exception e) {
      System.out.println("[Notifier] falha ao enviar evento: " + e.getMessage());
    }
  }
}
