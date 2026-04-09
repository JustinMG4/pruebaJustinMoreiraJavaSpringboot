package com.justinmoreira.prueba.modules.transactions.controller;

import com.justinmoreira.prueba.modules.transactions.dto.request.NewTransactionDto;
import com.justinmoreira.prueba.modules.transactions.dto.response.NewTransactionResponseDto;
import com.justinmoreira.prueba.modules.transactions.dto.response.TransactionDto;
import com.justinmoreira.prueba.modules.transactions.services.TransactionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Endpoints for controlling transactions operations")
@CrossOrigin(origins = "http://localhost:4200")
public class TransactionController {
    private final TransactionService service;

    @PostMapping("/create")
    public ResponseEntity<NewTransactionResponseDto> createTransaction(
            @RequestParam UUID accountId,
            @RequestBody NewTransactionDto request
    ) {
        NewTransactionResponseDto response = service.create(request, accountId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all-filtered")
    public ResponseEntity<List<TransactionDto>> getAllTransactions(
            @RequestParam UUID accountId,
            @RequestParam(required = false)LocalDate startDate,
            @RequestParam(required = false)LocalDate endDate
            ) {
        List<TransactionDto> transactions = service.findAllByAccountFilters(accountId, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }
}
