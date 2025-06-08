package com.faculdade.gestormax.controller;

import com.faculdade.gestormax.model.Produto;
import com.faculdade.gestormax.repository.ClienteRepository;
import com.faculdade.gestormax.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    ProdutoRepository produtoRepositoryRepository;

    @GetMapping("/consultar")
    public List<Produto> getAll() {
        return produtoRepositoryRepository.findAll();
    }

    @GetMapping("/consultar/{id}")
    public Produto getById(@PathVariable Long id) {
        return produtoRepositoryRepository.findById(id).orElse(null);
    }

    @PostMapping("/cadastrar")
    public Produto create(@RequestBody Produto produto) {
        return produtoRepositoryRepository.save(produto);
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<Produto> update(@PathVariable Long id, @RequestBody Produto produto) {
        return produtoRepositoryRepository.findById(id)
                .map(produtoExistente -> {
                    produto.setId_produto(id);
                    Produto atualizado = produtoRepositoryRepository.save(produto);
                    return ResponseEntity.ok(atualizado);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Object> deletar(@PathVariable Long id) {
        return produtoRepositoryRepository.findById(id).map(produto -> {
            produtoRepositoryRepository.delete(produto);
            return ResponseEntity.noContent().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
