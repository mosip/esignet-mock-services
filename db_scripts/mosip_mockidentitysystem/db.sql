CREATE DATABASE :mosipdbname
	ENCODING = 'UTF8' 
	LC_COLLATE = 'en_US.UTF-8' 
	LC_CTYPE = 'en_US.UTF-8' 
	TABLESPACE = pg_default 
	OWNER = postgres
	TEMPLATE  = template0;

COMMENT ON DATABASE :mosipdbname IS 'Mock identity related data is stored in this database';

\c mosip_mockidentitysystem postgres

DROP SCHEMA IF EXISTS mockidentitysystem CASCADE;
CREATE SCHEMA mockidentitysystem;
ALTER SCHEMA mockidentitysystem OWNER TO postgres;
ALTER DATABASE :mosipdbname SET search_path TO mockidentitysystem,pg_catalog,public;

