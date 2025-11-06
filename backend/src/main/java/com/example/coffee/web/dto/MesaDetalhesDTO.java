package com.example.coffee.web.dto;

import java.math.BigDecimal;
import java.util.List;

public class MesaDetalhesDTO {
    private Integer numeroMesa;
    private List<ProdutoMesaDTO> produtos;
    private BigDecimal total;

    // Construtor
    public MesaDetalhesDTO(Integer numeroMesa, List<ProdutoMesaDTO> produtos, BigDecimal total) {
        this.numeroMesa = numeroMesa;
        this.produtos = produtos;
        this.total = total;
    }

    // Getters e Setters
    public Integer getNumeroMesa() {
        return numeroMesa;
    }

    public void setNumeroMesa(Integer numeroMesa) {
        this.numeroMesa = numeroMesa;
    }

    public List<ProdutoMesaDTO> getProdutos() {
        return produtos;
    }

    public void setProdutos(List<ProdutoMesaDTO> produtos) {
        this.produtos = produtos;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}