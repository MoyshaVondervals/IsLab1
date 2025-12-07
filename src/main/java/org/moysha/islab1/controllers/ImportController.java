package org.moysha.islab1.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.moysha.islab1.dto.ImportExecutionResult;
import org.moysha.islab1.exceptions.MessageException;
import org.moysha.islab1.models.OperationHistory;
import org.moysha.islab1.services.DragonImportCoordinator;
import org.moysha.islab1.services.HistoryService;
import org.moysha.islab1.storage.MinioStorageService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;

@RestController
@RequiredArgsConstructor
@RequestMapping("/import")
@Tag(name = "Import", description = "Импорт из файлов в распределённой транзакции")
@SecurityRequirement(name = "bearerAuth")
public class ImportController {

    private final DragonImportCoordinator importCoordinator;
    private final MinioStorageService storageService;
    private final HistoryService historyService;

    @Operation(summary = "Загрузить файл с драконами",
            description = "Файл сохраняется в MinIO и данные импортируются в транзакции 2PC",
            operationId = "importDragonsFromFile")
    @ApiResponse(responseCode = "201", description = "Импорт завершён",
            content = @Content(schema = @Schema(implementation = ImportExecutionResult.class)))
    @PostMapping(value = "/dragons/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImportExecutionResult> importDragons(@RequestPart("file") MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new MessageException("Файл импорта отсутствует");
        }
        ImportExecutionResult result = importCoordinator.importPayload(file.getBytes(),
                file.getOriginalFilename(),
                file.getContentType());
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @Operation(summary = "Скачать исходный файл импорта из лога",
            operationId = "downloadImportSource")
    @ApiResponse(responseCode = "200", description = "Файл скачан",
            content = @Content(mediaType = "application/octet-stream"))
    @GetMapping("/history/{historyId}/file")
    public ResponseEntity<InputStreamResource> downloadHistoryFile(@PathVariable Long historyId) throws Exception {
        OperationHistory history = historyService.getById(historyId)
                .orElseThrow(() -> new MessageException("История импорта не найдена"));
        if (history.getStorageObjectKey() == null) {
            throw new MessageException("Для этой записи отсутствует загруженный файл");
        }
        InputStream inputStream = storageService.downloadObject(history.getStorageBucket(), history.getStorageObjectKey());
        String filename = history.getImportFileName() != null ? history.getImportFileName() : "dragons-import.json";

        InputStreamResource resource = new InputStreamResource(inputStream);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }
}
