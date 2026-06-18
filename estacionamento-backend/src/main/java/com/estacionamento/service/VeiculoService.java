package com.estacionamento.service;

import com.estacionamento.dto.veiculo.VeiculoRequest;
import com.estacionamento.exception.BusinessException;
import com.estacionamento.exception.ResourceNotFoundException;
import com.estacionamento.model.Mensalista;
import com.estacionamento.model.TipoVeiculo;
import com.estacionamento.model.Veiculo;
import com.estacionamento.repository.MensalistaRepository;
import com.estacionamento.repository.VeiculoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;
    private final MensalistaRepository mensalistaRepository;

    public List<Veiculo> listar() {
        return veiculoRepository.findAll();
    }

    public Veiculo buscar(Long id) {
        return veiculoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veiculo nao encontrado: " + id));
    }

    @Transactional
    public Veiculo criar(VeiculoRequest req) {
        String placa = req.placa().toUpperCase().replaceAll("\\s|-", "");
        if (veiculoRepository.existsByPlacaIgnoreCase(placa)) {
            throw new BusinessException("Placa ja cadastrada: " + placa);
        }
        Mensalista m = req.mensalistaId() != null
                ? mensalistaRepository.findById(req.mensalistaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Mensalista nao encontrado"))
                : null;
        Veiculo v = Veiculo.builder()
                .placa(placa)
                .marca(req.marca())
                .modelo(req.modelo())
                .cor(req.cor())
                .tipo(req.tipo())
                .mensalista(m)
                .build();
        return veiculoRepository.save(v);
    }

    @Transactional
    public Veiculo atualizar(Long id, VeiculoRequest req) {
        Veiculo v = buscar(id);
        String placa = req.placa().toUpperCase().replaceAll("\\s|-", "");
        if (!v.getPlaca().equalsIgnoreCase(placa) && veiculoRepository.existsByPlacaIgnoreCase(placa)) {
            throw new BusinessException("Placa ja cadastrada: " + placa);
        }
        Mensalista m = req.mensalistaId() != null
                ? mensalistaRepository.findById(req.mensalistaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Mensalista nao encontrado"))
                : null;
        v.setPlaca(placa);
        v.setMarca(req.marca());
        v.setModelo(req.modelo());
        v.setCor(req.cor());
        v.setTipo(req.tipo());
        v.setMensalista(m);
        return veiculoRepository.save(v);
    }

    @Transactional
    public void excluir(Long id) {
        Veiculo v = buscar(id);
        veiculoRepository.delete(v);
    }

    @Transactional
    public Veiculo buscarOuCriarPorPlaca(String placa) {
        String normalizada = placa.toUpperCase().replaceAll("\\s|-", "");
        return veiculoRepository.findByPlacaIgnoreCase(normalizada)
                .orElseGet(() -> veiculoRepository.save(
                        Veiculo.builder()
                                .placa(normalizada)
                                .tipo(TipoVeiculo.CARRO)
                                .build()
                ));
    }
}
