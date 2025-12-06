package com.example.coffee.web.dto;

import java.math.BigDecimal;

public class PaymentResumoDTO {

    private long pendente;
    private long dinheiro;
    private long cartao;
    private long pix;

    private BigDecimal totalDinheiro;
    private BigDecimal totalCartao;
    private BigDecimal totalPix;
    private BigDecimal totalGeral;

    public PaymentResumoDTO() {
    }

    public PaymentResumoDTO(long pendente,
            long dinheiro,
            long cartao,
            long pix,
            BigDecimal totalDinheiro,
            BigDecimal totalCartao,
            BigDecimal totalPix,
            BigDecimal totalGeral) {
        this.pendente = pendente;
        this.dinheiro = dinheiro;
        this.cartao = cartao;
        this.pix = pix;
        this.totalDinheiro = totalDinheiro;
        this.totalCartao = totalCartao;
        this.totalPix = totalPix;
        this.totalGeral = totalGeral;
    }

    public long getPendente() {
        return pendente;
    }

    public void setPendente(long pendente) {
        this.pendente = pendente;
    }

    public long getDinheiro() {
        return dinheiro;
    }

    public void setDinheiro(long dinheiro) {
        this.dinheiro = dinheiro;
    }

    public long getCartao() {
        return cartao;
    }

    public void setCartao(long cartao) {
        this.cartao = cartao;
    }

    public long getPix() {
        return pix;
    }

    public void setPix(long pix) {
        this.pix = pix;
    }

    public BigDecimal getTotalDinheiro() {
        return totalDinheiro;
    }

    public void setTotalDinheiro(BigDecimal totalDinheiro) {
        this.totalDinheiro = totalDinheiro;
    }

    public BigDecimal getTotalCartao() {
        return totalCartao;
    }

    public void setTotalCartao(BigDecimal totalCartao) {
        this.totalCartao = totalCartao;
    }

    public BigDecimal getTotalPix() {
        return totalPix;
    }

    public void setTotalPix(BigDecimal totalPix) {
        this.totalPix = totalPix;
    }

    public BigDecimal getTotalGeral() {
        return totalGeral;
    }

    public void setTotalGeral(BigDecimal totalGeral) {
        this.totalGeral = totalGeral;
    }
}
