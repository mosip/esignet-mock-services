const axios = require("axios");
const {
  ESIGNET_SERVICE_URL,
  ESIGNET_AUD_URL,
  ESIGNET_PAR_AUD_URL,
  CLIENT_ASSERTION_TYPE,
} = require("./config");

const clientDetails = require("./clientDetails");
const {
  generateSignedJwt,
  generateRandomString,
  decodeUserInfoResponse,
  generateDpopJKT,
  calculateAth,
  buildDpopHeaders,
} = require("./utils");

const baseUrl = ESIGNET_SERVICE_URL.trim();
const getTokenEndPoint = "/oauth/v2/token";
const getUserInfoEndPoint = "/oidc/userinfo";

/**
 * Triggers /oauth/v2/token API on esignet service to fetch access token
 * @param {string} code auth code
 * @param {string} client_id registered client id
 * @param {string} redirect_uri validated redirect_uri
 * @param {string} grant_type grant_type
 * @returns access token
 */
const post_GetToken = async ({
  code,
  state,
  client_id,
  redirect_uri,
  grant_type,
}) => {
  let request = new URLSearchParams({
    code: code,
    client_id: client_id,
    redirect_uri: redirect_uri,
    grant_type: grant_type,
    client_assertion_type: CLIENT_ASSERTION_TYPE,
    client_assertion: await generateSignedJwt(client_id, ESIGNET_AUD_URL),
  });
  const endpoint = baseUrl + getTokenEndPoint;
  const dpopHeaders = await buildDpopHeaders({
    clientId: client_id,
    state,
    endpoint,
    method: "POST",
  });
  let headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    ...dpopHeaders,
  };
  try {
    const response = await axios.post(endpoint, request, {
      headers,
    });
    return response.data;
  } catch (error) {
    const nonce = error.response?.headers?.["dpop-nonce"];
    if (error.status === 400 && nonce) {
      const dpopHeadersWithNonce = await buildDpopHeaders({
        clientId: client_id,
        state,
        endpoint,
        method: "POST",
        nonce,
      });
      headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        ...dpopHeadersWithNonce,
      };
      const retryResponse = await axios.post(endpoint, request, { headers });
      return retryResponse.data;
    }
    throw error;
  }
};

/**
 * Triggers /oauth/par API on esignet service to fetch requestUri
 * @param {string} clientId clientId
 * @returns requestUri
 */
const post_GetRequestUri = async (clientId, uiLocales, state, dpop_jkt) => {
  const clientAssertion = await generateSignedJwt(
    clientId,
    ESIGNET_PAR_AUD_URL
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
  if (dpop_jkt) {
    params.append("dpop_jkt", dpop_jkt);
  }
  const endpoint = clientDetails.parEndpoint;
  const dpopHeaders = await buildDpopHeaders({
    clientId,
    state,
    endpoint,
    method: "POST",
  });
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    ...dpopHeaders,
  };
  const response = await axios.post(endpoint, params.toString(), { headers });
  return response.data;
};

/**
 * Triggers /oidc/userinfo API on esignet service to fetch userInformation
 * @param {string} access_token valid access token
 * @returns decrypted/decoded json user information
 */
const get_GetUserInfo = async (access_token, client_id, state) => {
  const endpoint = baseUrl + getUserInfoEndPoint;
  const dpopHeaders = await buildDpopHeaders({
    clientId: client_id,
    state,
    endpoint,
    method: "GET",
    ath: calculateAth(access_token),
  });
  let headers;
  if (dpopHeaders.DPoP) {
    headers = {
      Authorization: `DPoP ${access_token}`,
      ...dpopHeaders,
    };
  } else {
    headers = {
      Authorization: `Bearer ${access_token}`,
    };
  }
  try {
    const response = await axios.get(endpoint, { headers });
    return decodeUserInfoResponse(response.data);
  } catch (error) {
    const nonce = error.response?.headers?.["DPoP-Nonce"];
    const wwwAuth = error.response?.headers?.[" WWW-Authenticate"];
    const status = error.status;

    if (
      status === 401 &&
      wwwAuth &&
      wwwAuth.includes("use_dpop_nonce") &&
      nonce
    ) {
      const dpopHeadersWithNonce = await buildDpopHeaders({
        clientId: client_id,
        state,
        endpoint,
        method: "GET",
        ath: calculateAth(access_token),
        nonce,
      });

      const retryHeaders = {
        Authorization: `DPoP ${access_token}`,
        ...dpopHeadersWithNonce,
      };

      const retryResponse = await axios.get(endpoint, {
        headers: retryHeaders,
      });
      return decodeUserInfoResponse(retryResponse.data);
    }
    throw error;
  }
};

/**
 * Generate a public private key pair and store
 * in-memory cache and then return the dpop jkt
 * @param {string} clientId client id for the flow
 * @param {string} state state of the current flow
 * @returns {Object} a thumbprint of the dpop as dpop_jkt
 */
const get_dpopJKT = async (clientId, state) => {
  const dpopJKT = await generateDpopJKT(clientId, state);
  return dpopJKT;
};

module.exports = {
  post_GetToken,
  get_GetUserInfo,
  post_GetRequestUri,
  get_dpopJKT,
};
