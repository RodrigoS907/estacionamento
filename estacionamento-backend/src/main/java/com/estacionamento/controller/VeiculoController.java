package com.estacionamento.controller;

import com.estacionamento.dto.veiculo.VeiculoRequest;
import com.estacionamento.dto.veiculo.VeiculoResponse;
import com.estacionamento.service.VeiculoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/veiculos")
@RequiredArgsConstructor
public class VeiculoController {

    private final VeiculoService veiculoService;

    @GetMapping
    public List<VeiculoResponse> listar() {
        return veiculoService.listar().stream().map(VeiculoResponse::de).toList();
    }

    @GetMapping("/{id}")
    public VeiculoResponse buscar(@PathVariable Long id) {
        return VeiculoResponse.de(veiculoService.buscar(id));
    }

    @PostMapping
    public ResponseEntity<VeiculoResponse> criar(@Valid @RequestBody VeiculoRequest req) {
        return ResponseEntity.ok(VeiculoResponse.de(veiculoService.criar(req)));
    }

    @PutMapping("/{id}")
    public VeiculoResponse atualizar(@PathVariable Long id, @Valid @RequestBody VeiculoRequest req) {
        return VeiculoResponse.de(veiculoService.atualizar(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        veiculoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
