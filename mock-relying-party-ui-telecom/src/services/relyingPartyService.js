import axios from "axios";
const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_MOCK_RELYING_PARTY_SERVER_URL
    : window._env_.MOCK_RELYING_PARTY_SERVER_URL;
const fetchUserInfoEndPoint = "/fetchUserInfo";
/**
 * Triggers /fetchUserInfo API on relying party server
 * @param {string} code auth code
 * @param {string} client_id registered client id
 * @param {string} redirect_uri validated redirect_uri
 * @param {string} grant_type grant_type
 * @returns decode/decrypted user information json
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
  const endpoint = baseUrl + fetchUserInfoEndPoint;
  const response = await axios.post(endpoint, request, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const get_rechargeDetails= () => {
  return {
    rechargePacks: [
      {
        mobileData: "1.5gb/day",
        callsAndMessages: "unlimited_calls_and_messages",
        packDescription: [
          "best_value_plan",
          "unlimted_calls",
          "surf_internet"
        ],
      },
      {
        mobileData: "2gb/day",
        callsAndMessages: "unlimited_calls_and_messages",
        packDescription: [
          "best_value_plan",
          "unlimted_calls",
          "surf_internet"
        ],
      },
    ],
  };
};
const relyingPartyService = {
  post_fetchUserInfo,
  get_rechargeDetails
};
export default relyingPartyService;