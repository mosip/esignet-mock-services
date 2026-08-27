import { useEffect, useState } from "react";
import { Error } from "../common/Errors";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { getOidcConfig } from "../constants/clientDetails";
import relyingPartyService from "../services/relyingPartyService";
import { init } from "@mosip/sign-in-with-esignet";

export default function Login({ i18nKeyPrefix = "login" }) {
  const { i18n, t } = useTranslation("translation", {
    keyPrefix: i18nKeyPrefix,
  });

  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSearchParams = async () => {
      const errorCode = searchParams.get("error");
      const error_desc = searchParams.get("error_description");

      if (errorCode) {
        setError({
          errorCode: errorCode,
          errorMsg: error_desc,
          showToast: true,
        });
      }
    };
    getSearchParams();

    renderSignInButton();

    i18n.on("languageChanged", function (lng) {
      renderSignInButton();
    });
  }, []);

  const renderSignInButton = () => {
    const oidcConfig = getOidcConfig({
      isRegistration: false,
      ui_locales: i18n.language,
      relyingPartyService,
    });

    init({
      oidcConfig: oidcConfig,
      buttonConfig: {
        shape: "soft_edges",
        labelText: t("sign_in_with"),
        width: "100%",
      },
      signInElement: document.getElementById("sign-in-with-esignet"),
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError({
      errorCode: "sign_in_failed",
    });
  };

  return (
    <>
      <div className="w-full px-20">
        <h1 className="w-full text-center title-font sm:text-3xl text-3xl mt-8 mb-8 font-medium text-gray-900">
          {t("sign_in_with_health_portal")}
        </h1>

        <div className="w-full flex mb-6 text-slate-500">
          <span
            className="w-11 inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-gray-300 
          ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0"
          >
            <img src="images/username_icon.png" />
          </span>
          <input
            type="text"
            id="user"
            className="rounded-none bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 text-sm border-gray-300 p-2.5
            ltr:rounded-r-lg rtl:rounded-l-lg"
            placeholder={t("username")}
          />
        </div>

        <div className="w-full flex mb-6 text-slate-500">
          <span
            className="w-11 inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 
          ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0"
          >
            <img src="images/password_icon.png" />
          </span>
          <input
            type="password"
            id="password"
            className="rounded-none bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 text-sm border-gray-300 p-2.5
            ltr:rounded-r-lg rtl:rounded-l-lg"
            placeholder={t("password")}
          />
        </div>
        <button
          type="button"
          className="w-full justify-center text-white bg-[#2F8EA3] hover:bg-[#2F8EA3]/90 font-medium rounded-md text-sm px-5 py-2.5 flex items-center mr-2 mb-2 h-11"
          onClick={handleLogin}
        >
          {t("submit")}
        </button>

        {error && (
          <Error
            errorCode={error.errorCode}
            errorMsg={error.errorMsg}
            showToast={error.showToast}
          />
        )}

        <div className="flex w-full mb-6 mt-6 items-center px-10">
          <div className="flex-1 h-px bg-black" />
          <div>
            <p className="w-16 text-center">{t("or")}</p>
          </div>
          <div className="flex-1 h-px bg-black" />
        </div>

        <div id="sign-in-with-esignet" className="w-full"></div>

        <div className="flex flex-justify mt-5 w-full items-center text-center">
          <p className="w-full text-center">
            {t("dont_have_existing_account")}&nbsp;
            <a
              href={process.env.PUBLIC_URL + "/signup"}
              className="text-[#2F8EA3]"
            >
              {t("sign_up_here")}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
