package com.justinmoreira.prueba.modules.accounts.controllers;

import com.justinmoreira.prueba.application.exceptions.ApResponse;
import com.justinmoreira.prueba.application.utils.Response;
import com.justinmoreira.prueba.modules.accounts.dto.response.AccountDto;
import com.justinmoreira.prueba.modules.accounts.models.enums.AccountStatus;
import com.justinmoreira.prueba.modules.accounts.models.enums.AccountType;
import com.justinmoreira.prueba.modules.accounts.services.AccountService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
@Tag(name = "Accounts", description = "Endpoints for controlling account operations")
public class AccountController {
    private final AccountService accountService;

    @PostMapping("/create")
    public ResponseEntity<AccountDto> create(@RequestParam AccountType type, @RequestParam UUID clientId) {
        return ResponseEntity.ok(accountService.create(clientId, type));
    }

    @GetMapping("/all-by-status")
    public ResponseEntity<List<AccountDto>> getAllByStatus(@RequestParam AccountStatus status, @RequestParam(required = false) AccountType type) {
        return ResponseEntity.ok(accountService.findAllFiltered(status, type));
    }

    @GetMapping("/all-by-status-client")
    public ResponseEntity<List<AccountDto>> getAllByStatusAndClient(@RequestParam AccountStatus status, @RequestParam(required = false) AccountType type, @RequestParam UUID clientId) {
        return ResponseEntity.ok(accountService.findAllFilteredByClient(clientId,status, type));
    }

    @GetMapping("/by-id")
    public ResponseEntity<AccountDto> getById(@RequestParam UUID accountId) {
        return ResponseEntity.ok(accountService.findById(accountId));
    }

    @PatchMapping("/change-status")
    public ResponseEntity<ApResponse> changeStatus(@RequestParam UUID accountId, @RequestParam AccountStatus newStatus) {
        accountService.changeAccountStatus(accountId, newStatus);
        return Response.success("La cuenta ha pasado a estado " + newStatus + " exitosamente");
    }

    @PatchMapping("/close")
    public ResponseEntity<ApResponse> closeAccount(@RequestParam UUID accountId) {
        accountService.closeAccount(accountId);
        return Response.success("La cuenta ha sido cerrada exitosamente");
    }


}
