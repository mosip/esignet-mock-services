const axios = require("axios");
const {
  generateKeyPair,
  exportJWK,
  calculateJwkThumbprint,
  SignJWT,
  decodeJwt,
  compactDecrypt,
  importJWK,
} = require("jose");
const {
  ESIGNET_SERVICE_URL,
  CLIENT_PRIVATE_KEY,
  USERINFO_RESPONSE_TYPE,
  JWE_USERINFO_PRIVATE_KEY,
} = require("./config");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const { cache } = require("./cacheClient");
const alg = "RS256";
const expirationTime = "1h";
const jweEncryAlgo = "RSA-OAEP-256";
const getOidcConfigurationEndpoint = "/.well-known/openid-configuration";
const baseUrl = ESIGNET_SERVICE_URL.trim();
let dpopKeyAlgo;

const get_dpopKeyAlgo = async () => {
  const endpoint = getBaseUrl(baseUrl) + getOidcConfigurationEndpoint;
  const response = await axios.get(endpoint);
  return response?.data?.dpop_signing_alg_values_supported;
};

const getBaseUrl = (serviceUrl) => {
  const url = new URL(serviceUrl.trim());
  return `${url.protocol}//${url.host}`;
};

/**
 * Generates client assertion signedJWT
 * @param {string} clientId registered client id
 * @returns client assertion signedJWT
 */
const generateSignedJwt = async (clientId, audience) => {
  // Set headers for JWT
  var header = {
    alg: alg,
    typ: "JWT",
  };

  var payload = {
    iss: clientId,
    sub: clientId,
    aud: audience,
  };

  var decodeKey = Buffer.from(CLIENT_PRIVATE_KEY, "base64")?.toString();
  const jwkObject = JSON.parse(decodeKey);
  const privateKey = await importJWK(jwkObject, alg);

  const jwt = new SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuedAt()
    .setJti(Math.random().toString(36).substring(2, 7))
    .setExpirationTime(expirationTime)
    .sign(privateKey);

  return jwt;
};

const generateRandomString = (strLength = 16) => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < strLength; i++) {
    const randomInd = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomInd);
  }
  return result;
};

/**
 * decrypts and decodes the user information fetched from esignet services
 * @param {string} userInfoResponse JWE encrypted or JWT encoded user information
 * @returns decrypted/decoded json user information
 */
const decodeUserInfoResponse = async (userInfoResponse) => {
  try {
    const parts = userInfoResponse.split(".");
    const isJWE =
      USERINFO_RESPONSE_TYPE.toLowerCase() === "jwe" && parts.length === 5;

    if (isJWE) {
      const jwkJson = Buffer.from(JWE_USERINFO_PRIVATE_KEY, "base64").toString(
        "utf-8"
      );
      const jwkParsed = JSON.parse(jwkJson);

      const jwk = Array.isArray(jwkParsed?.keys)
        ? jwkParsed.keys[0]
        : jwkParsed;

      if (!jwk || !jwk.kty || !jwk.d) {
        throw new Error("Invalid or missing private JWK");
      }

      jwk.alg = jwk.alg || jweEncryAlgo;

      const privateKey = await importJWK(jwk, jwk.alg);
      const { plaintext } = await compactDecrypt(userInfoResponse, privateKey);
      const decrypted = new TextDecoder().decode(plaintext);
      const decoded = decodeJwt(decrypted);
      return decoded;
    } else {
      const decoded = decodeJwt(userInfoResponse);
      return decoded;
    }
  } catch (error) {
    console.error("Failed to decode userInfoResponse:", error.message);
    throw error;
  }
};

const generateDpopKeyPair = async () => {
  try {
    const algos = await get_dpopKeyAlgo();
    dpopKeyAlgo = Array.isArray(algos) && algos.length > 0 ? algos[0] : "RS256";
  } catch (error) {
    dpopKeyAlgo = "RS256";
  }
  const { publicKey, privateKey } = await generateKeyPair(dpopKeyAlgo, {
    extractable: true,
  });
  const jwkPublic = await exportJWK(publicKey);
  const jwkPrivate = await exportJWK(privateKey);
  return { publicKey: jwkPublic, privateKey: jwkPrivate };
};

const generateDpopJKT = async (clientId, state) => {
  const { publicKey, privateKey } = await generateDpopKeyPair();

  cache.set(
    `${clientId}###${state}`,
    JSON.stringify({ publicKey, privateKey })
  );

  const dpopJKT = await calculateJwkThumbprint(publicKey);
  return dpopJKT;
};

const generateDpopJwt = async (key, reqPayload) => {
  const header = {
    typ: "dpop+jwt",
    alg: dpopKeyAlgo,
    jwk: key.publicKey,
  };
  const payload = {
    htm: reqPayload.htm,
    htu: reqPayload.htu,
  };
  if (reqPayload.ath) payload.ath = reqPayload.ath;
  if (reqPayload.nonce) payload.nonce = reqPayload.nonce;
  const privateKey = await importJWK(key.privateKey, dpopKeyAlgo);
  return await new SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuedAt()
    .setJti(Math.random().toString(36).substring(2, 7))
    .sign(privateKey);
};

const calculateAth = (accessToken) => {
  const hash = crypto
    .createHash("sha256")
    .update(accessToken, "ascii")
    .digest();
  return hash.toString("base64url");
};


const buildDpopHeaders = async (params) => {
  if (!params.clientId || !params.state) return {};

  const cached = await cache.get(`${params.clientId}###${params.state}`);
  if (!cached) return {};

  const key = JSON.parse(cached);
  const payload = { htm: params.method, htu: params.endpoint };
  if (params.ath) payload.ath = params.ath;
  if (params.nonce) payload.nonce = params.nonce;
  const dpopJwt = await generateDpopJwt(key, payload);

  return { DPoP: dpopJwt };
};

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later."}
});

module.exports = {
  generateSignedJwt,
  generateRandomString,
  decodeUserInfoResponse,
  generateDpopKeyPair,
  rateLimiter,
  generateDpopJwt,
  generateDpopJKT,
  calculateAth,
  buildDpopHeaders,
};
