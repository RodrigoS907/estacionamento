package com.estacionamento.repository;

import com.estacionamento.model.RegistroAcesso;
import com.estacionamento.model.StatusAcesso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistroAcessoRepository extends JpaRepository<RegistroAcesso, Long> {
    List<RegistroAcesso> findByStatusOrderByDataHoraEntradaDesc(StatusAcesso status);
    List<RegistroAcesso> findAllByOrderByDataHoraEntradaDesc();
}
