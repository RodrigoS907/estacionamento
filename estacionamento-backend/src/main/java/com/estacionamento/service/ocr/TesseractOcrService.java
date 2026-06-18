package com.estacionamento.service.ocr;

import com.estacionamento.dto.acesso.OcrResponse;
import com.estacionamento.exception.BusinessException;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Implementacao baseada em Tesseract puro.
 *
 * NOTA IMPORTANTE: Tesseract nao foi feito para detectar placas em fotos abertas.
 * Sem uma etapa previa de deteccao da regiao da placa (recortar o retangulo da placa
 * antes do OCR), a precisao em fotos de celular sera baixa. Para producao seria recomendado:
 *  - OpenALPR (open source, especifico para placas)
 *  - Google Cloud Vision API
 *  - AWS Rekognition (DetectText)
 *  - Plate Recognizer (servico SaaS de ALPR)
 *
 * Esta versao serve para fins de estudo/portfolio: faz um pre-processamento simples
 * (grayscale) e extrai sequencias que casam com o padrao de placa brasileira.
 */
@Service
public class TesseractOcrService implements OcrService {

    private static final Pattern PADRAO_MERCOSUL = Pattern.compile("[A-Z]{3}[0-9][A-Z][0-9]{2}");
    private static final Pattern PADRAO_ANTIGO   = Pattern.compile("[A-Z]{3}[0-9]{4}");

    @Value("${app.ocr.tessdata-path}")
    private String tessdataPath;

    @Value("${app.ocr.idioma}")
    private String idioma;

    @Override
    public OcrResponse reconhecerPlaca(byte[] imagemBytes) {
        try {
            BufferedImage imagem = ImageIO.read(new ByteArrayInputStream(imagemBytes));
            if (imagem == null) throw new BusinessException("Nao foi possivel ler a imagem");

            BufferedImage processada = preprocessar(imagem);

            Tesseract tesseract = new Tesseract();
            tesseract.setDatapath(tessdataPath);
            tesseract.setLanguage(idioma);
            tesseract.setVariable("tessedit_char_whitelist",
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
            tesseract.setPageSegMode(7);

            String texto = tesseract.doOCR(processada);
            String normalizado = texto.toUpperCase().replaceAll("[^A-Z0-9]", "");

            String placa = extrairPlaca(normalizado);
            double confianca = placa != null ? 0.7 : 0.0;

            return new OcrResponse(placa, texto.trim(), confianca);
        } catch (Exception e) {
            throw new BusinessException("Erro no OCR: " + e.getMessage());
        }
    }

    private String extrairPlaca(String texto) {
        Matcher m1 = PADRAO_MERCOSUL.matcher(texto);
        if (m1.find()) return m1.group();
        Matcher m2 = PADRAO_ANTIGO.matcher(texto);
        if (m2.find()) return m2.group();
        return null;
    }

    private BufferedImage preprocessar(BufferedImage original) {
        int w = original.getWidth();
        int h = original.getHeight();
        BufferedImage gray = new BufferedImage(w, h, BufferedImage.TYPE_BYTE_GRAY);
        Graphics2D g = gray.createGraphics();
        g.drawImage(original, 0, 0, null);
        g.dispose();
        return gray;
    }
}
