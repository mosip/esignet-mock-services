package io.mosip.esignet.mock.identitysystem.repository;

import io.mosip.esignet.mock.identitysystem.entity.KycAuth;
import io.mosip.esignet.mock.identitysystem.dto.Valid;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(SpringExtension.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class AuthRepositoryTest {
    @Autowired
    private AuthRepository authRepository;
    private KycAuth kycAuth;
    @BeforeEach
    public void setUp(){
        kycAuth =new KycAuth("o7-dsTeUR73g7UKaUcZQ0JxR1e_j7B4p1oTczg2B_SE"
                ,"G1Ty7yKYSl-Wc-I8IHBZukZkRUef3X-IJ31jzTSe2ak"
                ,LocalDateTime.parse("2023-01-10T15:41:58.871755")
                , Valid.ACTIVE,"1234","4964085042");
    }

    @AfterEach
    public void tearDown(){
        kycAuth =null;
    }
    @Test
    public void givenKycAuthResultToSaveShouldReturnKycAuthResult(){
        authRepository.save(kycAuth);
        KycAuth kycAuth1 =authRepository.findById(kycAuth.getKycToken()).get();
        assertEquals(kycAuth.getKycToken(), kycAuth1.getKycToken());
    }
    @Test
    public void givenEmployeeToDeleteShouldDeleteEmployee(){
        authRepository.save(kycAuth);
        KycAuth kycAuth1 = authRepository.findById(kycAuth.getKycToken()).get();
        authRepository.delete(kycAuth1);
        assertEquals(Optional.empty(),authRepository.findById(kycAuth.getKycToken()));
    }
}
