package com.estacionamento.dto.mensalista;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MensalistaRequest(
        @NotBlank String nome,
        @NotBlank String cpfCnpj,
        String telefone,
        String email,
        LocalDate dataInicio,
        LocalDate dataVencimento,
        BigDecimal valorMensalidade
) {}
