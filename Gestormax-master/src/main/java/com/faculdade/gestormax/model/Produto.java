package com.faculdade.gestormax.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Data
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_produto;

    private String nome;
    private String descricao;
    private String tamanho;
    private String cor;
    private BigDecimal valorCompra;
    private BigDecimal valorVenda;

    @OneToMany(mappedBy = "produto")
    private List<ItemMovimentacao> itens;
}
