package org.moysha.islab1.cache;

import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.hibernate.engine.spi.SessionFactoryImplementor;
import org.hibernate.stat.Statistics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class CacheStatisticsAspect {

    private static final Logger log = LoggerFactory.getLogger(CacheStatisticsAspect.class);

    private final CacheStatisticsService cacheStatisticsService;
    private final EntityManagerFactory entityManagerFactory;

    @Around("@annotation(org.moysha.islab1.cache.LogCacheStats)")
    public Object logCacheStats(ProceedingJoinPoint joinPoint) throws Throwable {
        if (!cacheStatisticsService.isLoggingEnabled()) {
            return joinPoint.proceed();
        }

        Statistics stats = resolveStatistics();
        long hitsBefore = stats.getSecondLevelCacheHitCount();
        long missesBefore = stats.getSecondLevelCacheMissCount();
        long putsBefore = stats.getSecondLevelCachePutCount();

        Object result = joinPoint.proceed();

        long hitsDelta = stats.getSecondLevelCacheHitCount() - hitsBefore;
        long missesDelta = stats.getSecondLevelCacheMissCount() - missesBefore;
        long putsDelta = stats.getSecondLevelCachePutCount() - putsBefore;

        log.info("L2 cache statistics after {} -> hits: {}, misses: {}, puts: {}",
                joinPoint.getSignature(), hitsDelta, missesDelta, putsDelta);

        return result;
    }

    private Statistics resolveStatistics() {
        SessionFactoryImplementor sessionFactory = entityManagerFactory.unwrap(SessionFactoryImplementor.class);
        return sessionFactory.getStatistics();
    }
}
