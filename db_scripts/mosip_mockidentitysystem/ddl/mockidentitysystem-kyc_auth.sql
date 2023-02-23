-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at https://mozilla.org/MPL/2.0/.
-- -------------------------------------------------------------------------------------------------
-- Database Name: mosip_mockidentitysystem
-- Table Name : kyc_auth
-- Purpose    : To store authentication data
--
--
-- Modified Date        Modified By         Comments / Remarks
-- ------------------------------------------------------------------------------------------
-- ------------------------------------------------------------------------------------------
CREATE TABLE kyc_auth(
    kyc_token VARCHAR(255),
    individual_id VARCHAR(255),
    partner_specific_user_token VARCHAR(255),
    response_time TIMESTAMP,
    transaction_id VARCHAR(255),
    validity INTEGER
);
