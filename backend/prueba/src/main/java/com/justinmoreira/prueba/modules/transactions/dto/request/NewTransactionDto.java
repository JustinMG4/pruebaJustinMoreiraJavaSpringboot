package com.justinmoreira.prueba.modules.transactions.dto.request;

import com.justinmoreira.prueba.modules.transactions.models.enums.TransactionType;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record NewTransactionDto(
        TransactionType type,
        @NotNull BigDecimal amount

) {
}
