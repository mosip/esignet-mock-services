import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Error } from "../common/Errors";
import clientDetails from "../constants/clientDetails";
import { LoadingStates as states } from "../constants/states";
import LoadingIndicator from "../common/LoadingIndicator";
import { useTranslation } from "react-i18next";

export default function SimRegistrationCompleted({
  relyingPartyService,
  i18nKeyPrefix = "simRegistrationCompleted",
}) {
  const { t } = useTranslation("translation", {
    keyPrefix: i18nKeyPrefix,
  });

  const { post_fetchUserInfo } = {
    ...relyingPartyService,
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState({ errorCode: "", errorMsg: "" });
  const [userInfo, setUserInfo] = useState(null);
  const [status, setStatus] = useState(states.LOADING);

  useEffect(() => {
    const getSearchParams = async () => {
      let authCode = searchParams.get("code");

      if (authCode) {
        const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (storedUserInfo) {
          setUserInfo(storedUserInfo);
          setStatus(states.LOADED);
        } else {
          getUserDetails(authCode);
        }
      } else {
        setError({
          errorCode: "authCode_missing",
        });
        setStatus(states.ERROR);
        return;
      }
    };
    getSearchParams();
  }, []);

  //Handle Login API Integration here
  const getUserDetails = async (authCode) => {
    setError(null);
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

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setUserInfo(userInfo);
      setStatus(states.LOADED);
    } catch (errormsg) {
      setError({ errorCode: "", errorMsg: errormsg.message });
      setStatus(states.ERROR);
    }
  };

  let el = (
    <div className="w-full flex-col bg-[#FFFFFF] mt-8 mb-6 shadow-lg rounded">
      <div className="py-10">
        {status === states.LOADING && (
          <LoadingIndicator size="medium" message={t("loading_msg")} />
        )}
        {status === states.LOADED && (
          <>
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
            <div className="p-2 m-8 text-center rounded-md font-medium justify-center secondaryBackgroundColor secondaryTextColor">
              {t("telecom_msg")}
            </div>
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
          </>
        )}
        {status === states.ERROR && (
          <Error errorCode={error.errorCode} errorMsg={error.errorMsg} />
        )}
      </div>
    </div>
  );

  return el;
}
