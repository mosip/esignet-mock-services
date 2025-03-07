package io.mosip.esignet.mock.identitysystem.util;


import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class CacheUtilServiceTest {
    @InjectMocks
    private CacheUtilService cacheUtilService;

    @Mock
    private Cache cache;

    @Mock
    private CacheManager cacheManager;


    @Before
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
        assertTrue(result);
    }

    @Test
    public void test_getTransactionHash_notExists() {
        String transactionHash = "testTransactionHash";
        when(cache.get(transactionHash, String.class)).thenReturn(null);
        boolean result = cacheUtilService.getTransactionHash(transactionHash);
        assertFalse(result);
    }

    @Test
    public void removeTransactionHash() {
        String transactionHash = "testTransactionHash";
        cacheUtilService.removeTransactionHash(transactionHash);
        verify(cache).evict(transactionHash);
    }
}