package org.moysha.islab1.dto;

import lombok.Data;


@Data
public class AuthRespForm {
    private final String token;
    private final String username;
}