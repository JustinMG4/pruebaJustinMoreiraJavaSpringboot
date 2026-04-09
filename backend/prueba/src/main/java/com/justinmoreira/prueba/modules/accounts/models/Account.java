package com.justinmoreira.prueba.modules.accounts.models;

import com.justinmoreira.prueba.modules.accounts.models.enums.AccountStatus;
import com.justinmoreira.prueba.modules.accounts.models.enums.AccountType;
import com.justinmoreira.prueba.modules.clients.models.Client;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String accountNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType accountType;

    @Column
    private BigDecimal balance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private AccountStatus status;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;


}
