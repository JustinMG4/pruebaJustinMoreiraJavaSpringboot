package com.justinmoreira.prueba.modules.clients.models;

import com.justinmoreira.prueba.modules.clients.models.enums.ClientStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "client")
public class Client extends Person {


    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClientStatus status;
}
