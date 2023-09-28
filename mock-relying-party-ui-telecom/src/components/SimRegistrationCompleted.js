import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import clientDetails from "../constants/clientDetails";
import { LoadingStates as states } from "../constants/states";
import LoadingIndicator from "../common/LoadingIndicator";

export default function SimRegistrationCompleted({
  relyingPartyService,
  i18nKeyPrefix = "simRegistrationCompleted",
}) {
  const userInfo_keyname = "user_info";
  const get_rechargeDetails = relyingPartyService.get_rechargeDetails;
  const post_fetchUserInfo = relyingPartyService.post_fetchUserInfo;
  const { t } = useTranslation("translation", {
    keyPrefix: i18nKeyPrefix,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [userInfo, setUserInfo] = useState(null);
  const [status, setStatus] = useState(states.LOADING);
  const [rechargeInfo, setrechargeInfo] = useState([]);

  const navigate = useNavigate();

  const navigateToHome = (errorCode, errorDescription) => {
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
        navigateToHome(errorCode, error_desc);
        return;
      }
      getUserDetails(authCode);
    };
    getSearchParams();
    getRechargeDetails();
  }, []);

  const getRechargeDetails = () => {
    setrechargeInfo(null);
    var rechargeInfo = get_rechargeDetails();
    setrechargeInfo(rechargeInfo);
  };

  const getUserDetails = async (authCode) => {
    setUserInfo(null);
    setStatus(states.LOADING);
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
      localStorage.setItem(userInfo_keyname, JSON.stringify(userInfo));
      setStatus(states.LOADED);
    } catch (errormsg) {
      //Load from local storage
      if (localStorage.getItem(userInfo_keyname)) {
        let userInf = JSON.parse(localStorage.getItem(userInfo_keyname));
        setUserInfo(userInf);
        setStatus(states.LOADED);
      } else {
        navigateToHome("session_expired", "Session Expired");
      }
    }
  };

  const options = [
    { value: 'sign_out', label: t('sign_out') },
  ];


  let el = (
    <>
      {status === states.LOADING && (
        <div className="relative inset-52 flex justify-center items-center">
          <LoadingIndicator size="medium" message={t("loading_msg")} />
        </div>
      )}

      {status === states.LOADED && (
        <>
          <div className="flex items-center grid grid-cols-3 md:order-2 justify-center">
            <div className="flex justify-end col-start-3 mr-3">
              <div className="relative">
                <div className="flex">
                  <img
                    alt={"profile_picture"}
                    className="h-12 w-12 rounded"
                    src={
                      userInfo?.picture
                        ? userInfo.picture
                        : "User-Profile-Icon.png"
                    }
                  />
                  <button
                    className="flex items-center px-4 py-2 text-sm leading-5 font-medium rounded-md text-gray-700 bg-transparent hover:text-gray-500"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <svg
                      className="h-5 w-5 ml-1 text-black"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {" "}
                      <path stroke="none" d="M0 0h24v24H0z" />{" "}
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
                {isOpen && (
                  <div className="origin-top-left absolute ltr:right-0 rtl:left-0 max-w-xs shadow-lg">
                    <div className="flex flex-col px-1 py-1 rounded-md bg-white shadow-xs mt-2">
                      <button
                        className="w-full ltr:text-left rtl:text-right block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                        onClick={(e) => {
                          localStorage.removeItem(userInfo_keyname);
                          navigateToHome("logged_out", "User Logout");
                        }}
                      >
                        {t("sign_out")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1.5fr,1fr] gap-4 rtl:text-right ltr:text-left">
            <div className="w-full bg-[#FFFFFF] mt-8 mb-6 shadow-lg rounded-2xl py-6">
              <span className="font-bold px-4">{t("refuel_your_digital_life")}</span>
              <div className="flex flex-wrap">
                {rechargeInfo?.rechargePacks?.map((rechargePack, index) => (
                  <div
                    className="w-full sm:w-1/2 md:w-full lg:w-1/2 p-2"
                    key={index}
                  >
                    <div className="bg-[#F5F8FF] overflow-auto border rounded-2xl shadow sm:p-4">
                      <div>
                        <div className="ml-3 mr-3">
                          <p className="text-sm text-gray-900 font-bold">
                            {t(rechargePack["mobileData"])}
                          </p>
                          <p className="text-sm text-[#646464]">
                            {t(rechargePack["callsAndMessages"])}
                          </p>
                        </div>
                        <ul className="text-sm text-[#646464] list-disc ml-7 mr-7">
                          {rechargePack.packDescription.map((description, descIndex) => (
                            <li key={descIndex}>{t(description)}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-center border-t my-2 border-gray-300">
                        <a
                          href="#"
                          className="text-sm font-medium text-blue-600 my-0.5"
                        >
                          {t("view_more")}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2">
                <div className="bg-white border border-gray-200 rounded-2xl shadow sm:p-4 py-6">
                  <p className="font-bold">{t("go_for_unlimited_entertainment")}</p>
                  <p className="text-[#646464] text-xs">{t("contents_available")}</p>
                  <div className="pt-2">
                    <a href="#" className="text-[#0050FF] text-sm font-medium">{t("explore")}</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full bg-[#FFFFFF] mt-8 mb-6 shadow-lg rounded-2xl py-6">
              <div className="px-2">
                <div className="font-bold flex justify-center">
                  {t("welcome_msg")} {userInfo?.given_name ?? userInfo?.name}!
                </div>
              </div>
              <div className=" px-3 py-6 flex justify-center">
                <img
                  alt={t("profile_picture")}
                  className="h-20 w-20"
                  src={
                    userInfo?.picture ? userInfo.picture : "User-Profile-Icon.png"
                  }
                />
              </div>
              <div className="p-2 m-8 text-center rounded-md font-medium justify-center primaryTextColor">
                {t("telecom_msg")}
              </div>

              <div className="flex justify-center">
                <button className="bg-gradient-to-r from-[#0050FF] via-[#015AD1] to-[#0244D1] text-white font-semibold py-2 px-2 rounded-md hover:shadow-md transform transition-transform hover:scale-105">
                  {t("initiate_activation")}
                </button>
              </div>

              <hr className="border-t border-gray-300 my-4" />

              <div className={"flex text-center justify-center primaryTextColor"}>
                <span>{t("please_visit_our")}</span>&nbsp;
                <a
                  href="https://docs.esignet.io"
                  className="text-[#0953FA] font-medium"
                >
                  {t("esim_website")}
                </a>
                &nbsp;
                <span>{t("for_next_steps")}</span>
              </div>
            </div>
          </div>
        </>
      )
      }
    </>
  );

  return el;
}
