package com.estacionamento.dto.mensalista;

import com.estacionamento.model.Mensalista;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public record MensalistaResponse(
        Long id,
        String nome,
        String cpfCnpj,
        String telefone,
        String email,
        LocalDate dataInicio,
        LocalDate dataVencimento,
        BigDecimal valorMensalidade,
        boolean ativo,
        List<String> placasVeiculos
) {
    public static MensalistaResponse de(Mensalista m) {
        List<String> placas = m.getVeiculos() == null ? List.of() :
                m.getVeiculos().stream().map(v -> v.getPlaca()).collect(Collectors.toList());
        return new MensalistaResponse(
                m.getId(),
                m.getNome(),
                m.getCpfCnpj(),
                m.getTelefone(),
                m.getEmail(),
                m.getDataInicio(),
                m.getDataVencimento(),
                m.getValorMensalidade(),
                m.isAtivo(),
                placas
        );
    }
}
