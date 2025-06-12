package com.faculdade.gestormax.repository;

import com.faculdade.gestormax.model.Estoque; // Importa a entidade Estoque do pacote correto
import com.faculdade.gestormax.model.Produto; // Importa a entidade Produto do pacote correto
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // Indica que esta interface é um componente de repositório Spring
public interface EstoqueRepository extends JpaRepository<Estoque, Long> {

    /**
     * Encontra um registro de Estoque pelo Produto associado.
     * Útil para verificar e manipular o estoque de um produto específico.
     * @param produto O objeto Produto para o qual buscar o estoque.
     * @return Um Optional contendo o Estoque encontrado, ou vazio se não houver.
     */
    Optional<Estoque> findByProduto(Produto produto);
}
