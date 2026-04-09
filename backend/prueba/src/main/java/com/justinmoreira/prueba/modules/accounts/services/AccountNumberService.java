package com.justinmoreira.prueba.modules.accounts.services;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.stream.Collectors;

@Service
public class AccountNumberService {
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int ACCOUNT_NUMBER_LENGTH = 10;

    protected String generateAccountNumber() {
        return SECURE_RANDOM.ints(ACCOUNT_NUMBER_LENGTH, 0, 10)
                .mapToObj(String::valueOf)
                .collect(Collectors.joining());
    }
}
