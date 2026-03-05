import axios from "axios";
import {
  BASE_URL,
  GET_USER_INFO,
  GET_REQUEST_URI,
  GET_DPOP_JKT,
} from "../constants/routes";

/**
 * Base64URL encoding utility for PKCE
 * @param {Uint8Array} buffer - Byte array to encode
 * @returns {string} - Base64URL encoded string
 */
const base64UrlEncode = (buffer) => {
  let binary = '';
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

/**
 * Generates a cryptographically secure code verifier
 * @returns {string} - Base64URL encoded code verifier
 */
const generateCodeVerifier = () => {
  return base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));
};

/**
 * Fetches supported PKCE methods from auth server's .well-known
 * @returns {Promise<string>} - Supported code challenge method (defaults to 'S256')
 */
const get_code_challenge_method = async () => {
  try {
    const baseUrl = window._env_.ESIGNET_UI_BASE_URL;
    const response = await axios.get(`${baseUrl}/.well-known/openid-configuration`);
    const supportedMethods = response.data?.code_challenge_methods_supported || [];
    
    // Default to S256
    if (!supportedMethods || supportedMethods.length === 0) return 'S256';
    
    // If method contains S256, use S256; otherwise fallback to first supported method.
    return supportedMethods.includes('S256') ? 'S256' : supportedMethods[0];
  } catch (error) {
    console.warn('Failed to fetch PKCE methods, defaulting to S256:', error);
    return 'S256';
  }
};

/**
 * Generates PKCE code challenge and stores verifier in sessionStorage
 * @param {string} clientId - Registered client ID
 * @param {string} state - Unique state value
 * @returns {Promise<Object>} - Object with code_challenge and code_challenge_method
 */
const get_code_challenge = async (clientId, state) => {
  const method = await get_code_challenge_method();
  
  if (!method) {
    console.warn('PKCE disabled: no supported method found');
    return null;
  }
  
  const codeVerifier = generateCodeVerifier();
  let codeChallenge;
  
  if (method === 'plain') {
    codeChallenge = codeVerifier;
  } else {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    codeChallenge = base64UrlEncode(new Uint8Array(hashBuffer));
  }
  
  sessionStorage.setItem(`pkce_${clientId}_${state}`, codeVerifier);  
  return {
    code_challenge: codeChallenge,
    code_challenge_method: method
  };
};

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
 * @param {string} dpop_jkt - DPoP JWK thumbprint (optional)
 * @param {string} code_challenge - PKCE code challenge (optional)
 * @param {string} code_challenge_method - PKCE method (optional)
 * @returns {Promise<string>} - Request URI (URN format)
 */
const get_requestUri = async (clientId, state, ui_locales, dpop_jkt, code_challenge, code_challenge_method) => {
  try {
    const params = new URLSearchParams({ state, ui_locales });
    if (dpop_jkt) params.append("dpop_jkt", dpop_jkt);
    if (code_challenge && code_challenge_method) {
      params.append("code_challenge", code_challenge);
      params.append("code_challenge_method", code_challenge_method);
    }
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
 * @param {string} state - State value from authorization request
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
  const request = {
    code,
    state,
    client_id,
    redirect_uri,
    grant_type,
  };
  
  // Retrieve and include code_verifier if it exists in sessionStorage (PKCE enabled)
  const codeVerifier = sessionStorage.getItem(`pkce_${client_id}_${state}`);
  if (codeVerifier) {
    request.code_verifier = codeVerifier;
  }

  const endpoint = BASE_URL + GET_USER_INFO;
  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  if (codeVerifier) {
    sessionStorage.removeItem(`pkce_${client_id}_${state}`);
  }
  
  return response.data;
};

const get_claimProvider = () => {
  return {
    claimproviders: [
      {
        vaccinationName: "covaxin",
        days: 7,
        vaccinationCenter: "aiims_address",
        totalCost: "$234",
      },
      {
        vaccinationName: "hepatitis_a.",
        days: 40,
        vaccinationCenter: "apollo_address",
        totalCost: "$85",
      },
      {
        vaccinationName: "rubella",
        days: 295,
        vaccinationCenter: "urban_address",
        totalCost: "$55",
      },
      {
        vaccinationName: "influenza",
        days: 390,
        vaccinationCenter: "manipal_address",
        totalCost: "$75",
      },
    ],
  };
};

const get_currentMedications = () => {
  return {
    medications: [
      {
        tabletName: "acebutolol_400mg",
        dailyDosage: "dailydosage_2",
      },
      {
        tabletName: "aluminium_hydroxide_(otc)_320mg",
        dailyDosage: "dailydosage_2",
      },
      {
        tabletName: "warfarin_2mg",
        dailyDosage: "dailydoseage_1",
      },
    ],
  };
};

const get_messages = () => {
  return {
    messages: [
      {
        doctorName: "dr_alexander_kalish",
        days: "1",
        message: "dr_alexander_kalish_message_1",
      },
      {
        doctorName: "dr_alexander_kalish",
        days: "3",
        message: "dr_alexander_kalish_message_2",
      },
      {
        doctorName: "samantha_kleizar",
        days: "4",
        message: "samantha_kleizar_message_1",
      },
      {
        doctorName: "dr_fariz",
        days: "5",
        message: "dr_fariz_message_1",
      },
    ],
  };
};

const get_nextAppointment = () => {
  return {
    appointment: [
      {
        time: "10:30am - 11:00am 30mins",
        location: "appointment_location",
        doctorName: "dr_alexander_kalish",
        department: "endocrin",
      },
    ],
  };
};

const relyingPartyService = {
  post_fetchUserInfo,
  get_claimProvider,
  get_currentMedications,
  get_messages,
  get_nextAppointment,
  get_requestUri,
  get_dpop_jkt,
  get_code_challenge,
  get_code_challenge_method
};

export default relyingPartyService;
