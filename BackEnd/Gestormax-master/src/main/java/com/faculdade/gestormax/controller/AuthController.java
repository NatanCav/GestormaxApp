package com.faculdade.gestormax.controller;

import com.faculdade.gestormax.model.Usuario;
import com.faculdade.gestormax.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> dadosLogin) {
        String email = dadosLogin.get("email");
        String senha = dadosLogin.get("senha");

        return usuarioRepository.findByEmailAndSenha(email, senha)
                .map(usuario -> ResponseEntity.ok("Login realizado com sucesso"))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos"));
    }
}
