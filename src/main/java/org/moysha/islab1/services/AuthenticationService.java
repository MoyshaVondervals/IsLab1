package org.moysha.islab1.services;

import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.AuthRespForm;
import org.moysha.islab1.dto.JwtAuthenticationResponse;
import org.moysha.islab1.dto.SignInRequest;
import org.moysha.islab1.dto.SignUpRequest;
import org.moysha.islab1.models.User;
import org.moysha.islab1.unums.Role;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public ResponseEntity<AuthRespForm> signUp(SignUpRequest request) {

        var user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userService.create(user);

        var jwt = jwtService.generateToken(user);
        return new ResponseEntity<>(new AuthRespForm(jwt, request.getUsername(), Role.USER), HttpStatus.OK);

    }




    public ResponseEntity<AuthRespForm> signIn(SignInRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
        ));

        var user = userService
                .userDetailsService()
                .loadUserByUsername(request.getUsername());


        var jwt = jwtService.generateToken(user);
        User userDetails = userService.getByUsername(request.getUsername());
        return new ResponseEntity<>(new AuthRespForm(jwt, request.getUsername(), userDetails.getRole()), HttpStatus.OK);
    }
}