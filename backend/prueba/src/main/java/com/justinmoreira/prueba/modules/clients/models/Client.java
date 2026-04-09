package com.justinmoreira.prueba.modules.clients.models;

import com.justinmoreira.prueba.modules.clients.models.enums.ClientStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@Getter
@Setter// Añadido para tener getters/setters igual que en Person
@SuperBuilder // Cambiado de @Builder a @SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "client")
public class Client extends Person {


    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING) // Recomendado para guardar el texto del enum
    @Column(nullable = false)
    private ClientStatus status;
}
