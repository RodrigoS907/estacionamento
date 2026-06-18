package com.estacionamento.service;

import com.estacionamento.exception.BusinessException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    private Path basePath;

    @PostConstruct
    public void init() throws IOException {
        this.basePath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(basePath);
    }

    public String salvar(MultipartFile arquivo, String prefixo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new BusinessException("Arquivo vazio");
        }
        String original = arquivo.getOriginalFilename();
        String ext = "";
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf('.'));
        }
        String nome = prefixo + "_" + UUID.randomUUID() + ext;
        Path destino = basePath.resolve(nome);
        try {
            Files.copy(arquivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new BusinessException("Erro ao salvar arquivo: " + e.getMessage());
        }
        return "/uploads/" + nome;
    }

    public Path resolverCaminho(String urlRelativa) {
        String nome = urlRelativa.replaceFirst("^/uploads/", "");
        return basePath.resolve(nome);
    }
}
