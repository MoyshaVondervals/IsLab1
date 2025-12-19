package org.moysha.islab1.cache;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.cache")
public class CacheLoggingProperties {
    private boolean statsLoggingEnabled = true;
}
