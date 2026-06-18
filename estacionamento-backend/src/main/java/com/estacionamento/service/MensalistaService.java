package com.estacionamento.service;

import com.estacionamento.dto.mensalista.MensalistaRequest;
import com.estacionamento.exception.BusinessException;
import com.estacionamento.exception.ResourceNotFoundException;
import com.estacionamento.model.Mensalista;
import com.estacionamento.repository.MensalistaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MensalistaService {

    private final MensalistaRepository mensalistaRepository;

    public List<Mensalista> listar() {
        return mensalistaRepository.findAll();
    }

    public Mensalista buscar(Long id) {
        return mensalistaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mensalista nao encontrado: " + id));
    }

    @Transactional
    public Mensalista criar(MensalistaRequest req) {
        if (mensalistaRepository.existsByCpfCnpj(req.cpfCnpj())) {
            throw new BusinessException("CPF/CNPJ ja cadastrado");
        }
        Mensalista m = Mensalista.builder()
                .nome(req.nome())
                .cpfCnpj(req.cpfCnpj())
                .telefone(req.telefone())
                .email(req.email())
                .dataInicio(req.dataInicio())
                .dataVencimento(req.dataVencimento())
                .valorMensalidade(req.valorMensalidade())
                .ativo(true)
                .build();
        return mensalistaRepository.save(m);
    }

    @Transactional
    public Mensalista atualizar(Long id, MensalistaRequest req) {
        Mensalista m = buscar(id);
        m.setNome(req.nome());
        m.setCpfCnpj(req.cpfCnpj());
        m.setTelefone(req.telefone());
        m.setEmail(req.email());
        m.setDataInicio(req.dataInicio());
        m.setDataVencimento(req.dataVencimento());
        m.setValorMensalidade(req.valorMensalidade());
        return mensalistaRepository.save(m);
    }

    @Transactional
    public void inativar(Long id) {
        Mensalista m = buscar(id);
        m.setAtivo(false);
        mensalistaRepository.save(m);
    }
}
