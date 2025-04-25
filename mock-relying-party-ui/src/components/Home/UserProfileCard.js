import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import relyingPartyService from "../../services/relyingPartyService";
import clientDetails from "../../constants/clientDetails";
import { WelcomeBanner } from "./WelcomeBanner";

export const UserProfileCard = () => {
  const userInfo_keyname = "user_info";
  const post_fetchUserInfo = relyingPartyService.post_fetchUserInfo;
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [fetchDone, setFetchDone] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const navigateToLogin = (errorCode, errorDescription) => {
    let params = "?";
    if (errorDescription) {
      params = params + "error_description=" + errorDescription + "&";
    }

    //REQUIRED
    params = params + "error=" + errorCode;
    navigate(process.env.PUBLIC_URL + "/" + params, { replace: true });
  };

  useEffect(() => {
    const getSearchParams = async () => {
      let authCode = searchParams.get("code");
      let errorCode = searchParams.get("error");
      let error_desc = searchParams.get("error_description");
      if (errorCode) {
        navigateToLogin(errorCode, error_desc);
        return;
      }
      getUserDetails(authCode);
    };
    getSearchParams();
  }, []);

  const getUserDetails = async (authCode) => {
    setUserInfo(null);
    try {
      let client_id = clientDetails.clientId;
      let redirect_uri = clientDetails.redirect_uri_userprofile;
      let grant_type = clientDetails.grant_type;
      var userInfo = await post_fetchUserInfo(
        authCode,
        client_id,
        redirect_uri,
        grant_type
      );
      setUserInfo(userInfo);
      setFetchDone(true);
    } catch (errormsg) {
      //Load from local storage
      if (localStorage.getItem(userInfo_keyname)) {
        let userInf = JSON.parse(localStorage.getItem(userInfo_keyname));
        setUserInfo(userInf);
      } else {
        navigateToLogin("session_expired", "Session Expired");
      }
    }
  };
  const servicesRow1 = [
    {
      title: "Register your Child's Birth",
      imageSrc: "child.png",
    },
    {
      title: "Apply for Student Financial Aid (Utopia EduGrant)",
      imageSrc: "student.png",
    },
    {
      title: "Utopia Elderly Care Assistance (UECA)",
      imageSrc: "elderly.png",
    },
  ];
  const servicesRow2 = [
    {
      title: "Register for Health Insurance (Utopia Health Fund - UHF)",
      imageSrc: "doc.png",
    },
    {
      title: "Apply for Adoption Services and Support",
      imageSrc: "fam.png",
    },
  ];

  return (
    <div>
      {fetchDone && (
        <div>
          <WelcomeBanner user={userInfo} />
          <div className="bg-white shadow-sm rounded-3xl py-8 w-[90%] h-[73%] m-auto border-[1.75px] border-[#EBEBEB]">
            <div className="container mx-auto text-center">
              <h1 className="text-3xl font-semibold text-[#181D27] mb-4">
                Government Services - Making Life Easier for Utopians
              </h1>
              <p className="text-[#535862] my-6">
                Access a range of online services from the Government of Utopia
                - Quick, convenient, and hassle-free!
              </p>
              <div className="px-24">
                <hr className={"bg-[#EBEBEB]"} />
              </div>
              <div className="flex justify-evenly my-12">
                {servicesRow1.map((service, index) => (
                  <div
                    key={index}
                    className="w-72 h-52x bg-white rounded-md shadow-md border-[1.5px] border-[#EBEBEB] p-4 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200 hover:cursor-pointer"
                  >
                    <div className="w-28 h-28 rounded-md overflow-hidden mb-2">
                      <img
                        src={require(`../../assets/${service.imageSrc}`)}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 text-center">
                      {service.title}
                    </h3>
                  </div>
                ))}
              </div>
              <div className="flex justify-evenly mt-12 mb-6">
                {servicesRow2.map((service, index) => (
                  <div
                    key={index}
                    className="w-72 h-52x bg-white rounded-md shadow-md border-[1.5px] border-[#EBEBEB] p-4 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200 hover:cursor-pointer"
                  >
                    <div className="w-28 h-28 rounded-md overflow-hidden mb-2">
                      <img
                        src={require(`../../assets/${service.imageSrc}`)}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 text-center">
                      {service.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
