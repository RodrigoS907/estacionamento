package com.estacionamento.controller;

import com.estacionamento.dto.mensalista.MensalistaRequest;
import com.estacionamento.dto.mensalista.MensalistaResponse;
import com.estacionamento.service.MensalistaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mensalistas")
@RequiredArgsConstructor
public class MensalistaController {

    private final MensalistaService mensalistaService;

    @GetMapping
    public List<MensalistaResponse> listar() {
        return mensalistaService.listar().stream().map(MensalistaResponse::de).toList();
    }

    @GetMapping("/{id}")
    public MensalistaResponse buscar(@PathVariable Long id) {
        return MensalistaResponse.de(mensalistaService.buscar(id));
    }

    @PostMapping
    public ResponseEntity<MensalistaResponse> criar(@Valid @RequestBody MensalistaRequest req) {
        return ResponseEntity.ok(MensalistaResponse.de(mensalistaService.criar(req)));
    }

    @PutMapping("/{id}")
    public MensalistaResponse atualizar(@PathVariable Long id, @Valid @RequestBody MensalistaRequest req) {
        return MensalistaResponse.de(mensalistaService.atualizar(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        mensalistaService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
