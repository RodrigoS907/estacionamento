package com.estacionamento.security;

import com.estacionamento.model.Usuario;
import com.estacionamento.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario u = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado: " + email));
        if (!u.isAtivo()) {
            throw new UsernameNotFoundException("Usuario inativo: " + email);
        }
        return new User(
                u.getEmail(),
                u.getSenhaHash(),
                List.of(new SimpleGrantedAuthority("ROLE_" + u.getPapel().name()))
        );
    }
}
