package com.faculdade.gestormax.controller;

import com.faculdade.gestormax.model.Cliente;
import com.faculdade.gestormax.model.Fornecedor;
import com.faculdade.gestormax.model.Produto;
import com.faculdade.gestormax.repository.ClienteRepository;
import com.faculdade.gestormax.repository.FornecedorRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/fornecedores")
public class FornecedorController {

    @Autowired
    FornecedorRepository fornecedorRepository;

    @GetMapping("/consultar")
    public List<Fornecedor> consultar() {
        return fornecedorRepository.findAll();
    }

    @PostMapping("/cadastrar")
    @ResponseStatus(HttpStatus.CREATED)
    public Fornecedor cadastrar(@RequestBody Fornecedor fornecedor) {
        return fornecedorRepository.save(fornecedor);
    }

    @GetMapping("/consulta/{id}")
    public ResponseEntity<Fornecedor> consultarPorId(@PathVariable Long id) {
        Optional<Fornecedor> fornecedor = fornecedorRepository.findById(id);
        return fornecedor.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<Fornecedor> update(@PathVariable Long id, @RequestBody Fornecedor fornecedor) {
        return fornecedorRepository.findById(id)
                .map(fornecedorExistente -> {
                    fornecedor.setId_fornecedor(id);
                    Fornecedor atualizado = fornecedorRepository.save(fornecedor);
                    return ResponseEntity.ok(atualizado);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Object> deletar(@PathVariable Long id) {
        return fornecedorRepository.findById(id).map(fornecedor -> {
            fornecedorRepository.delete(fornecedor);
            return ResponseEntity.noContent().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}

