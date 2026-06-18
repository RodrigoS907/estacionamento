package com.estacionamento.dto.veiculo;

import com.estacionamento.model.TipoVeiculo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VeiculoRequest(
        @NotBlank String placa,
        String marca,
        String modelo,
        String cor,
        @NotNull TipoVeiculo tipo,
        Long mensalistaId
) {}
