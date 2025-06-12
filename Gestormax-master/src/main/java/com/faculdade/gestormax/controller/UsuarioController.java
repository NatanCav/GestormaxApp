package com.faculdade.gestormax.controller;

import com.faculdade.gestormax.model.Usuario;
import com.faculdade.gestormax.repository.UsuarioRepository;
import lombok.Data;
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
    UsuarioRepository usuarioRepository;

    @GetMapping("/consultar")
    public List<Usuario> consultar() {
        return usuarioRepository.findAll();
    }

    @PostMapping("/cadastrar")
    @ResponseStatus(HttpStatus.CREATED)
    public Usuario cadastrar(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @GetMapping("/consulta/{id}")
    public ResponseEntity<Usuario> consultarPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario usuarioAtualizado) {
        return usuarioRepository.findById(id).map(usuarioExistente -> {
            // --- AQUI ESTÃO AS ATUALIZAÇÕES DOS ATRIBUTOS ---
            // 1. Atualiza o nome do usuário
            usuarioExistente.setNomeUsuario(usuarioAtualizado.getNomeUsuario());

            // 2. Atualiza o email do usuário
            usuarioExistente.setEmail(usuarioAtualizado.getEmail());

            // 3. Atualiza a senha do usuário
            // ATENÇÃO: Esta é uma área crítica de segurança!
            // Em uma aplicação real, você NUNCA deve salvar a senha diretamente como vem da requisição.
            // Você DEVE aplicar um algoritmo de hash (ex: BCrypt) antes de salvar a senha.
            // Além disso, é comum verificar se a nova senha não é nula ou vazia antes de atualizar.
            if (usuarioAtualizado.getSenha() != null && !usuarioAtualizado.getSenha().isEmpty()) {
                // TODO: Criptografe a senha aqui (ex: com BCryptPasswordEncoder.encode()) antes de setar!
                usuarioExistente.setSenha(usuarioAtualizado.getSenha());
            }

            // O 'id_Usuario' não precisa ser setado novamente, pois 'usuarioExistente' já possui o ID correto
            // que foi usado para buscá-lo do banco de dados, e o método .save() fará um UPDATE.

            // 4. Salva o objeto 'usuarioExistente' (agora com os dados atualizados) no banco de dados.
            Usuario atualizado = usuarioRepository.save(usuarioExistente);

            // 5. Retorna uma resposta HTTP 200 OK com o usuário atualizado no corpo.
            return ResponseEntity.ok(atualizado);
        }).orElseGet(() -> {
            // Se o usuário com o ID fornecido não for encontrado no banco de dados,
            // retorna uma resposta HTTP 404 Not Found.
            return ResponseEntity.notFound().build();
        });
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Object> deletar(@PathVariable Long id) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuarioRepository.delete(usuario);
            return ResponseEntity.noContent().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}