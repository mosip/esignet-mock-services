import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Error } from "../common/Errors";
import clientDetails from "../constants/clientDetails";
import { LoadingStates as states } from "../constants/states";
import LoadingIndicator from "../common/LoadingIndicator";
import { useTranslation } from "react-i18next";

export default function Registration({
  relyingPartyService,
  i18nKeyPrefix = "registration",
}) {
  const { i18n, t } = useTranslation("translation", {
    keyPrefix: i18nKeyPrefix,
  });

  const { post_fetchUserInfo } = {
    ...relyingPartyService,
  };

  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [userInfo, setUserInfo] = useState(null);
  const [status, setStatus] = useState(states.LOADING);

  useEffect(() => {
    setError(null);
    setStatus(states.LOADING);

    const getSearchParams = async () => {
      let authCode = searchParams.get("code");
      let errorCode = searchParams.get("error");
      let error_desc = searchParams.get("error_description");

      if (errorCode) {
        setError({ errorCode: errorCode, errorMsg: error_desc, showToast: true });
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

    renderSignInButton();

    i18n.on("languageChanged", function (lng) {
      renderSignInButton();
    });
  }, []);

  const renderSignInButton = () => {

    const oidcConfig = {
      authorizeUri: clientDetails.uibaseUrl + clientDetails.authorizeEndpoint,
      redirect_uri: clientDetails.redirect_uri_registration,
      client_id: clientDetails.clientId,
      scope: clientDetails.scopeRegistration,
      nonce: clientDetails.nonce,
      state: clientDetails.state,
      acr_values: clientDetails.acr_values,
      claims_locales: clientDetails.claims_locales,
      display: clientDetails.display,
      prompt: clientDetails.prompt,
      max_age: clientDetails.max_age,
      ui_locales: i18n.language,
      claims: JSON.parse(decodeURI(clientDetails.registrationClaims)),
    };

    window.SignInWithEsignetButton?.init({
      oidcConfig: oidcConfig,
      buttonConfig: {
        labelText: t("register_for_sim"),
        customStyle: {
          outerDivStyleStandard: {
            position: "relative",
            width: "fit-content",
            border: "1px solid #0E3572",
            background: "#0E3572",
            padding: "0.625rem 1.5rem",
            display: "flex",
            "border-radius": "0.375rem",
            "text-decoration": "none",
            color: "white",
            "align-items": "center",
          },
          logoDivStyle: {
            display: "none",
          },
          labelSpanStyle: {
            display: "inline-block",
            "vertical-align": "middle",
            "font-weight": "600",
            "font-size": "0.875rem",
            "line-height": "1.25rem",
          },
        },
      },
      signInElement: document.getElementById("sign-in-with-esignet"),
    });
  }

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
      <div className="w-full shadow-lg rounded-lg bg-white my-5 min-h-fit p-4">
        <h1 className="w-full text-center title-font sm:text-3xl text-3xl my-4 font-medium text-gray-900">
          {t("new_sim")}
        </h1>
        <div className="flex items-center justify-center">
          <img src="images/sim_image.png" alt={t("sim")} className="object-contain rtl:scale-x-[-1]" />
        </div>
        <div id="sign-in-with-esignet" className="flex items-center justify-center"></div>

        <div className="p-4">
          {status === states.LOADING && (
            <LoadingIndicator size="medium" message={t("loading_msg")} />
          )}

          {error && (
            <Error errorCode={error.errorCode} errorMsg={error.errorMsg} showToast={error.showToast}/>
          )}
        </div>
      </div>
    </>
  );
}
