package com.estacionamento.controller;

import com.estacionamento.dto.acesso.OcrResponse;
import com.estacionamento.dto.acesso.RegistroAcessoResponse;
import com.estacionamento.exception.BusinessException;
import com.estacionamento.service.RegistroAcessoService;
import com.estacionamento.service.ocr.OcrService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/acessos")
@RequiredArgsConstructor
public class RegistroAcessoController {

    private final RegistroAcessoService acessoService;
    private final OcrService ocrService;

    @GetMapping
    public List<RegistroAcessoResponse> listar(@RequestParam(defaultValue = "false") boolean abertos) {
        return (abertos ? acessoService.listarAbertos() : acessoService.listarTodos())
                .stream().map(RegistroAcessoResponse::de).toList();
    }

    @GetMapping("/{id}")
    public RegistroAcessoResponse buscar(@PathVariable Long id) {
        return RegistroAcessoResponse.de(acessoService.buscar(id));
    }

    @PostMapping(value = "/entrada", consumes = "multipart/form-data")
    public ResponseEntity<RegistroAcessoResponse> entrada(
            @RequestParam(required = false) String placa,
            @RequestParam(required = false) MultipartFile foto
    ) throws IOException {
        String placaFinal = placa;
        if ((placaFinal == null || placaFinal.isBlank()) && foto != null && !foto.isEmpty()) {
            OcrResponse ocr = ocrService.reconhecerPlaca(foto.getBytes());
            placaFinal = ocr.placa();
            if (placaFinal == null) {
                throw new BusinessException("Nao foi possivel identificar a placa na foto");
            }
        }
        return ResponseEntity.ok(RegistroAcessoResponse.de(
                acessoService.registrarEntrada(placaFinal, foto)
        ));
    }

    @PostMapping(value = "/{id}/saida", consumes = "multipart/form-data")
    public RegistroAcessoResponse saida(
            @PathVariable Long id,
            @RequestParam(required = false) MultipartFile foto
    ) {
        return RegistroAcessoResponse.de(acessoService.registrarSaida(id, foto));
    }
}
