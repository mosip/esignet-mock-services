const axios = require("axios");
const {
  ESIGNET_SERVICE_URL,
  ESIGNET_AUD_URL,
  ESIGNET_PAR_AUD_URL,
  CLIENT_ASSERTION_TYPE,
} = require("./config");

const clientDetails = require("./clientDetails");
const { generateSignedJwt, generateRandomString, decodeUserInfoResponse } = require("./utils");

const baseUrl = ESIGNET_SERVICE_URL.trim();
const getTokenEndPoint = "/oauth/v2/token";
const getUserInfoEndPoint = "/oidc/userinfo";
const getOidcConfigurationEndpoint = "/.well-known/openid-configuration";

/**
 * Triggers /oauth/v2/token API on esignet service to fetch access token
 * @param {string} code auth code
 * @param {string} client_id registered client id
 * @param {string} redirect_uri validated redirect_uri
 * @param {string} grant_type grant_type
 * @returns access token
 */
const post_GetToken = async ({ code, client_id, redirect_uri, grant_type }) => {
  let request = new URLSearchParams({
    code: code,
    client_id: client_id,
    redirect_uri: redirect_uri,
    grant_type: grant_type,
    client_assertion_type: CLIENT_ASSERTION_TYPE,
    client_assertion: await generateSignedJwt(client_id, ESIGNET_AUD_URL),
  });
  const endpoint = baseUrl + getTokenEndPoint;
  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
};

/**
 * Triggers /oauth/par API on esignet service to fetch requestUri
 * @param {string} clientId clientId
 * @returns requestUri
 */
const post_GetRequestUri = async (clientId, uiLocales, state) => {
  const clientAssertion = await generateSignedJwt(
    clientId,
    ESIGNET_PAR_AUD_URL,
  );
  const params = new URLSearchParams();
  params.append("nonce", generateRandomString());
  params.append("state", state || generateRandomString(10));
  params.append("client_id", clientId);
  params.append("redirect_uri", clientDetails.redirectUriUserprofile);
  params.append("scope", clientDetails.scopeUserProfile);
  params.append("response_type", clientDetails.responseType);
  params.append("acr_values", clientDetails.acrValues);
  params.append("claims", clientDetails.userProfileClaims);
  params.append("claims_locales", clientDetails.claimsLocales);
  params.append("display", clientDetails.display);
  params.append("prompt", clientDetails.prompt);
  params.append("ui_locales", uiLocales || process.env.DEFAULT_UI_LOCALES);
  params.append("client_assertion_type", CLIENT_ASSERTION_TYPE);
  params.append("client_assertion", clientAssertion);
  const response = await axios.post(clientDetails.parEndpoint, params.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
};

/**
 * Triggers /oidc/userinfo API on esignet service to fetch userInformation
 * @param {string} access_token valid access token
 * @returns decrypted/decoded json user information
 */
const get_GetUserInfo = async (access_token) => {
  const endpoint = baseUrl + getUserInfoEndPoint;
  const response = await axios.get(endpoint, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return decodeUserInfoResponse(response.data);
};

const get_dpopKeyAlgo = async () => {
  const endpoint = baseUrl + getOidcConfigurationEndpoint;
  const response = await axios.get(endpoint);
  return response?.data?.dpop_signing_alg_values_supported;
};

module.exports = {
  post_GetToken,
  get_GetUserInfo,
  post_GetRequestUri,
  get_dpopKeyAlgo,
};
