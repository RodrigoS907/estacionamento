package com.estacionamento.dto.veiculo;

import com.estacionamento.model.TipoVeiculo;
import com.estacionamento.model.Veiculo;

public record VeiculoResponse(
        Long id,
        String placa,
        String marca,
        String modelo,
        String cor,
        TipoVeiculo tipo,
        String fotoUrl,
        Long mensalistaId,
        String mensalistaNome,
        boolean mensalista
) {
    public static VeiculoResponse de(Veiculo v) {
        return new VeiculoResponse(
                v.getId(),
                v.getPlaca(),
                v.getMarca(),
                v.getModelo(),
                v.getCor(),
                v.getTipo(),
                v.getFotoUrl(),
                v.getMensalista() != null ? v.getMensalista().getId() : null,
                v.getMensalista() != null ? v.getMensalista().getNome() : null,
                v.isMensalista()
        );
    }
}
