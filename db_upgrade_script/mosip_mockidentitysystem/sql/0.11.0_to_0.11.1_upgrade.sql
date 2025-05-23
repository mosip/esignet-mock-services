\c mosip_mockidentitysystem

CREATE TABLE mockidentitysystem.partner_data (
    rp_id character varying(100) NOT NULL,
    oidc_client_id character varying(255),
    encrypted_public_key text,
    status character varying(50),
    cr_dtimes timestamp NOT NULL,
    CONSTRAINT pk_partner_data_rp_id PRIMARY KEY (rp_id)
);