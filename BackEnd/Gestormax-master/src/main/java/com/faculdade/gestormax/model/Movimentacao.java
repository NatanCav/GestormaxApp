package com.faculdade.gestormax.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Movimentacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id_movimentacao;

    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    private TipoMovimentacao tipo;

    @ManyToOne
    private Usuario usuario;

    @ManyToOne
    private Cliente cliente;

    @ManyToOne
    private Fornecedor fornecedor;

    @OneToMany(mappedBy = "movimentacao", cascade = CascadeType.ALL)
    private List<ItemMovimentacao> itens;
}
