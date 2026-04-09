package com.justinmoreira.prueba.modules.transactions.repositories;

import com.justinmoreira.prueba.modules.transactions.models.Transaction;
import com.justinmoreira.prueba.modules.transactions.models.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
            "WHERE t.type = :type AND t.date = :date AND t.account.id = :accountId")
    BigDecimal sumAmountByTypeDateAndAccount(
            @Param("type") TransactionType type,
            @Param("date") LocalDate date,
            @Param("accountId") UUID accountId
    );

    List<Transaction> findAllByAccountId(UUID accountId);
    List<Transaction> findAllByDateBetweenAndAccountId(LocalDate startDate, LocalDate endDate, UUID accountId);
}
