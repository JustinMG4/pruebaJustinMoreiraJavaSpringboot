package com.justinmoreira.prueba.modules.clients.services;

import com.justinmoreira.prueba.application.exceptions.AppException;
import com.justinmoreira.prueba.modules.clients.dto.request.RegisterClientDto;
import com.justinmoreira.prueba.modules.clients.dto.request.UpdateClient;
import com.justinmoreira.prueba.modules.clients.dto.response.ClientDto;
import com.justinmoreira.prueba.modules.clients.models.Client;
import com.justinmoreira.prueba.modules.clients.models.enums.ClientStatus;
import com.justinmoreira.prueba.modules.clients.repositories.ClientRepository;
import com.justinmoreira.prueba.modules.clients.services.mappers.ClientMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Validated
public class ClientService {
    private final ClientRepository repository;
    private final ClientMapper mapper;

    @Transactional
    public ClientDto create(@Valid RegisterClientDto dto) {
        existByIdentificationNumber(dto.identificationNumber());
        checkAge(dto.age());
        String hashedPassword = BCrypt.hashpw(dto.password(), BCrypt.gensalt());
        Client saved = repository.save(mapper.toEntity(dto, hashedPassword));
        return mapper.toDto(saved);

    }

    public Boolean validatePassword(String rawPassword, UUID clientId) {
        Client client = findEntityById(clientId);
        if (!BCrypt.checkpw(rawPassword, client.getPassword())) {
            throw new AppException("Contraseña incorrecta", HttpStatus.UNAUTHORIZED);
        }
        return true;
    }

    private void existByIdentificationNumber(String identificationNumber) {
        if (repository.existsByIdentificationNumber(identificationNumber)) {
            throw new AppException("Ya existe un cliente con ese número de identificación", HttpStatus.BAD_REQUEST);
        }
    }

    private void checkAge(Integer age) {
        if (age <= 16) {
            throw new AppException("El cliente debe tener 16 años o más", HttpStatus.BAD_REQUEST);
        }
    }

    public List<ClientDto>findAll(ClientStatus status) {
        return repository.findByStatus(status).stream()
                .map(mapper::toDto)
                .toList();
    }

    public ClientDto findById(UUID id) {
        Client client = repository.findById(id)
                .orElseThrow(() -> new AppException("Cliente no encontrado", HttpStatus.NOT_FOUND));
        return mapper.toDto(client);
    }

    @Transactional
    public void updateClient(UUID id, UpdateClient dto) {
        Client client = findEntityById(id);
        if (!client.getIdentificationNumber().equals(dto.identificationNumber())) {
            existByIdentificationNumber(dto.identificationNumber());
        }
        mapper.updateEntity(client, dto);
        repository.save(client);

    }

    @Transactional
    public void deleteClient(UUID id) {
        Client client = findEntityById(id);
        client.setStatus(ClientStatus.INACTIVE);
        repository.save(client);
    }

    @Transactional
    public void changeStatus(UUID id, ClientStatus status) {
        if (status.equals(ClientStatus.INACTIVE)) {
            throw new AppException("No se puede cambiar el estado a INACTIVE usando este método. Use borrar cliente para eso.", HttpStatus.BAD_REQUEST);
        }
        Client client = repository.findById(id)
                .orElseThrow(() -> new AppException("Cliente no encontrado", HttpStatus.NOT_FOUND));
        client.setStatus(status);
        repository.save(client);
    }

    public Client findEntityById(UUID id) {
        return repository.findByIdAndStatus(id, ClientStatus.ACTIVE)
                .orElseThrow(() -> new AppException("Cliente no encontrado o inactivo", HttpStatus.NOT_FOUND));
    }


}
