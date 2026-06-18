package com.estacionamento.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "registros_acesso")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RegistroAcesso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "placa_detectada", nullable = false)
    private String placaDetectada;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "veiculo_id")
    private Veiculo veiculo;

    @Column(name = "data_hora_entrada", nullable = false)
    private LocalDateTime dataHoraEntrada;

    @Column(name = "data_hora_saida")
    private LocalDateTime dataHoraSaida;

    @Column(name = "foto_entrada_url")
    private String fotoEntradaUrl;

    @Column(name = "foto_saida_url")
    private String fotoSaidaUrl;

    @Column(name = "valor_cobrado", precision = 10, scale = 2)
    private BigDecimal valorCobrado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAcesso status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_entrada_id")
    private Usuario usuarioEntrada;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_saida_id")
    private Usuario usuarioSaida;
}
