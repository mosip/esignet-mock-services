-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at https://mozilla.org/MPL/2.0/.
-- -------------------------------------------------------------------------------------------------
-- Database Name: mosip_mockidentitysystem
-- Table Name : verified_claim
-- Purpose    : To store verified claim metadata for individual
--
--
-- Modified Date        Modified By         Comments / Remarks
-- ------------------------------------------------------------------------------------------
-- ------------------------------------------------------------------------------------------
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