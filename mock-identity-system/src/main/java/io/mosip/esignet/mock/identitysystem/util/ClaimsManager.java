package io.mosip.esignet.mock.identitysystem.util;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ClaimsManager {
    private List<String> claims;


    public ClaimsManager(List<String> claims) {
        this.claims = claims;
    }

    public void addClaim(String claim) {
        if(!claims.contains(claim)){
            claims.add(claim);
        }
    }

    public void removeClaim(String claim) {
        claims.remove(claim);
    }

    public List<String> getClaims() {
        return new ArrayList<>(claims);
    }

    public void clearClaims() {
        claims.clear();
    }

}
