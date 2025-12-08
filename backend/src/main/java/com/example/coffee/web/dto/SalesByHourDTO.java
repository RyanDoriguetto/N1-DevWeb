package com.example.coffee.web.dto;

import java.math.BigDecimal;

public class SalesByHourDTO {

    private int hour;
    private BigDecimal total;

    public SalesByHourDTO(int hour, BigDecimal total) {
        this.hour = hour;
        this.total = total;
    }

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
