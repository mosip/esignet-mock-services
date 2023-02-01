\c mosip_mockidentitysystem

GRANT CONNECT
   ON DATABASE mosip_mockidentitysystem
   TO mockidsystemuser;

GRANT USAGE
   ON SCHEMA mockidentitysystem
   TO mockidsystemuser;

GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES
   ON ALL TABLES IN SCHEMA mockidentitysystem
   TO mockidsystemuser;

ALTER DEFAULT PRIVILEGES IN SCHEMA mockidentitysystem
	GRANT SELECT,INSERT,UPDATE,DELETE,REFERENCES ON TABLES TO mockidsystemuser;

