package com.example.coffee.web.dto;

import java.math.BigDecimal;

public class OrderStatsDTO {

    private long totalOrders;
    private BigDecimal totalRevenue;
    private BigDecimal averageTicket;
    private long totalOpenOrders;
    private long totalProducts;

    public OrderStatsDTO() {
    }

    public OrderStatsDTO(
            long totalOrders,
            BigDecimal totalRevenue,
            BigDecimal averageTicket,
            long totalOpenOrders,
            long totalProducts) {
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.averageTicket = averageTicket;
        this.totalOpenOrders = totalOpenOrders;
        this.totalProducts = totalProducts;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getAverageTicket() {
        return averageTicket;
    }

    public void setAverageTicket(BigDecimal averageTicket) {
        this.averageTicket = averageTicket;
    }

    public long getTotalOpenOrders() {
        return totalOpenOrders;
    }

    public void setTotalOpenOrders(long totalOpenOrders) {
        this.totalOpenOrders = totalOpenOrders;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }
}
