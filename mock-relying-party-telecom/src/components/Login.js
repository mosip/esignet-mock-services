import { useEffect, useState } from "react";
import { Error } from "../common/Errors";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import clientDetails from "../constants/clientDetails";

export default function Login({ i18nKeyPrefix = "login" }) {
  const { i18n, t } = useTranslation("translation", {
    keyPrefix: i18nKeyPrefix,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSearchParams = async () => {
      let errorCode = searchParams.get("error");
      let error_desc = searchParams.get("error_description");

      if (errorCode) {
        setError({ errorCode: errorCode, errorMsg: error_desc, showToast: true });
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
      redirect_uri: clientDetails.redirect_uri_userprofile,
      client_id: clientDetails.clientId,
      scope: clientDetails.scopeUserProfile,
      nonce: clientDetails.nonce,
      state: clientDetails.state,
      acr_values: clientDetails.acr_values,
      claims_locales: clientDetails.claims_locales,
      display: clientDetails.display,
      prompt: clientDetails.prompt,
      max_age: clientDetails.max_age,
      ui_locales: i18n.language,
      claims: JSON.parse(decodeURI(clientDetails.userProfileClaims)),
    };

    window.SignInWithEsignetButton?.init({
      oidcConfig: oidcConfig,
      buttonConfig: {
        shape: "soft_edges",
        labelText: t("sign_in_with"),
        width: "100%"
      },
      signInElement: document.getElementById("sign-in-with-esignet"),
    });
  }

  const handleLogin = (e) => {
    e.preventDefault();
    setError({
      errorCode: "sign_in_failed",
    });
  };

  return (
    <>
      <div className="w-full text-center">
        <h1 className="mrp-login-header text-center mt-10 mb-7">
          {t("header")}
        </h1>

        <div className="flex justify-center">
          <img className="mrp-login-logo" />
        </div>

        {error && (
          <Error errorCode={error.errorCode} errorMsg={error.errorMsg} showToast={error.showToast} />
        )}

        <div id="sign-in-with-esignet" className="w-full"></div>

      </div>
    </>
  );
}