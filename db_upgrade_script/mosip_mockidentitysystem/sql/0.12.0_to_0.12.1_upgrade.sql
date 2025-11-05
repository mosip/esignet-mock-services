\c mosip_mockidentitysystem

CREATE TABLE mockidentitysystem.partner_data (
    partner_id character varying(100) NOT NULL,
    client_id character varying(100) NOT NULL,
    public_key text,
    status character varying(50),
    cr_dtimes timestamp NOT NULL,
    CONSTRAINT pk_partner_data_partner_id_client_id PRIMARY KEY (partner_id, client_id)
);