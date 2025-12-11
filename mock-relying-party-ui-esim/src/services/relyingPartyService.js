import axios from "axios";
import {
  BASE_URL,
  GET_USER_INFO,
  GET_REQUEST_URI,
  GET_DPOP_JKT,
} from "../constants/routes";

/**
 * Fetches the DPoP JWK thumbprint (JKT) from the relying party server.
 * @param {string} clientId - Registered client ID
 * @param {string} state - Unique state value for the authorization request
 * @returns {Promise<string>} - DPoP JKT string
 */
const get_dpop_jkt = async (clientId, state) => {
  try {
    const params = new URLSearchParams({
      clientId,
      state,
    });
    const endpoint = `${BASE_URL}${GET_DPOP_JKT}?${params.toString()}`;
    const response = await axios.get(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response?.data?.dpop_jkt;
  } catch (error) {
    throw new Error("Failed to fetch the DPoP JKT");
  }
};

/**
 * Fetches the Pushed Authorization Request (PAR) request_uri from the relying party server.
 * @param {string} clientId - Registered client ID
 * @param {string} state - Unique state value for the authorization request
 * @param {string} ui_locales - Locale/language preference
 * @returns {Promise<string>} - Request URI (URN format)
 */
const get_requestUri = async (clientId, state, ui_locales, dpop_jkt) => {
  try {
    const params = new URLSearchParams({
      state,
      ui_locales,
      dpop_jkt,
    });
    const endpoint = `${BASE_URL}${GET_REQUEST_URI}/${clientId}?${params.toString()}`;
    const response = await axios.get(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response?.data?.request_uri;
  } catch (error) {
    throw new Error("Failed to fetch request URI");
  }
};

/**
 * Sends an authorization code exchange request to retrieve user information.
 * Typically called after receiving the auth code from the authorization server.
 *
 * @param {string} code - Authorization code received after user consent
 * @param {string} client_id - Registered client ID
 * @param {string} redirect_uri - Redirect URI used during authorization
 * @param {string} grant_type - OAuth 2.0 grant type (usually "authorization_code")
 * @returns {Promise<Object>} - Decoded and decrypted user information as a JSON object
 */
const post_fetchUserInfo = async (
  code,
  state,
  client_id,
  redirect_uri,
  grant_type
) => {
  let request = {
    code: code,
    state: state,
    client_id: client_id,
    redirect_uri: redirect_uri,
    grant_type: grant_type,
  };
  const endpoint = BASE_URL + GET_USER_INFO;
  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const relyingPartyService = {
  post_fetchUserInfo,
  get_requestUri,
  get_dpop_jkt,
};

export default relyingPartyService;
