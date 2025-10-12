package org.moysha.islab1.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {
    @GetMapping({
            "/{path:^(?!api|actuator|ws|static|assets|css|js).*$}",
            "/{path:^(?!api|actuator|ws|static|assets|css|js).*$}/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
