package com.faculdade.gestormax.repository;

import com.faculdade.gestormax.model.ItemMovimentacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemMovimentacaoRepository extends JpaRepository<ItemMovimentacao, Long> {
}
