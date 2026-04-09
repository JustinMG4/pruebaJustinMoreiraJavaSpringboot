package com.justinmoreira.prueba.modules.accounts.services;

import com.justinmoreira.prueba.application.exceptions.AppException;
import com.justinmoreira.prueba.modules.accounts.dto.response.AccountDto;
import com.justinmoreira.prueba.modules.accounts.models.Account;
import com.justinmoreira.prueba.modules.accounts.models.enums.AccountStatus;
import com.justinmoreira.prueba.modules.accounts.models.enums.AccountType;
import com.justinmoreira.prueba.modules.accounts.repositories.AccountRepository;
import com.justinmoreira.prueba.modules.accounts.services.mappers.AccountMapper;
import com.justinmoreira.prueba.modules.clients.services.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Validated
public class AccountService {
    private final AccountRepository repository;
    private final ClientService clientService;
    private final AccountNumberService numberGenerator;
    private final AccountMapper mapper;

    @Transactional
    public AccountDto create(UUID clientId, AccountType accountType) {
        var client = clientService.findEntityById(clientId);
        Account accountEntity = mapper.toEntity(generateUniqueAccountNumber(), client, accountType);
        Account savedAccount = repository.save(accountEntity);
        return mapper.toDto(savedAccount);
    }

    @Transactional
    public void changeAccountStatus(UUID accountId, AccountStatus accountStatus) {
        if (accountStatus.equals(AccountStatus.CERRADA)) {
            throw new AppException("Para cerrar una cuenta, use el proceso dedicado a esa funcion", HttpStatus.BAD_REQUEST);
        }
        Account account = findEntityById(accountId);
        account.setStatus(accountStatus);
        repository.save(account);
    }

    @Transactional
    public void closeAccount(UUID accountId) {
        Account account = findEntityById(accountId);
        if (account.getBalance().compareTo(BigDecimal.ZERO) > 0) {
            throw new AppException("No se puede cerrar una cuenta con saldo positivo", HttpStatus.BAD_REQUEST);
        }
        account.setStatus(AccountStatus.CERRADA);
        repository.save(account);
    }

    public List<AccountDto> findAllFiltered(AccountStatus status, AccountType accountType) {
        if (status != null && accountType != null) {
            return findAllByStatusAndAccountType(status, accountType);
        } else if (status != null) {
            return findAllByStatus(status);
        } else {
            throw new AppException("El filtro de estado es obligatorio", HttpStatus.BAD_REQUEST);
        }
    }

    public List<AccountDto> findAllFilteredByClient(UUID clientId, AccountStatus status, AccountType accountType) {
        if (status != null && accountType != null) {
            return findAllByClientIdAndStatusAndAccountType(clientId, status, accountType);
        } else if (status != null) {
            return findAllByClientIdAndStatus(clientId, status);
        } else {
            throw new AppException("El filtro de estado es obligatorio", HttpStatus.BAD_REQUEST);
        }
    }

    private List<AccountDto> findAllByStatus(AccountStatus status) {
        return repository.findAllByStatus(status).stream()
                .map(mapper::toDto)
                .toList();
    }

    private List<AccountDto> findAllByStatusAndAccountType(AccountStatus status, AccountType accountType) {
        return repository.findAllByStatusAndAccountType(status, accountType).stream()
                .map(mapper::toDto)
                .toList();
    }

    private List<AccountDto> findAllByClientIdAndStatus(UUID clientId, AccountStatus status) {
        return repository.findAllByStatusAndClientId(status, clientId).stream()
                .map(mapper::toDto)
                .toList();
    }

    private List<AccountDto> findAllByClientIdAndStatusAndAccountType(UUID clientId, AccountStatus status, AccountType accountType) {
        return repository.findAllByStatusAndClientIdAndAccountType(status, clientId, accountType).stream()
                .map(mapper::toDto)
                .toList();
    }


    public AccountDto findById(UUID accountId) {
        return mapper.toDto(findEntityById(accountId));
    }

    public Account findEntityById(UUID accountId) {
        return repository.findById(accountId)
                .orElseThrow(() -> new AppException("Cuenta no encontrada", HttpStatus.NOT_FOUND));
    }

    public Account findEntityByIdLock(UUID accountId) {
        return repository.findByIdWithLock(accountId)
                .orElseThrow(() -> new AppException("Cuenta no encontrada", HttpStatus.NOT_FOUND));
    }


    private String generateUniqueAccountNumber() {
        final int MAX_ATTEMPTS = 10;
        return Stream.generate(numberGenerator::generateAccountNumber)
                .limit(MAX_ATTEMPTS)
                .filter(number -> !repository.existsByAccountNumber(number))
                .findFirst()
                .orElseThrow(() -> new AppException(
                        "No se pudo asignar un número de cuenta tras " + MAX_ATTEMPTS + " intentos. " +
                                "Es posible que el espacio de numeración esté saturado."
                        , HttpStatus.SERVICE_UNAVAILABLE));
    }

    public void isActiveForTransactions(Account account) {
        if (!account.getStatus().equals(AccountStatus.ACTIVA)) {
            throw new AppException("La cuenta no está activa para realizar transacciones", HttpStatus.BAD_REQUEST);
        }
    }

}
