const state = "eree2311";
const nonce = "ere973eieljznge2311";
const responseType = "code";
const scopeUserProfile = window._env_.SCOPE_USER_PROFILE ?? "openid profile";
const scopeRegistration = window._env_.SCOPE_REGISTRATION ?? "openid profile";
const display = "page";
const prompt = "consent";
const grantType = "authorization_code";
const maxAge = "21";
const claimsLocales = "en";
const code_challenge = window._env_.CODE_CHALLENGE;
const code_challenge_method = window._env_.CODE_CHALLENGE_METHOD;
const authorizeEndpoint = "/authorize";
const clientId = window._env_.CLIENT_ID;
const uibaseUrl = window._env_.ESIGNET_UI_BASE_URL;
const redirect_uri_userprofile =
  window._env_.REDIRECT_URI_USER_PROFILE ?? window._env_.REDIRECT_URI;
const redirect_uri_registration =
  window._env_.REDIRECT_URI_REGISTRATION ?? window._env_.REDIRECT_URI;
const acr_values = window._env_.ACRS;
const userProfileClaims =
  window._env_.CLAIMS_USER_PROFILE;
const registrationClaims =
  window._env_.CLAIMS_REGISTRATION;

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
}

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
  code_challenge: code_challenge,
  code_challenge_method: code_challenge_method,
  max_age: maxAge,
  grant_type: grantType,
  uibaseUrl: uibaseUrl,
  authorizeEndpoint: authorizeEndpoint,
  userProfileClaims: userProfileClaims ?? encodeURI(JSON.stringify(claims)),
  registrationClaims: registrationClaims ?? encodeURI(JSON.stringify(claims))
};

export default clientDetails;
