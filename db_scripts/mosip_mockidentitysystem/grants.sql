\c mosip_mockidentitysystem

GRANT CONNECT
   ON DATABASE mosip_mockidentitysystem
   TO idpuser;

GRANT USAGE
   ON SCHEMA mockidentitysystem
   TO idpuser;

GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES
   ON ALL TABLES IN SCHEMA mockidentitysystem
   TO idpuser;

ALTER DEFAULT PRIVILEGES IN SCHEMA mockidentitysystem
	GRANT SELECT,INSERT,UPDATE,DELETE,REFERENCES ON TABLES TO idpuser;

