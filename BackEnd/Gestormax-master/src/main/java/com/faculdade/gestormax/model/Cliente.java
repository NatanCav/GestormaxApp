package com.faculdade.gestormax.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Cliente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_cliente;

    private String nome;
    private String cpf;
    private String endereco;
    private String telefone;

    @OneToMany(mappedBy = "cliente")
    private List<Movimentacao> movimentacoes;
}
