package com.justinmoreira.prueba.modules.accounts.repositories;

import com.justinmoreira.prueba.modules.accounts.models.Account;
import com.justinmoreira.prueba.modules.accounts.models.enums.AccountStatus;
import com.justinmoreira.prueba.modules.accounts.models.enums.AccountType;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {
    List<Account> findAllByStatus(AccountStatus status);

    List<Account> findAllByStatusAndAccountType(AccountStatus status, AccountType accountType);

    List<Account> findAllByStatusAndClientId(AccountStatus status, UUID clientId);

    List<Account> findAllByStatusAndClientIdAndAccountType(AccountStatus status, UUID clientId, AccountType accountType);

    boolean existsByAccountNumber(String accountNumber);


    @Query(value = "SELECT * FROM accounts WHERE id = :id FOR UPDATE", nativeQuery = true)
    Optional<Account> findByIdWithLock(@Param("id") UUID id);
}
