package com.estacionamento.service;

import com.estacionamento.dto.auth.CriarUsuarioRequest;
import com.estacionamento.dto.auth.LoginRequest;
import com.estacionamento.dto.auth.LoginResponse;
import com.estacionamento.exception.BusinessException;
import com.estacionamento.model.Usuario;
import com.estacionamento.repository.UsuarioRepository;
import com.estacionamento.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.senha())
        );
        Usuario u = usuarioRepository.findByEmail(req.email())
                .orElseThrow(() -> new BusinessException("Usuario nao encontrado"));
        String token = jwtUtil.gerarToken(u.getEmail(), u.getPapel().name());
        return new LoginResponse(token, u.getNome(), u.getEmail(), u.getPapel().name());
    }

    @Transactional
    public Usuario criarUsuario(CriarUsuarioRequest req) {
        if (usuarioRepository.existsByEmail(req.email())) {
            throw new BusinessException("Email ja cadastrado");
        }
        Usuario u = Usuario.builder()
                .nome(req.nome())
                .email(req.email())
                .senhaHash(passwordEncoder.encode(req.senha()))
                .papel(req.papel())
                .ativo(true)
                .build();
        return usuarioRepository.save(u);
    }
}
