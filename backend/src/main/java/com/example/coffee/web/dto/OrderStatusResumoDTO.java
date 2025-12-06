package com.example.coffee.web.dto;

public class OrderStatusResumoDTO {

    private long recebido;
    private long emPreparo;
    private long pronto;
    private long entregue;
    private long cancelado;

    public OrderStatusResumoDTO() {
    }

    public OrderStatusResumoDTO(long recebido,
            long emPreparo,
            long pronto,
            long entregue,
            long cancelado) {
        this.recebido = recebido;
        this.emPreparo = emPreparo;
        this.pronto = pronto;
        this.entregue = entregue;
        this.cancelado = cancelado;
    }

    public long getRecebido() {
        return recebido;
    }

    public void setRecebido(long recebido) {
        this.recebido = recebido;
    }

    public long getEmPreparo() {
        return emPreparo;
    }

    public void setEmPreparo(long emPreparo) {
        this.emPreparo = emPreparo;
    }

    public long getPronto() {
        return pronto;
    }

    public void setPronto(long pronto) {
        this.pronto = pronto;
    }

    public long getEntregue() {
        return entregue;
    }

    public void setEntregue(long entregue) {
        this.entregue = entregue;
    }

    public long getCancelado() {
        return cancelado;
    }

    public void setCancelado(long cancelado) {
        this.cancelado = cancelado;
    }
}
