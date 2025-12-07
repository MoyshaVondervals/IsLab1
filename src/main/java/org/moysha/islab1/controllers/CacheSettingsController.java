package org.moysha.islab1.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.cache.CacheStatisticsService;
import org.moysha.islab1.dto.CacheLoggingRequest;
import org.moysha.islab1.dto.CacheLoggingResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cache")
@Tag(name = "Cache", description = "Настройки кэширования")
@SecurityRequirement(name = "bearerAuth")
public class CacheSettingsController {

    private final CacheStatisticsService cacheStatisticsService;

    @Operation(summary = "Получить состояние логирования статистики L2 кэша",
            operationId = "getCacheLoggingState")
    @GetMapping("/logging")
    public ResponseEntity<CacheLoggingResponse> getLoggingState() {
        return ResponseEntity.ok(new CacheLoggingResponse(cacheStatisticsService.isLoggingEnabled()));
    }

    @Operation(summary = "Включить или выключить логирование статистики L2 кэша",
            operationId = "toggleCacheLogging")
    @PostMapping("/logging")
    public ResponseEntity<CacheLoggingResponse> updateLogging(@RequestBody @Valid CacheLoggingRequest request) {
        boolean enabled = cacheStatisticsService.updateLogging(request.getEnabled());
        return ResponseEntity.ok(new CacheLoggingResponse(enabled));
    }
}
