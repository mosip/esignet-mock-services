import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Error } from "../common/Errors";
import clientDetails from "../constants/clientDetails";
import { LoadingStates as states } from "../constants/states";
import LoadingIndicator from "../common/LoadingIndicator";
import { useTranslation } from "react-i18next";
import RedirectButton from "../common/RedirectButton";

export default function Registration({
  clientService,
  relyingPartyService,
  i18nKeyPrefix = "registration",
}) {
  const { t } = useTranslation("translation", {
    keyPrefix: i18nKeyPrefix,
  });

  const { getURIforRegistration } = {
    ...clientService,
  };

  const { post_fetchUserInfo } = {
    ...relyingPartyService,
  };

  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [userInfo, setUserInfo] = useState(null);
  const [status, setStatus] = useState(states.LOADING);
  const uri_UI = getURIforRegistration();

  const handleLogin = (e) => {
    e.preventDefault();
    setError({
      errorCode: "invalid_details",
    });
  };

  useEffect(() => {
    setError(null);
    setStatus(states.LOADING);

    const getSearchParams = async () => {
      let authCode = searchParams.get("code");
      let errorCode = searchParams.get("error");
      let error_desc = searchParams.get("error_description");

      if (errorCode) {
        setError({ errorCode: errorCode, errorMsg: error_desc });
        setStatus(states.ERROR);
        return;
      }

      if (authCode) {
        getUserDetails(authCode);
      } else {
        setStatus(states.LOADED);
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
      let redirect_uri = clientDetails.redirect_uri_registration;
      let grant_type = clientDetails.grant_type;

      var userInfo = await post_fetchUserInfo(
        authCode,
        client_id,
        redirect_uri,
        grant_type
      );
      setUserInfo(userInfo);
      setStatus(states.LOADED);
    } catch (errormsg) {
      setError({ errorCode: "", errorMsg: errormsg.message });
      setStatus(states.ERROR);
    }
  };

  return (
    <>
      <div className="w-full px-16">
        <h1 className="w-full text-center title-font sm:text-3xl text-3xl mt-8 mb-8 font-medium text-gray-900">
          {t("child_registration")}
        </h1>

        <div className="flex grid grid-cols-2 gap-2 w-full">
          <div className="w-full flex flex-col mb-6 text-slate-500">
            <label className="flex">{t("full_name")}</label>
            <input
              type="text"
              value={userInfo?.given_name ?? userInfo?.name}
              className="rounded bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 text-sm border-gray-300 p-2.5"
            />
          </div>
          <div className="w-full flex flex-col mb-6 text-slate-500">
            <label className="flex">{t("gender")}</label>
            <input
              type="text"
              value={userInfo?.gender}
              className="rounded bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 text-sm border-gray-300 p-2.5"
            />
          </div>
        </div>
        <div className="flex grid grid-cols-2 gap-2 w-full">
          <div className="w-full flex flex-col mb-6 text-slate-500">
            <label className="flex">{t("date_of_birth")}</label>
            <input
              type="text"
              value={userInfo?.birthdate}
              className="rounded bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 text-sm border-gray-300 p-2.5"
            />
          </div>
          <div className="w-full flex flex-col mb-6 text-slate-500">
            <label className="flex">{t("phone_number")}</label>
            <input
              type="text"
              className="rounded bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 text-sm border-gray-300 p-2.5"
              value={userInfo?.phone_number_verified ??
                userInfo?.phone ??
                userInfo?.phone_number}
            />
          </div>
        </div>
        <div className="w-full flex flex-col mb-6 text-slate-500">
          <label className="flex">{t("address")}</label>
          <input
            type="text"
            value={userInfo?.address}
            className="rounded bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 text-sm border-gray-300 p-2.5"
          />
        </div>


        <div className="">
          <button
            type="button"
            className="w-full justify-center text-white bg-[#2F8EA3] hover:bg-[#2F8EA3]/90 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center mr-2 mb-2"
            onClick={handleLogin}
          >
            {t("register")}
          </button>
          <RedirectButton
            redirectURL={uri_UI}
            text={t("fetch_details")}
            logoPath="esignet_logo.png"
          />
        </div>

        {status === states.LOADING && (
          <LoadingIndicator size="medium" message={t("loading_msg")} />
        )}

        {error && (
          <Error errorCode={error.errorCode} errorMsg={error.errorMsg} />
        )}
      </div>
    </>
  );
}
