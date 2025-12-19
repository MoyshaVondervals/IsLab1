package org.moysha.islab1.storage;

import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class MinioConfiguration {

    private final StorageProperties storageProperties;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(storageProperties.getEndpoint())
                .credentials(storageProperties.getAccessKey(), storageProperties.getSecretKey())
                .build();
    }
}
