package com.justinmoreira.prueba.modules.clients.dto.response;

import com.justinmoreira.prueba.modules.clients.models.enums.ClientStatus;

import java.util.UUID;

public record ClientDto(
        UUID id,
        String name,
        int age,
        boolean isMale,
        String identificationNumber,
        String direction,
        String phoneNumber,
        ClientStatus status
) {
}
