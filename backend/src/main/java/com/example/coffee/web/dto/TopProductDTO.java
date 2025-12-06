package com.example.coffee.web.dto;

public class TopProductDTO {

    private String productName;
    private long quantity;

    public TopProductDTO() {
    }

    public TopProductDTO(String productName, long quantity) {
        this.productName = productName;
        this.quantity = quantity;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public long getQuantity() {
        return quantity;
    }

    public void setQuantity(long quantity) {
        this.quantity = quantity;
    }
}
