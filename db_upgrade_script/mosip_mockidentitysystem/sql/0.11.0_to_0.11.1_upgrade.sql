\c mosip_mockidentitysystem

CREATE TABLE mockidentitysystem.rp_data (
    rp_id character varying(100) NOT NULL,
    client_id character varying(255),
    encryption_key text,
    status character varying(50),
    cr_dtimes timestamp NOT NULL,
    CONSTRAINT pk_rp_data_rp_id PRIMARY KEY (rp_id)
);