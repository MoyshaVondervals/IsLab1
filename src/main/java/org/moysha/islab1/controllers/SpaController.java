package org.moysha.islab1.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {
    @GetMapping(value = {"/{path:[^\\.]*}", "/{path:^(?!api|ws|actuator).*$}/**"})
    public String forward() {
        return "forward:/index.html";
    }
}
