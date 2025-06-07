package com.faculdade.gestormax.model;

import java.util.List;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_Usuario;

    private String nomeUsuario;
    private String senha;
    private String email;

    @OneToMany(mappedBy = "usuario")
    private List<Movimentacao>movimentacoes;
}
