package com.example.coffee.web.dto;

import java.math.BigDecimal;

public class SalesByDayDTO {

    // Data no formato "YYYY-MM-DD"
    private String date;

    // Total vendido nesse dia
    private BigDecimal total;

    public SalesByDayDTO() {
    }

    public SalesByDayDTO(String date, BigDecimal total) {
        this.date = date;
        this.total = total;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
