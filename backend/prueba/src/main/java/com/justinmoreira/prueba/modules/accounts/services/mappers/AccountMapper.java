package com.justinmoreira.prueba.modules.accounts.services.mappers;

import com.justinmoreira.prueba.modules.accounts.dto.response.AccountDto;
import com.justinmoreira.prueba.modules.accounts.models.Account;
import com.justinmoreira.prueba.modules.accounts.models.enums.AccountStatus;
import com.justinmoreira.prueba.modules.accounts.models.enums.AccountType;
import com.justinmoreira.prueba.modules.clients.models.Client;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;


@Component
public class AccountMapper {

    public Account toEntity(String accountNumber, Client client, AccountType accountType) {
        return Account.builder()
                .status(AccountStatus.ACTIVA)
                .balance(BigDecimal.ZERO)
                .accountType(accountType)
                .accountNumber(accountNumber)
                .client(client)
                .build();
    }

    public AccountDto toDto(Account account) {
        return new AccountDto(
                account.getId(),
                account.getAccountNumber(),
                account.getBalance(),
                account.getStatus(),
                account.getAccountType(),
                account.getClient().getName()
        );
    }
}
