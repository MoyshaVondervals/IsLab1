package org.moysha.islab1.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.AuthRespForm;
import org.moysha.islab1.dto.SignInRequest;
import org.moysha.islab1.dto.SignUpRequest;
import org.moysha.islab1.services.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Регистрация и аутентификация пользователей")
public class AuthController {
    private final AuthenticationService authenticationService;

    @Operation(
            summary = "Регистрация пользователя",
            description = "Создаёт нового пользователя и возвращает форму ответа с токеном/данными.",
            operationId = "authSignUp"
    )
    @ApiResponse(responseCode = "200", description = "Пользователь создан",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = AuthRespForm.class)))
    @ApiResponse(responseCode = "400", description = "Ошибка валидации",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = String.class)))
    @PostMapping("/sign-up")
    public ResponseEntity<AuthRespForm> signUp(
            @RequestBody(description = "Данные для регистрации", required = true,
                    content = @Content(schema = @Schema(implementation = SignUpRequest.class)))
            @org.springframework.web.bind.annotation.RequestBody @Valid SignUpRequest request) {
        return authenticationService.signUp(request);
    }

    @Operation(
            summary = "Вход пользователя",
            description = "Аутентифицирует пользователя и возвращает форму ответа (обычно с JWT).",
            operationId = "authSignIn"
    )
    @ApiResponse(responseCode = "200", description = "Успешная аутентификация",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = AuthRespForm.class)))
    @ApiResponse(responseCode = "401", description = "Неверные учётные данные",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = String.class)))
    @PostMapping("/sign-in")
    public ResponseEntity<AuthRespForm> signIn(
            @RequestBody(description = "Данные для входа", required = true,
                    content = @Content(schema = @Schema(implementation = SignInRequest.class)))
            @org.springframework.web.bind.annotation.RequestBody @Valid SignInRequest request) {
        return authenticationService.signIn(request);
    }
}
