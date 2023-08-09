import { useEffect, useState } from "react";
import { Error } from "../common/Errors";
import { useTranslation } from "react-i18next";
import RedirectButton from "../common/RedirectButton";
import { useSearchParams } from "react-router-dom";

export default function Login({ clientService, i18nKeyPrefix = "login" }) {
  const { t } = useTranslation("translation", {
    keyPrefix: i18nKeyPrefix,
  });

  const { getURIforSignIn } = {
    ...clientService,
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const uri_UI = getURIforSignIn();

  useEffect(() => {
    const getSearchParams = async () => {
      let errorCode = searchParams.get("error");
      let error_desc = searchParams.get("error_description");

      if (errorCode) {
        setError({ errorCode: errorCode, errorMsg: error_desc, showToast: true });
      }
    };
    getSearchParams();
  }, []);

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
          <span className="w-11 inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-gray-300 
          ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0">
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
          <span className="w-11 inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 
          ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0">
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
          className="w-full justify-center text-white bg-[#2F8EA3] hover:bg-[#2F8EA3]/90 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center mr-2 mb-2"
          onClick={handleLogin}
        >
          {t("submit")}
        </button>

        {error && (
          <Error errorCode={error.errorCode} errorMsg={error.errorMsg} showToast={error.showToast} />
        )}

        <div className="flex w-full mb-6 mt-6 items-center px-10">
          <div className="flex-1 h-px bg-black" />
          <div>
            <p className="w-16 text-center">{t("or")}</p>
          </div>
          <div className="flex-1 h-px bg-black" />
        </div>
        <RedirectButton
          redirectURL={uri_UI}
          text={t("sign_in_with")}
          logoPath="esignet_logo.png"
        />
        <div className="flex flex-justify mt-5 w-full items-center text-center">
          <p className="w-full text-center">
            {t("dont_have_existing_account")}&nbsp;
            <a href={process.env.PUBLIC_URL + "/signup"} className="text-[#2F8EA3]">
              {t("sign_up_here")}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}