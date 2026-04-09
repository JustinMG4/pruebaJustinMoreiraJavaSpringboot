package com.justinmoreira.prueba.modules.clients.controllers;

import com.justinmoreira.prueba.application.exceptions.ApResponse;
import com.justinmoreira.prueba.application.utils.Response;
import com.justinmoreira.prueba.modules.clients.dto.request.RegisterClientDto;
import com.justinmoreira.prueba.modules.clients.dto.request.UpdateClient;
import com.justinmoreira.prueba.modules.clients.dto.response.ClientDto;
import com.justinmoreira.prueba.modules.clients.models.enums.ClientStatus;
import com.justinmoreira.prueba.modules.clients.services.ClientService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Clients", description = "Endpoints for controlling client operations")
public class ClientController {
    private final ClientService service;

    @PostMapping("/create")
    ResponseEntity<ClientDto> create(
            @RequestBody RegisterClientDto dto
    ) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PostMapping("/verify-password")
    ResponseEntity<Boolean> verifyPassword(
            @RequestParam UUID clientId,
            @RequestBody String password
    ) {
        return ResponseEntity.ok(service.validatePassword(password, clientId));
    }

    @GetMapping("/all")
    ResponseEntity<List<ClientDto>> getAll(
            @RequestParam ClientStatus status
    ) {
        List<ClientDto> clients = service.findAll(status);
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/by-id")
    ResponseEntity<ClientDto> getById(@RequestParam UUID id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PutMapping("/update")
    ResponseEntity<ApResponse> update(
            @RequestParam UUID id,
            @RequestBody UpdateClient dto
    ) {
        service.updateClient(id, dto);
        return Response.success("Client updated successfully");
    }

    @PatchMapping("/change-status")
    ResponseEntity<ApResponse> changeStatus(
            @RequestParam UUID id,
            @RequestParam ClientStatus status
            ) {
        service.changeStatus(id, status);
        return Response.success("Client status updated successfully");
    }

    @PatchMapping("/delete")
    ResponseEntity<ApResponse> delete(@RequestParam UUID id) {
        service.deleteClient(id);
        return Response.success("Client deleted successfully");
    }



}
