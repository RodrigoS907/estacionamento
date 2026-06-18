package com.estacionamento.dto.acesso;

public record OcrResponse(
        String placa,
        String textoBruto,
        double confianca
) {}
