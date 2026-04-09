package com.justinmoreira.prueba.modules.clients.dto.request;

public record UpdateClient(
        String name,
        Integer age,
        Boolean isMale,
        String identificationNumber,
        String direction,
        String phoneNumber
) {
}
