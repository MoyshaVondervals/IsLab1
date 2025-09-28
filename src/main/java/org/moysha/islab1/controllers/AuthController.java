package org.moysha.islab1.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.AuthRespForm;
import org.moysha.islab1.dto.JwtAuthenticationResponse;
import org.moysha.islab1.dto.SignInRequest;
import org.moysha.islab1.dto.SignUpRequest;
import org.moysha.islab1.services.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {
    private final AuthenticationService authenticationService;

    @Operation(summary = "Sign up user")
    @PostMapping("/sign-up")
    public ResponseEntity<AuthRespForm> signUp(@RequestBody @Valid SignUpRequest request) {
        return authenticationService.signUp(request);
    }

    @Operation(summary = "Sign in user")
    @PostMapping("/sign-in")
    public ResponseEntity<AuthRespForm> signIn(@RequestBody @Valid SignInRequest request) {
        return authenticationService.signIn(request);
    }
}