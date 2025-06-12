package com.faculdade.gestormax.service;

import com.faculdade.gestormax.model.Estoque; // Importa a entidade Estoque
import com.faculdade.gestormax.model.Produto; // Importa a entidade Produto
import com.faculdade.gestormax.repository.EstoqueRepository; // Importa o Repositório de Estoque
import com.faculdade.gestormax.repository.ProdutoRepository; // Importa o Repositório de Produto (necessário para buscar o Produto)
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service // Indica que esta classe é um componente de serviço Spring
public class EstoqueService {

    @Autowired // Injeta a dependência do EstoqueRepository
    private EstoqueRepository estoqueRepository;

    @Autowired // Injeta a dependência do ProdutoRepository para buscar produtos
    private ProdutoRepository produtoRepository;

    /**
     * Busca um registro de estoque pelo seu ID.
     * @param id O ID do registro de estoque.
     * @return Um Optional contendo o Estoque, ou vazio se não encontrado.
     */
    @Transactional(readOnly = true) // Otimiza para operações de apenas leitura
    public Optional<Estoque> buscarEstoquePorId(Long id) {
        return estoqueRepository.findById(id);
    }

    /**
     * Lista todos os registros de estoque existentes.
     * @return Uma lista de todos os objetos Estoque.
     */
    @Transactional(readOnly = true)
    public List<Estoque> listarTodosEstoques() {
        return estoqueRepository.findAll();
    }

    /**
     * Busca o registro de estoque para um produto específico.
     * @param idProduto O ID do produto.
     * @return Um Optional contendo o Estoque do produto, ou vazio se não encontrado.
     */
    @Transactional(readOnly = true)
    public Optional<Estoque> buscarEstoquePorProdutoId(Long idProduto) {
        Produto produto = produtoRepository.findById(idProduto)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + idProduto));
        return estoqueRepository.findByProduto(produto);
    }

    /**
     * Cria um novo registro de estoque para um produto.
     * Geralmente, um estoque é criado automaticamente quando um produto recebe sua primeira entrada.
     * @param idProduto O ID do produto para o qual criar o estoque.
     * @param quantidadeInicial A quantidade inicial (pode ser 0).
     * @return O objeto Estoque criado.
     * @throws RuntimeException se o produto não for encontrado ou já tiver estoque.
     */
    @Transactional
    public Estoque criarEstoque(Long idProduto, Integer quantidadeInicial) {
        Produto produto = produtoRepository.findById(idProduto)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + idProduto));

        if (estoqueRepository.findByProduto(produto).isPresent()) {
            throw new RuntimeException("Produto com ID: " + idProduto + " já possui um registro de estoque.");
        }

        Estoque novoEstoque = new Estoque();
        novoEstoque.setProduto(produto);
        novoEstoque.setQuantidadeAtual(quantidadeInicial != null ? quantidadeInicial : 0);
        return estoqueRepository.save(novoEstoque);
    }

    /**
     * Atualiza a quantidade de estoque para um produto específico (incrementa ou decrementa).
     * Este método seria chamado pelo MovimentacaoService para manter o estoque atualizado.
     * @param produto O objeto Produto cujo estoque será atualizado.
     * @param quantidade A quantidade a ser adicionada (para entradas) ou subtraída (para saídas).
     * @param tipoMovimentacao O tipo da movimentação ("entrada" ou "saida").
     * @return O objeto Estoque atualizado.
     * @throws RuntimeException se o estoque não for encontrado ou for insuficiente para uma saída.
     */
    @Transactional
    public Estoque atualizarQuantidadeEstoque(Produto produto, Integer quantidade, String tipoMovimentacao) {
        Estoque estoque = estoqueRepository.findByProduto(produto)
                .orElseThrow(() -> new RuntimeException("Estoque não encontrado para o produto: " + produto.getNome()));

        if ("entrada".equalsIgnoreCase(tipoMovimentacao)) {
            estoque.setQuantidadeAtual(estoque.getQuantidadeAtual() + quantidade);
        } else if ("saida".equalsIgnoreCase(tipoMovimentacao)) {
            if (estoque.getQuantidadeAtual() < quantidade) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome() + ". Quantidade disponível: " + estoque.getQuantidadeAtual() + ", solicitada: " + quantidade);
            }
            estoque.setQuantidadeAtual(estoque.getQuantidadeAtual() - quantidade);
        } else {
            throw new IllegalArgumentException("Tipo de movimentação inválido: " + tipoMovimentacao);
        }

        return estoqueRepository.save(estoque);
    }

    /**
     * Deleta um registro de estoque.
     * Cuidado ao usar, pois a exclusão de um estoque sem zerar a quantidade primeiro pode gerar inconsistência.
     * @param id O ID do registro de estoque a ser deletado.
     */
    @Transactional
    public void deletarEstoque(Long id) {
        Estoque estoque = estoqueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estoque não encontrado com ID: " + id));
        if (estoque.getQuantidadeAtual() > 0) {
            throw new RuntimeException("Não é possível deletar estoque com quantidade atual maior que zero. Zere o estoque primeiro.");
        }
        estoqueRepository.delete(estoque);
    }
}