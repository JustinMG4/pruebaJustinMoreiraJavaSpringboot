package com.justinmoreira.prueba.modules.clients.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RegisterClientDto(
        @NotBlank String name,
        int age,
        boolean isMale,
        @NotBlank String identificationNumber,
        @NotBlank String direction,
        @NotBlank String phoneNumber,
        @NotBlank String password
) {
}
