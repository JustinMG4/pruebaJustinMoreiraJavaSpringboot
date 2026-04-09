package com.justinmoreira.prueba.application.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;


@OpenAPIDefinition(
        info = @Info(
                title = "API REST - Aplicación de Prueba Justin Moreira",
                version = "1.0.0",
                description = "API REST para la aplicación de prueba de Justin Moreira. Gestion de cuentas y transacciones",
                contact = @Contact(
                        name = "Justin Moreira",
                        email = "justinmoreiragarcia@gmail.com"
                ),
                license = @io.swagger.v3.oas.annotations.info.License(
                        name = "Apache 2.0",
                        url = "https://www.apache.org/licenses/LICENSE-2.0.html"
                )
        ),
        servers = {
                @Server(
                        description = "localhost",
                        url = "http://localhost:8080"
                )

        }

)
public class SwaggerConfig {
}
