package com.justinmoreira.prueba.modules.accounts.dto.response;

import com.justinmoreira.prueba.modules.accounts.models.enums.AccountStatus;
import com.justinmoreira.prueba.modules.accounts.models.enums.AccountType;

import java.math.BigDecimal;
import java.util.UUID;

public record AccountDto(
        UUID id,
        String accountNumber,
        BigDecimal balance,
        AccountStatus status,
        AccountType type,
        String holderName
) {
}
