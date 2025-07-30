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
  CLIENT_PRIVATE_KEY,
  USERINFO_RESPONSE_TYPE,
  JWE_USERINFO_PRIVATE_KEY,
} = require("./config");
const { get_dpopKeyAlgo } = require("./esignetService");

const alg = "RS256";
const expirationTime = "1h";
const jweEncryAlgo = "RSA-OAEP-256";

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
  let dpopKeyAlgo;
  try {
    const algos = await get_dpopKeyAlgo();
    dpopKeyAlgo = Array.isArray(algos) && algos.length > 0 ? algos[0] : "RS256";
  } catch (error) {
    dpopKeyAlgo = "RS256";
  }
  const { publicKey, privateKey } = await generateKeyPair(dpopKeyAlgo);
  const jwk = await exportJWK(publicKey);
  const dpop_jkt = await calculateJwkThumbprint(jwk);
  return { publicKey, privateKey, jwk, dpop_jkt };
};

module.exports = {
  generateSignedJwt,
  generateRandomString,
  decodeUserInfoResponse,
  generateDpopKeyPair,
};
