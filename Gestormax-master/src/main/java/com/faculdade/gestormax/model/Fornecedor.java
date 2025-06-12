package com.faculdade.gestormax.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Fornecedor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_fornecedor;

    private String nome;
    private String cnpj;
    private String endereco;
    private String telefone;

    @OneToMany(mappedBy = "fornecedor")
    private List<Movimentacao> movimentacoes;
}
