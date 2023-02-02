-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at https://mozilla.org/MPL/2.0/.
-- -------------------------------------------------------------------------------------------------
-- Database Name: mosip_mockidentitysystem
-- Table Name : mock_identity
-- Purpose    : To store mock Identity
--
--
-- Modified Date        Modified By         Comments / Remarks
-- ------------------------------------------------------------------------------------------
-- ------------------------------------------------------------------------------------------
CREATE TABLE mock_identity(
	individual_id varying(36) NOT NULL,
	identity_json varying(2048) NOT NULL,
    CONSTRAINT pk_mock_id_code PRIMARY KEY (individual_id)
);