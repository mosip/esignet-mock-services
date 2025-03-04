module.exports = {
  ESIGNET_SERVICE_URL: process.env.ESIGNET_SERVICE_URL ?? "http://localhost:8088/v1/esignet",
  PORT: process.env.PORT ?? 8888,
  CLIENT_PRIVATE_KEY: process.env.CLIENT_PRIVATE_KEY ?? '',
  ESIGNET_AUD_URL: process.env.ESIGNET_AUD_URL ?? "http://localhost:8088/v1/esignet/oauth/v2/token",
  CLIENT_ASSERTION_TYPE: process.env.CLIENT_ASSERTION_TYPE ?? "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
  USERINFO_RESPONSE_TYPE: process.env.USERINFO_RESPONSE_TYPE ?? "jwk",
  JWE_USERINFO_PRIVATE_KEY: process.env.JWE_USERINFO_PRIVATE_KEY ?? '',
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT ?? 5432,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASS,
    JWKS_URI: process.env.JWKS_URI 
};
