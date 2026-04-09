package com.justinmoreira.prueba.modules.transactions.dto.response;

import com.justinmoreira.prueba.modules.transactions.models.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record TransactionDto(
        UUID id,
        LocalDate date,
        TransactionType type,
        BigDecimal amount,
        String accountNumber,
        BigDecimal balanceAfterTransaction

) {
}
