package com.justinmoreira.prueba.modules.transactions.services;

import com.justinmoreira.prueba.application.exceptions.AppException;
import com.justinmoreira.prueba.modules.accounts.models.Account;
import com.justinmoreira.prueba.modules.accounts.services.AccountService;
import com.justinmoreira.prueba.modules.transactions.dto.request.NewTransactionDto;
import com.justinmoreira.prueba.modules.transactions.dto.response.NewTransactionResponseDto;
import com.justinmoreira.prueba.modules.transactions.dto.response.TransactionDto;
import com.justinmoreira.prueba.modules.transactions.models.Transaction;
import com.justinmoreira.prueba.modules.transactions.models.enums.TransactionType;
import com.justinmoreira.prueba.modules.transactions.repositories.TransactionRepository;
import com.justinmoreira.prueba.modules.transactions.services.mappers.TransactionMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Validated
@RequiredArgsConstructor
@Log4j2
public class TransactionService {
    private final TransactionRepository repository;
    private final AccountService accountService;
    private final TransactionMapper mapper;

    private static final BigDecimal MAX_AMOUNT = new BigDecimal("1000.00");

    @Transactional
    public NewTransactionResponseDto create(@Valid NewTransactionDto dto, UUID accountId) {
        Account account = accountService.findEntityByIdLock(accountId);
        Transaction transaction = mapper.toEntity(dto, account);
        if (transaction.getType().equals(TransactionType.DEBITO)){
            checkMaxDailyAmount(transaction, accountId);
            checkSufficientBalance(transaction, account);
        }
        Transaction savedTransaction = repository.save(transaction);
        BigDecimal newBalance = calculateNewBalance(transaction, account.getBalance());
        account.setBalance(newBalance);
        return mapper.toNewTransactionDto(savedTransaction, newBalance);
    }

    public List<TransactionDto> findAllByAccountFilters(UUID accountId, LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return findAllByDateBetweenAndAccountId(startDate, endDate, accountId);
        } else {
            return findAllByAccountId(accountId);
        }
    }

    private List<TransactionDto> findAllByAccountId(UUID accountId) {
        return repository.findAllByAccountId(accountId).stream()
                .map(mapper::toDto)
                .toList();
    }

    private List<TransactionDto> findAllByDateBetweenAndAccountId(LocalDate startDate, LocalDate endDate, UUID accountId) {
        return repository.findAllByDateBetweenAndAccountId(startDate, endDate, accountId).stream()
                .map(mapper::toDto)
                .toList();
    }

    private BigDecimal calculateNewBalance(Transaction transaction, BigDecimal currentBalance) {
        return transaction.getType().equals(TransactionType.CREDITO)
                ? currentBalance.add(transaction.getAmount())
                : currentBalance.subtract(transaction.getAmount());
    }

    private void checkSufficientBalance(Transaction transaction, Account account) {
        BigDecimal currentBalance = account.getBalance();
        if (transaction.getAmount().compareTo(currentBalance) > 0) {
            throw new AppException("Saldo insuficiente para realizar esta transacción de débito.", HttpStatus.BAD_REQUEST);
        }
    }

    private void checkMaxDailyAmount(Transaction transaction, UUID accountId) {
        BigDecimal todayAmount = repository.sumAmountByTypeDateAndAccount(
                TransactionType.DEBITO,
                transaction.getDate(),
                accountId
        );
        if (todayAmount.add(transaction.getAmount()).compareTo(MAX_AMOUNT) > 0) {
            throw new AppException("Haz excedido el monto máximo diario permitido para transacciones de débito para esta cuenta.", HttpStatus.BAD_REQUEST);
        }
    }


}
