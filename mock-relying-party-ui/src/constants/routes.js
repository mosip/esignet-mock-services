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

// Landing/Login route
export const ROUTE_LOGIN = process.env.PUBLIC_URL + "/";

// Signup route
export const ROUTE_SIGNUP = process.env.PUBLIC_URL + "/signup";

// User profile route
export const ROUTE_USER_PROFILE = process.env.PUBLIC_URL + "/userprofile";

// Registration form route
export const ROUTE_REGISTRATION = process.env.PUBLIC_URL + "/registration";

// Book appointment route
export const ROUTE_BOOK_APPOINTMENT =
  process.env.PUBLIC_URL + "/bookappointment";
