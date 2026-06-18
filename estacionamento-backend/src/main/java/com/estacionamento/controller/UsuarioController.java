package com.estacionamento.controller;

import com.estacionamento.dto.auth.CriarUsuarioRequest;
import com.estacionamento.model.Usuario;
import com.estacionamento.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final AuthService authService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> criar(@Valid @RequestBody CriarUsuarioRequest req) {
        Usuario u = authService.criarUsuario(req);
        return ResponseEntity.ok(Map.of(
                "id", u.getId(),
                "nome", u.getNome(),
                "email", u.getEmail(),
                "papel", u.getPapel().name()
        ));
    }
}
