// method to check non-empty and non-null
// values, if present then give default value
const checkEmptyNullValue = (initialValue, defaultValue) =>
  initialValue && initialValue !== "" ? initialValue : defaultValue;

const generateRandomString = (strLength = 16) => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < strLength; i++) {
    const randomInd = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomInd);
  }
  return result;
};

// mandatory parameters
const state = generateRandomString();
const nonce = generateRandomString();
const responseType = "code";
const clientId = window._env_.CLIENT_ID;
const uibaseUrl = window._env_.ESIGNET_UI_BASE_URL;
const authorizeEndpoint = checkEmptyNullValue(
  window._env_.AUTHORIZE_ENDPOINT,
  "/authorize",
);
const scopeUserProfile = checkEmptyNullValue(
  window._env_.SCOPE_USER_PROFILE,
  "openid profile",
);
const scopeRegistration = checkEmptyNullValue(
  window._env_.SCOPE_REGISTRATION,
  "openid profile",
);
const redirect_uri_userprofile = checkEmptyNullValue(
  window._env_.REDIRECT_URI_USER_PROFILE,
  window._env_.REDIRECT_URI,
);
const redirect_uri_registration = checkEmptyNullValue(
  window._env_.REDIRECT_URI_REGISTRATION,
  window._env_.REDIRECT_URI,
);

// optional parameters
const maxAge = window._env_.MAX_AGE;
const acr_values = window._env_.ACRS;
const display = window._env_.DISPLAY;
const prompt = window._env_.PROMPT;
const claimsLocales = window._env_.CLAIMS_LOCALES;
const userProfileClaims = window._env_.CLAIMS_USER_PROFILE;
const registrationClaims = window._env_.CLAIMS_REGISTRATION;
const grantType = window._env_.GRANT_TYPE;

// callback method and its properties for PAR, DPoP and code challenge, if applicable
const par_callback_name = window._env_.PAR_CALLBACK_NAME;
const par_callback_timeout = checkEmptyNullValue(
  window._env_.PAR_CALLBACK_TIMEOUT,
  5000,
);
const dpop_callback_name = window._env_.DPOP_CALLBACK_NAME;
const code_challenge = window._env_.CODE_CHALLENGE;

const claims = {
  userinfo: {
    given_name: {
      essential: true,
    },
    phone_number: {
      essential: false,
    },
    email: {
      essential: true,
    },
    picture: {
      essential: false,
    },
    gender: {
      essential: false,
    },
    birthdate: {
      essential: false,
    },
    address: {
      essential: false,
    },
  },
  id_token: {},
};

const clientDetails = {
  nonce: nonce,
  state: state,
  clientId: clientId,
  scopeUserProfile: scopeUserProfile,
  scopeRegistration: scopeRegistration,
  response_type: responseType,
  redirect_uri_userprofile: redirect_uri_userprofile,
  redirect_uri_registration: redirect_uri_registration,
  display: display,
  prompt: prompt,
  acr_values: acr_values,
  claims_locales: claimsLocales,
  max_age: maxAge,
  grant_type: grantType,
  uibaseUrl: uibaseUrl,
  authorizeEndpoint: authorizeEndpoint,
  userProfileClaims: userProfileClaims ?? encodeURI(JSON.stringify(claims)),
  registrationClaims: registrationClaims ?? encodeURI(JSON.stringify(claims)),
  par_callback_name: par_callback_name,
  par_callback_timeout: par_callback_timeout,
  dpop_callback_name: dpop_callback_name,
  code_challenge: code_challenge,
};

/**
 * Safely parses the raw claims string into a JSON object.
 * @param {string} rawClaims - It is the raw claims string from env-config which needs to be parsed to JSON object and set in the config. This is expected to be a URI encoded JSON string.
 * @returns json object if the rawClaims is a valid JSON string, else returns null. This is to avoid app crash in case of invalid JSON string in env-config for claims.
 */
const safeParseClaims = (rawClaims) => {
  try {
    return JSON.parse(decodeURIComponent(rawClaims));
  } catch {
    return null; // Return null if parsing fails
  }
};

/**
 * Generates the OIDC configuration based on the provided parameters.
 * @param {*} It will be an object having below properties:
 * isRegistration: boolean value to indicate whether the config is for registration or login. Based on this appropriate scope, claims and redirect_uri will be set in the config.
 * ui_locales: it is the locale value to be sent in the oidcConfig for internationalization support in the IDP. This value will be coming from the i18n instance of react-i18next in the Login and Registration components.
 * relyingPartyService: it is the service object which has the callback methods implemented for PAR, DPoP and code challenge. This will be used to get the reference of the callback methods based on the callback method names defined in env-config and set them in oidcConfig.
 * @returns oidcConfig object which will be used in the init method of sign-in-with-esignet to render the sign in button and trigger the authentication flow with IDP on click of the button.
 */
const getOidcConfig = ({
  isRegistration = false,
  ui_locales,
  relyingPartyService,
}) => {
  const parsedUserProfile =
    !isRegistration && userProfileClaims
      ? safeParseClaims(userProfileClaims)
      : null;
  const parsedRegProfile =
    isRegistration && registrationClaims
      ? safeParseClaims(registrationClaims)
      : null;

  const oidcConfig = {
    // mandatory parameters
    authorizeUri: uibaseUrl + authorizeEndpoint,
    redirect_uri: isRegistration
      ? redirect_uri_registration
      : redirect_uri_userprofile,
    client_id: clientId,
    scope: isRegistration ? scopeRegistration : scopeUserProfile,
    // generate new nonce and state for each config generation to ensure uniqueness for each auth request
    nonce: generateRandomString(),
    state: generateRandomString(),
    // optional parameters - only added to config if they have non-empty values in env-config
    ...(acr_values && { acr_values }),
    ...(claimsLocales && { claims_locales: claimsLocales }),
    ...(display && { display }),
    ...(prompt && { prompt }),
    ...(maxAge && { max_age: maxAge }),
    ...(ui_locales && { ui_locales }),
    // userprofile claims
    ...(parsedUserProfile && { claims: parsedUserProfile }),
    // registration claims
    ...(parsedRegProfile && { claims: parsedRegProfile }),
    // callback methods for PAR, DPoP and code challenge, if applicable
    ...(par_callback_name &&
      relyingPartyService?.[par_callback_name] && {
        par_callback: relyingPartyService[par_callback_name],
        par_callback_timeout: par_callback_timeout,
      }),
    ...(dpop_callback_name &&
      relyingPartyService?.[dpop_callback_name] && {
        dpop_callback: relyingPartyService[dpop_callback_name],
      }),
    ...(code_challenge &&
      relyingPartyService?.[code_challenge] && {
        code_challenge: relyingPartyService[code_challenge],
      }),
  };

  return oidcConfig;
};

export { clientDetails, getOidcConfig };
