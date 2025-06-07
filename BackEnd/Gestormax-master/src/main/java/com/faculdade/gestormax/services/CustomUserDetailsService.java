package com.faculdade.gestormax.services;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Implemente sua lógica de busca de usuários aqui
        if ("user".equals(username)) {
            return User.builder()
                    .username("user")
                    .password(passwordEncoder().encode("password"))
                    .roles("USER")
                    .build();
        }
        throw new UsernameNotFoundException("Usuário não encontrado");
    }

    private PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
