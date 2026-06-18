package com.estacionamento.controller;

import com.estacionamento.dto.acesso.OcrResponse;
import com.estacionamento.service.ocr.OcrService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/ocr")
@RequiredArgsConstructor
public class OcrController {

    private final OcrService ocrService;

    @PostMapping(value = "/reconhecer", consumes = "multipart/form-data")
    public OcrResponse reconhecer(@RequestParam MultipartFile foto) throws IOException {
        return ocrService.reconhecerPlaca(foto.getBytes());
    }
}
