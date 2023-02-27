import axios from "axios";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_OIDC_BASE_URL
    : window._env_.OIDC_BASE_URL;

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

  // const endpoint = baseUrl + fetchUserInfoEndPoint;
  // const response = await axios.post(endpoint, request, {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  // return response.data;
  return {
    name: "Nagarjuna Konijeti",
    email: "nagarjuna@gmail.com",
    gender: "Male",
    phone_number: "9876543210",
    birthdate: "13/05/1998",
    address: "Banglore",
    picture:
      "data:image/jpeg;base64,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",
  };
};

const get_claimProvider = async () => {
  // const endpoint = baseUrl + fetchUserInfoEndPoint;
  // const response = await axios.get(endpoint, {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  return {
    claimproviders: [
      {
        vaccinationName: "Covaxin",
        days: 7,
        vaccinationCenter: "AIIMS, Banglore .....",
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

const get_currentMedications = async () => {
  // const endpoint = baseUrl + fetchUserInfoEndPoint;
  // const response = await axios.get(endpoint, {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  return {
    
      medications:[
          {
          tabletName:"Acebutolol 400mg",
          dailyDosage:"2Pill(s) Daily"
          },
          {
              tabletName:"Aluminium Hydroxide (OTC) 320mg",
              dailyDosage:"2Pill(s) Daily"
          },
          {
              tabletName:"Warferin 2mg",
              dailyDosage:"1Pill(s) Daily"
          }
  ]
  
  };
};
const get_messages = async () => {
  // const endpoint = baseUrl + fetchUserInfoEndPoint;
  // const response = await axios.get(endpoint, {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  return {
    
    messages:[
      {
          doctorName:"Dr Alexander Kalish",
          days:"1",
          message:"I have results back from the blood culture we ran to see it"
      },
      {
          doctorName:"Dr Alexander Kalish",
          days:"3",

          message:"could you send your most updated email? so i can send the updated records to you"
      },
      {
          doctorName:"Samantha Kleizar",
          days:"4",

          message:"Just a remainder of your appointment with Dr Alexander Kalish in around"
      },
      {
          doctorName:"Dr Fariz",
          days:"5",

          message:"I have results back from the blood culture we ran to see it"
      }
  ]
  
  };
};
const get_nextAppointment = async () => {
  // const endpoint = baseUrl + fetchUserInfoEndPoint;
  // const response = await axios.get(endpoint, {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  return {
    
    
      appointment:[{
          time:"10:30am - 11:00am 30mins",
          location:"213-219, Darlinghurst Rd, Darlinghurst, NSW 2010",
          doctorName:"Dr Alexander Kalish",
          department:"Endocrinologist"
      }]
  
  
  };
};

const relyingPartyService = { post_fetchUserInfo, get_claimProvider, get_currentMedications,get_messages, get_nextAppointment};

export default relyingPartyService;
