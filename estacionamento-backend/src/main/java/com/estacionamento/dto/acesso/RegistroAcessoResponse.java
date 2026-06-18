package com.estacionamento.dto.acesso;

import com.estacionamento.model.RegistroAcesso;
import com.estacionamento.model.StatusAcesso;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RegistroAcessoResponse(
        Long id,
        String placaDetectada,
        Long veiculoId,
        String modeloVeiculo,
        boolean mensalista,
        LocalDateTime dataHoraEntrada,
        LocalDateTime dataHoraSaida,
        String fotoEntradaUrl,
        String fotoSaidaUrl,
        BigDecimal valorCobrado,
        StatusAcesso status
) {
    public static RegistroAcessoResponse de(RegistroAcesso r) {
        return new RegistroAcessoResponse(
                r.getId(),
                r.getPlacaDetectada(),
                r.getVeiculo() != null ? r.getVeiculo().getId() : null,
                r.getVeiculo() != null ? (r.getVeiculo().getMarca() + " " + r.getVeiculo().getModelo()).trim() : null,
                r.getVeiculo() != null && r.getVeiculo().isMensalista(),
                r.getDataHoraEntrada(),
                r.getDataHoraSaida(),
                r.getFotoEntradaUrl(),
                r.getFotoSaidaUrl(),
                r.getValorCobrado(),
                r.getStatus()
        );
    }
}
