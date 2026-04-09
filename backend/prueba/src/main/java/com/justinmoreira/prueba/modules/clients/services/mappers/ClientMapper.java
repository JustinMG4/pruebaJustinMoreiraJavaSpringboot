package com.justinmoreira.prueba.modules.clients.services.mappers;

import com.justinmoreira.prueba.modules.clients.dto.request.RegisterClientDto;
import com.justinmoreira.prueba.modules.clients.dto.request.UpdateClient;
import com.justinmoreira.prueba.modules.clients.dto.response.ClientDto;
import com.justinmoreira.prueba.modules.clients.models.Client;
import com.justinmoreira.prueba.modules.clients.models.enums.ClientStatus;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {
    public Client toEntity(RegisterClientDto dto, String hashedPassword) {
        return Client.builder()
                .name(dto.name())
                .age(dto.age())
                .direction(dto.direction())
                .isMale(dto.isMale())
                .password(hashedPassword)
                .identificationNumber(dto.identificationNumber())
                .status(ClientStatus.ACTIVE)
                .phoneNumber(dto.phoneNumber())
                .build();
    }

    public ClientDto toDto(Client client) {
        return new ClientDto(
                client.getId(),
                client.getName(),
                client.getAge(),
                client.isMale(),
                client.getIdentificationNumber(),
                client.getDirection(),
                client.getPhoneNumber(),
                client.getStatus()
        );
    }

    public void updateEntity(Client client, UpdateClient dto){
        if (dto.name() != null && !dto.name().isEmpty()) {
            client.setName(dto.name());
        }
        if (dto.age() != null) {
            client.setAge(dto.age());
        }
        if (dto.direction() != null && !dto.direction().isEmpty()) {
            client.setDirection(dto.direction());
        }
        if (dto.isMale() != null) {
            client.setMale(dto.isMale());
        }
        if (dto.phoneNumber() != null && !dto.phoneNumber().isEmpty()) {
            client.setPhoneNumber(dto.phoneNumber());
        }
        if (dto.identificationNumber() != null && !dto.identificationNumber().isEmpty()) {
            client.setIdentificationNumber(dto.identificationNumber());
        }
    }



}
