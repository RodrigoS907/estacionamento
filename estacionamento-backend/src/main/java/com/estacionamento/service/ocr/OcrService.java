package com.estacionamento.service.ocr;

import com.estacionamento.dto.acesso.OcrResponse;

public interface OcrService {
    OcrResponse reconhecerPlaca(byte[] imagemBytes);
}
