// =======================
// API Endpoint Constants
// =======================
// These constants define the endpoints used by the relying party server for authentication and authorization flows (OAuth 2.0 / OpenID Connect).

// Base URL for the relying party server (mock or real, depending on environment)
export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_MOCK_RELYING_PARTY_SERVER_URL
    : window._env_.MOCK_RELYING_PARTY_SERVER_URL;

// Token/UserInfo endpoint: exchanges authorization code for user information
export const GET_USER_INFO = "/fetchUserInfo";

// PAR (Pushed Authorization Request) endpoint: returns request_uri for auth request
export const GET_REQUEST_URI = "/requestUri";

// DPoP (Demonstration of Proof-of-Possession) endpoint: returns JWK thumbprint (jkt)
export const GET_DPOP_JKT = "/dpopJKT";

// =======================
// Route Path Constants
// =======================
// These constants define all the client-side route paths used in the application.
export const ROUTES = {
  LOGIN: process.env.PUBLIC_URL + "/",
  USER_PROFILE: process.env.PUBLIC_URL + "/userprofile",
  PREPAID: process.env.PUBLIC_URL + "/prepaid",
  POSTPAID: process.env.PUBLIC_URL + "/postpaid",
  NEW_PLANS: process.env.PUBLIC_URL + "/newplans",
  NEW_SIM: process.env.PUBLIC_URL + "/newsim",
  HELP: process.env.PUBLIC_URL + "/help",
};
