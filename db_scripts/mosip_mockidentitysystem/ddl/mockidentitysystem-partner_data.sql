-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at https://mozilla.org/MPL/2.0/.
-- -------------------------------------------------------------------------------------------------
-- Database Name: mosip_mockidentitysystem
-- Table Name : partner_data
-- Purpose    : To store partner data
--
--
-- Modified Date        Modified By         Comments / Remarks
-- ------------------------------------------------------------------------------------------
-- ------------------------------------------------------------------------------------------
CREATE TABLE mockidentitysystem.partner_data (
    rp_id character varying(100) NOT NULL,
    oidc_client_id character varying(255),
    encrypted_public_key text,
    status character varying(50),
    cr_dtimes timestamp NOT NULL,
    CONSTRAINT pk_partner_data_rp_id PRIMARY KEY (rp_id)
);