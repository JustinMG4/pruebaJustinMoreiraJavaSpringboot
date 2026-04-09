package com.justinmoreira.prueba.modules.clients.repositories;

import com.justinmoreira.prueba.modules.clients.models.Client;
import com.justinmoreira.prueba.modules.clients.models.enums.ClientStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClientRepository extends JpaRepository<Client, UUID> {
    boolean existsByIdentificationNumber(String identificationNumber);

    List<Client> findByStatus(ClientStatus status);

    Optional<Client> findByIdAndStatus(UUID id, ClientStatus status);

}
