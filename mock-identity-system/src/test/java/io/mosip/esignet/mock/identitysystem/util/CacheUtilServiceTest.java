package io.mosip.esignet.mock.identitysystem.util;


import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CacheUtilServiceTest {
    @InjectMocks
    private CacheUtilService cacheUtilService;

    @Mock
    private Cache cache;

    @Mock
    private CacheManager cacheManager;


    @BeforeEach
    public void setUp(){
        when(cacheManager.getCache(Constants.TRANSACTION_HASH)).thenReturn(cache);
    }

    @Test
    public void test_setTransactionHash() {
        String transactionHash = "testTransactionHash";
        cacheUtilService.setTransactionHash(transactionHash);
        verify(cache).put(transactionHash, transactionHash);
    }

    @Test
    public void test_getTransactionHash_exists() {
        String transactionHash = "testTransactionHash";
        when(cache.get(transactionHash, String.class)).thenReturn(transactionHash);
        boolean result = cacheUtilService.getTransactionHash(transactionHash);
        Assertions.assertTrue(result);
    }

    @Test
    public void test_getTransactionHash_notExists() {
        String transactionHash = "testTransactionHash";
        when(cache.get(transactionHash, String.class)).thenReturn(null);
        boolean result = cacheUtilService.getTransactionHash(transactionHash);
        Assertions.assertFalse(result);
    }

    @Test
    public void removeTransactionHash() {
        String transactionHash = "testTransactionHash";
        cacheUtilService.removeTransactionHash(transactionHash);
        verify(cache).evict(transactionHash);
    }
}