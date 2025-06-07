package com.faculdade.gestormax.controller;

import com.faculdade.gestormax.model.Usuario;
import com.faculdade.gestormax.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("usuarios/")
public class UsuarioController {

    @Autowired
    UsuarioRepository usuarioRepositoryRepository;

    @GetMapping("/consultar")
    public List<Usuario> consultar() {
        return usuarioRepositoryRepository.findAll();
    }

    @PostMapping("/cadastrar")
    @ResponseStatus(HttpStatus.CREATED)
    public Usuario cadastrar(@RequestBody Usuario usuario) {
        return usuarioRepositoryRepository.save(usuario);
    }

    @GetMapping("/consulta/{id}")
    public ResponseEntity<Usuario> consultarPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioRepositoryRepository.findById(id);
        return usuario.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/editar/{id}")
    public <usuario> ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario usuarioAtualizado) {
        return usuarioRepositoryRepository.findById(id).map(usuario -> {
            usuario.setNomeUsuario(usuarioAtualizado.getNomeUsuario()); // Atualiza os campos necessários
            usuario.setNomeUsuario(usuarioAtualizado.getNomeUsuario());
            // adiciona outros campos conforme necessário
            Usuario atualizado = usuarioRepositoryRepository.save(usuario);
            return ResponseEntity.ok(atualizado);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Object> deletar(@PathVariable Long id) {
        return usuarioRepositoryRepository.findById(id).map(usuario -> {
            usuarioRepositoryRepository.delete(usuario);
            return ResponseEntity.noContent().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}