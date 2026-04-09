package com.justinmoreira.prueba.modules.clients.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Getter
@Setter
@SuperBuilder // Cambiado de @Builder a @SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "person")
@Inheritance(strategy = InheritanceType.JOINED) // Define cómo se maneja la herencia en la BD
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int age;

    @Column
    private boolean isMale; // Nota: Podrías usar un String o Enum para género si quieres hacerlo más escalable, pero boolean cumple el requisito.

    @Column(nullable = false, unique = true)
    private String identificationNumber;

    @Column(nullable = false)
    private String direction;

    @Column(nullable = false)
    private String phoneNumber;
}
