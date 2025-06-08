package com.faculdade.gestormax.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Aplica a todos os endpoints da sua API
                        .allowedOrigins("http://localhost:8081", "http://192.168.0.6:8081") // Origens permitidas
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos HTTP permitidos
                        .allowedHeaders("*") // Permite todos os cabeçalhos
                        .allowCredentials(true) // Permite o envio de credenciais (cookies, etc.)
                        .maxAge(3600); // Cache da resposta de pré-vôo por 1 hora (3600 segundos)
            }
        };
    }
}
