package org.moysha.islab1.webSocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // точка подключения
                .setAllowedOriginPatterns("*"); // при необходимости сузьте домены
        // Если нужен фоллбек под старые браузеры:
        // registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Клиенты будут подписываться на /topic/...
        registry.enableSimpleBroker("/topic");
        // Префикс для сообщений от клиента к серверу (если будете обрабатывать client->server)
        registry.setApplicationDestinationPrefixes("/app");
    }
}
