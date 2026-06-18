package com.estacionamento.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class TarifaService {

    @Value("${app.tarifa.valor-por-hora}")
    private BigDecimal valorPorHora;

    @Value("${app.tarifa.tolerancia-minutos}")
    private int toleranciaMinutos;

    public BigDecimal calcular(LocalDateTime entrada, LocalDateTime saida) {
        if (entrada == null || saida == null) return BigDecimal.ZERO;
        long minutos = Duration.between(entrada, saida).toMinutes();
        if (minutos <= toleranciaMinutos) return BigDecimal.ZERO;
        BigDecimal horas = BigDecimal.valueOf(minutos)
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.UP);
        BigDecimal horasArredondadas = horas.setScale(0, RoundingMode.UP);
        return valorPorHora.multiply(horasArredondadas).setScale(2, RoundingMode.HALF_UP);
    }
}
