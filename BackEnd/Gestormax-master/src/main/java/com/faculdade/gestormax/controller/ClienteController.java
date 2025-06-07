package com.faculdade.gestormax.controller;

import com.faculdade.gestormax.model.Cliente;
import com.faculdade.gestormax.repository.ClienteRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    ClienteRepository clienteRepositoryRepository;

    @GetMapping("/consultar")
    public List<Cliente> consultar() {
        return clienteRepositoryRepository.findAll();
    }

    @PostMapping("/cadastrar")
    @ResponseStatus(HttpStatus.CREATED)
    public Cliente cadastrar(@RequestBody Cliente cliente) {
        return clienteRepositoryRepository.save(cliente);
    }

    @GetMapping("/consulta/{id}")
    public ResponseEntity<Cliente> consultarPorId(@PathVariable Long id) {
        Optional<Cliente> cliente = clienteRepositoryRepository.findById(id);
        return cliente.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<Cliente> atualizar(@PathVariable Long id, @RequestBody Cliente clienteAtualizado) {
        return clienteRepositoryRepository.findById(id).map(cliente -> {
            cliente.setNome(clienteAtualizado.getNome()); // Atualiza os campos necessários
            cliente.setNome(clienteAtualizado.getNome());
            // adiciona outros campos conforme necessário
            Cliente atualizado = clienteRepositoryRepository.save(cliente);
            return ResponseEntity.ok(atualizado);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Object> deletar(@PathVariable Long id) {
        return clienteRepositoryRepository.findById(id).map(cliente -> {
            clienteRepositoryRepository.delete(cliente);
            return ResponseEntity.noContent().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}