package com.estacionamento.repository;

import com.estacionamento.model.Mensalista;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MensalistaRepository extends JpaRepository<Mensalista, Long> {
    boolean existsByCpfCnpj(String cpfCnpj);
}
