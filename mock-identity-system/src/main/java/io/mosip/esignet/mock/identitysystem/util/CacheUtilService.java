package io.mosip.esignet.mock.identitysystem.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CacheUtilService {
    @Autowired
    CacheManager cacheManager;

    public void setTransactionHash(String transactionHash) {
        cacheManager.getCache(Constants.TRANSACTION_HASH).put(transactionHash,transactionHash); //NOSONAR getCache() will not be returning null here.
    }

    public boolean getTransactionHash(String transactionHash) {
        String hash = cacheManager.getCache(Constants.TRANSACTION_HASH).get(transactionHash, String.class); //NOSONAR getCache() will not be returning null here.
        return hash!=null;
    }

    public void removeTransactionHash(String transactionHash){
        cacheManager.getCache(Constants.TRANSACTION_HASH).evict(transactionHash); //NOSONAR getCache() will not be returning null here.
    }

}
