\c mosip_mockidentitysystem

CREATE TABLE mockidentitysystem.verified_claim(
    id VARCHAR(100) NOT NULL,
	individual_id VARCHAR(36) NOT NULL,
	claim VARCHAR NOT NULL,
	trust_framework VARCHAR NOT NULL,
	detail VARCHAR,
	cr_by character varying(256) NOT NULL,
    cr_dtimes timestamp NOT NULL,
    upd_by character varying(256),
    upd_dtimes timestamp,
    is_active boolean DEFAULT TRUE,
    CONSTRAINT pk_verified_claim_id PRIMARY KEY (id)
);