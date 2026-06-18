package com.estacionamento.service;

import com.estacionamento.exception.BusinessException;
import com.estacionamento.exception.ResourceNotFoundException;
import com.estacionamento.model.*;
import com.estacionamento.repository.RegistroAcessoRepository;
import com.estacionamento.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistroAcessoService {

    private final RegistroAcessoRepository registroRepository;
    private final UsuarioRepository usuarioRepository;
    private final VeiculoService veiculoService;
    private final FileStorageService fileStorageService;
    private final TarifaService tarifaService;

    public List<RegistroAcesso> listarAbertos() {
        return registroRepository.findByStatusOrderByDataHoraEntradaDesc(StatusAcesso.ABERTO);
    }

    public List<RegistroAcesso> listarTodos() {
        return registroRepository.findAllByOrderByDataHoraEntradaDesc();
    }

    public RegistroAcesso buscar(Long id) {
        return registroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro nao encontrado: " + id));
    }

    @Transactional
    public RegistroAcesso registrarEntrada(String placa, MultipartFile foto) {
        if (placa == null || placa.isBlank()) {
            throw new BusinessException("Placa nao informada");
        }
        Veiculo veiculo = veiculoService.buscarOuCriarPorPlaca(placa);
        String fotoUrl = foto != null && !foto.isEmpty()
                ? fileStorageService.salvar(foto, "entrada")
                : null;
        RegistroAcesso registro = RegistroAcesso.builder()
                .placaDetectada(veiculo.getPlaca())
                .veiculo(veiculo)
                .dataHoraEntrada(LocalDateTime.now())
                .fotoEntradaUrl(fotoUrl)
                .status(StatusAcesso.ABERTO)
                .usuarioEntrada(usuarioLogado())
                .build();
        return registroRepository.save(registro);
    }

    @Transactional
    public RegistroAcesso registrarSaida(Long id, MultipartFile foto) {
        RegistroAcesso r = buscar(id);
        if (r.getStatus() == StatusAcesso.FECHADO) {
            throw new BusinessException("Registro ja esta fechado");
        }
        LocalDateTime agora = LocalDateTime.now();
        r.setDataHoraSaida(agora);
        if (foto != null && !foto.isEmpty()) {
            r.setFotoSaidaUrl(fileStorageService.salvar(foto, "saida"));
        }
        BigDecimal valor = (r.getVeiculo() != null && r.getVeiculo().isMensalista())
                ? BigDecimal.ZERO
                : tarifaService.calcular(r.getDataHoraEntrada(), agora);
        r.setValorCobrado(valor);
        r.setStatus(StatusAcesso.FECHADO);
        r.setUsuarioSaida(usuarioLogado());
        return registroRepository.save(r);
    }

    private Usuario usuarioLogado() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            return usuarioRepository.findByEmail(email).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }
}
