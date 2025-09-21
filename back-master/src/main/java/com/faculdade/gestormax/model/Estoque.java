package com.faculdade.gestormax.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ESTOQUE")
@Data // Gera getters, setters, equals, hashCode, toString automaticamente
@NoArgsConstructor // Gera construtor sem argumentos, necessário para o JPA
public class Estoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremento da chave primária
    private Long idEstoque;

    @OneToOne(fetch = FetchType.LAZY) // Relacionamento um-para-um com Produto
    @JoinColumn(name = "id_produto", nullable = false, unique = true) // Chave estrangeira para PRODUTO, deve ser única
    private Produto produto; // Representa o produto associado a este registro de estoque

    @Column(name = "quantidade_atual", nullable = false)
    private Integer quantidadeAtual = 0; // Quantidade atual do produto em estoque, inicializada em 0

    @Column(name = "data_ultima_atualizacao")
    private LocalDateTime dataUltimaAtualizacao = LocalDateTime.now();
}
