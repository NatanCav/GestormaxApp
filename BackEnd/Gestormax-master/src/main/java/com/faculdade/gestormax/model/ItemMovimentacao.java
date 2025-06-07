package com.faculdade.gestormax.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ItemMovimentacao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_item_movimentacao;

    @ManyToOne
    private Movimentacao movimentacao;

    @ManyToOne
    private Produto produto;

    private Integer quantidade;
}
