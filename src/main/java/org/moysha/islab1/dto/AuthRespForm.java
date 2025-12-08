package org.moysha.islab1.dto;

import lombok.Data;
import org.moysha.islab1.unums.Role;


@Data
public class AuthRespForm {
    private final String token;
    private final String username;
    private final Role role;
}