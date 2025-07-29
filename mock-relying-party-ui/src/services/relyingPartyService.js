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
const get_requestUri = async (clientId, state, ui_locales) => {
  try {
    const params = new URLSearchParams({
      state,
      ui_locales,
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
  client_id,
  redirect_uri,
  grant_type
) => {
  let request = {
    code: code,
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
};

export default relyingPartyService;
