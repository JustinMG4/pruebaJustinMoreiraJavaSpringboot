package com.justinmoreira.prueba.modules.transactions.services.mappers;

import com.justinmoreira.prueba.modules.accounts.models.Account;
import com.justinmoreira.prueba.modules.transactions.dto.request.NewTransactionDto;
import com.justinmoreira.prueba.modules.transactions.dto.response.NewTransactionResponseDto;
import com.justinmoreira.prueba.modules.transactions.dto.response.TransactionDto;
import com.justinmoreira.prueba.modules.transactions.models.Transaction;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class TransactionMapper {
    public Transaction toEntity(NewTransactionDto dto, Account account) {
        return Transaction.builder()
                .amount(dto.amount())
                .date(LocalDate.now())
                .type(dto.type())
                .account(account)
                .build();
    }

    public NewTransactionResponseDto toNewTransactionDto(Transaction transaction, BigDecimal balanceAfter) {
        return new NewTransactionResponseDto(
                transaction.getId(),
                transaction.getDate(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getAccount().getAccountNumber(),
                balanceAfter
        );
    }

    public TransactionDto toDto(Transaction transaction) {
        return new TransactionDto(
                transaction.getId(),
                transaction.getDate(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getAccount().getAccountNumber()
        );
    }
}
