-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at https://mozilla.org/MPL/2.0/.
-- -------------------------------------------------------------------------------------------------
-- Database Name: mosip_esignet
-- Table Name : key_store
-- Purpose    : Key Store table
--
--
-- Modified Date        Modified By         Comments / Remarks
-- ------------------------------------------------------------------------------------------
-- ------------------------------------------------------------------------------------------
CREATE TABLE public.key_store(
	id character varying(36) NOT NULL,
	master_key character varying(36) NOT NULL,
	private_key character varying(2500) NOT NULL,
	certificate_data character varying NOT NULL,
	cr_by character varying(256) NOT NULL,
	cr_dtimes timestamp NOT NULL,
	upd_by character varying(256),
	upd_dtimes timestamp,
	is_deleted boolean DEFAULT FALSE,
	del_dtimes timestamp,
	CONSTRAINT pk_keystr_id PRIMARY KEY (id)
);

COMMENT ON TABLE public.key_store IS 'Stores Encryption (Base) private keys along with certificates';
COMMENT ON COLUMN public.key_store.id IS 'Unique identifier (UUID) for referencing keys';
COMMENT ON COLUMN public.key_store.master_key IS 'UUID of the master key used to encrypt this key';
COMMENT ON COLUMN public.key_store.private_key IS 'Encrypted private key';
COMMENT ON COLUMN public.key_store.certificate_data IS 'X.509 encoded certificate data';
COMMENT ON COLUMN public.key_store.cr_by IS 'ID or name of the user who create / insert record';
COMMENT ON COLUMN public.key_store.cr_dtimes IS 'Date and Timestamp when the record is created/inserted';
COMMENT ON COLUMN public.key_store.upd_by IS 'ID or name of the user who update the record with new values';
COMMENT ON COLUMN public.key_store.upd_dtimes IS 'Date and Timestamp when any of the fields in the record is updated with new values.';
COMMENT ON COLUMN public.key_store.is_deleted IS 'Flag to mark whether the record is Soft deleted.';
COMMENT ON COLUMN public.key_store.del_dtimes IS 'Date and Timestamp when the record is soft deleted with is_deleted=TRUE';