\c mosip_mockidentitysystem

\COPY mockidentitysystem.key_policy_def (APP_ID,KEY_VALIDITY_DURATION,PRE_EXPIRE_DAYS,ACCESS_ALLOWED,IS_ACTIVE,CR_BY,CR_DTIMES) FROM './dml/mockidentitysystem-key_policy_def.csv' delimiter ',' HEADER  csv;
