package org.moysha.islab1.webSocket;


import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class EchoWsController {
    // Клиент шлёт в /app/echo → ответы публикуются в /topic/echo
    @MessageMapping("/echo")
    @SendTo("/topic/echo")
    public String echo(@Payload String body) {
        return "serverZ: " + body;
    }
}
