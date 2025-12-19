package org.moysha.islab1.cache;

import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class CacheStatisticsService {

    private final CacheLoggingProperties properties;
    private final AtomicBoolean loggingEnabled = new AtomicBoolean();

    public CacheStatisticsService(CacheLoggingProperties properties) {
        this.properties = properties;
        this.loggingEnabled.set(properties.isStatsLoggingEnabled());
    }

    public boolean isLoggingEnabled() {
        return loggingEnabled.get();
    }

    public boolean updateLogging(boolean enabled) {
        properties.setStatsLoggingEnabled(enabled);
        loggingEnabled.set(enabled);
        return enabled;
    }

    public boolean toggle() {
        boolean newValue = !loggingEnabled.get();
        return updateLogging(newValue);
    }
}
