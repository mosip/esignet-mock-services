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
const get_claimProvider = () => {
  return {
    claimproviders: [
      {
        vaccinationName: "Covaxin",
        days: 7,
        vaccinationCenter: "AIIMS, Banglore.....",
        totalCost: "$234",
      },
      {
        vaccinationName: "Hepatitis A.",
        days: 40,
        vaccinationCenter: "Apollo, Apollo  HSR Layout.....",
        totalCost: "$85",
      },
      {
        vaccinationName: "Rubella",
        days: 295,
        vaccinationCenter: "Urban Health care, NRH....",
        totalCost: "$55",
      },
      {
        vaccinationName: "Influenza",
        days: 390,
        vaccinationCenter: "Manipal Hospital, Sarjapur.....",
        totalCost: "$75",
      },
    ],
  };
};
const get_currentMedications =  () => {
  return {
    medications: [
      {
        tabletName: "Acebutolol 400mg",
        dailyDosage: "2Pill(s) Daily",
      },
      {
        tabletName: "Aluminium Hydroxide (OTC) 320mg",
        dailyDosage: "2Pill(s) Daily",
      },
      {
        tabletName: "Warferin 2mg",
        dailyDosage: "1Pill(s) Daily",
      },
    ],
  };
};
const get_messages =  () => {
  return {
    messages: [
      {
        doctorName: "Dr Alexander Kalish",
        days: "1",
        message: "I have results back from the blood culture we ran to see it",
      },
      {
        doctorName: "Dr Alexander Kalish",
        days: "3",
        message:
          "could you send your most updated email? so i can send the updated records to you",
      },
      {
        doctorName: "Samantha Kleizar",
        days: "4",
        message:
          "Just a remainder of your appointment with Dr Alexander Kalish in around",
      },
      {
        doctorName: "Dr Fariz",
        days: "5",
        message: "I have results back from the blood culture we ran to see it",
      },
    ],
  };
};
const get_nextAppointment =  () => {
  return {
    appointment: [
      {
        time: "10:30am - 11:00am 30mins",
        location: "213-219, Darlinghurst Rd, Darlinghurst, NSW 2010",
        doctorName: "Dr Alexander Kalish",
        department: "Endocrinologist",
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
};
export default relyingPartyService;