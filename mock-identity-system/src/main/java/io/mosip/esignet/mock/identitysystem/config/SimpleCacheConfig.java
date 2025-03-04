/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.config;

import com.google.common.cache.CacheBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
public class SimpleCacheConfig extends CachingConfigurerSupport {

    @Value("${mosip.esignet.cache.size:200}")
    private long cacheMaxSize;

    @Value("${mosip.esignet.cache.expire-in-seconds:600}")
    private long cacheExpireInSeconds;

    @Bean
    @Override
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        List<Cache> caches = new ArrayList<>();
        caches.add(buildMapCache("trnHash"));
        cacheManager.setCaches(caches);
        return cacheManager;
    }

    private ConcurrentMapCache buildMapCache(String name) {
        return new ConcurrentMapCache(name,
                CacheBuilder.newBuilder()
                        .expireAfterWrite(cacheExpireInSeconds, TimeUnit.SECONDS)
                        .maximumSize(cacheMaxSize)
                        .build()
                        .asMap(), true);
    }
}
