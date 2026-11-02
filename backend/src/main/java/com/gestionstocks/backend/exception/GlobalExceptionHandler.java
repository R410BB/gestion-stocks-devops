
package com.gestionstocks.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> gererErreurMetier(
            IllegalArgumentException exception) {

        String message = exception.getMessage();

        HttpStatus statut = message != null
                && message.contains("introuvable")
                ? HttpStatus.NOT_FOUND
                : HttpStatus.CONFLICT;

        return ResponseEntity.status(statut)
                .body(Map.of("message", message == null
                        ? "Erreur métier" : message));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> gererValidation(
            MethodArgumentNotValidException exception) {

        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Données invalides");

        return ResponseEntity.badRequest()
                .body(Map.of("message", message));
    }
}
