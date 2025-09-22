-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at https://mozilla.org/MPL/2.0/.
-- -------------------------------------------------------------------------------------------------
-- Database Name: mosip_mockidentitysystem
-- Table Name : partner_data
-- Purpose    : To store relying party data
--
--
-- Modified Date        Modified By         Comments / Remarks
-- ------------------------------------------------------------------------------------------
-- ------------------------------------------------------------------------------------------
CREATE TABLE mockidentitysystem.partner_data (
    partner_id character varying(100) NOT NULL,
    client_id character varying(100) NOT NULL,
    public_key text,
    status character varying(50),
    cr_dtimes timestamp NOT NULL,
    CONSTRAINT pk_partner_data_partner_id_client_id PRIMARY KEY (partner_id, client_id)
);

COMMENT ON COLUMN mockidentitysystem.partner_data.public_key IS 'public key of the relying party';
COMMENT ON COLUMN mockidentitysystem.partner_data.status IS 'status of the relying party';
COMMENT ON COLUMN mockidentitysystem.partner_data.cr_dtimes IS 'creation date time of the record';
COMMENT ON TABLE mockidentitysystem.partner_data IS 'To store relying party data';
