package com.example.coffee.web.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class RecentOrderDTO {

    private Long id;
    private String creationType; // BALCAO | MESA
    private Integer tableNumber; // pode ser null
    private BigDecimal total;
    private String status; // ENTREGUE, EM_PREPARO, etc.
    private Instant createdAt;

    public RecentOrderDTO() {
    }

    public RecentOrderDTO(Long id,
            String creationType,
            Integer tableNumber,
            BigDecimal total,
            String status,
            Instant createdAt) {
        this.id = id;
        this.creationType = creationType;
        this.tableNumber = tableNumber;
        this.total = total;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCreationType() {
        return creationType;
    }

    public void setCreationType(String creationType) {
        this.creationType = creationType;
    }

    public Integer getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(Integer tableNumber) {
        this.tableNumber = tableNumber;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
