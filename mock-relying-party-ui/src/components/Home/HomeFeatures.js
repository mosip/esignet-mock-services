import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clientDetails from "../../constants/clientDetails";
import { useExternalScript } from "../../hooks/useExternalScript";
import { useTranslation } from "react-i18next";

export const HomeFeatures = ({ i18nKeyPrefix = "login" }) => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation("translation", {
    keyPrefix: i18nKeyPrefix,
  });
  const signInButtonScript = window._env_.SIGN_IN_BUTTON_PLUGIN_URL;
  const state = useExternalScript(signInButtonScript);

  useEffect(() => {
    renderSignInButton();

    i18n.on("languageChanged", function (lng) {
      renderSignInButton();
    });
  }, [state]);

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
      claims: JSON.parse(decodeURIComponent(clientDetails.userProfileClaims)),
    };

    window.SignInWithEsignetButton?.init({
      oidcConfig: oidcConfig,
      buttonConfig: {
        shape: "soft_edges",
        labelText: t("sign_in_with"),
        width: "100%",
      },
      signInElement: document.getElementById("sign-in-with-esignet"),
    });
  };
  return (
    <div className="my-28 h-full bg-[url('./assets/bg.svg')] bg-repeat">
      <div className="mx-32 px-4 sm:px-6 lg:px-8">
        <div className="flex">
          <div className="mb-8 lg:mb-0 w-2xl flex-grow">
            <h1 className="font-medium text-gray-900 tracking-tight text-5xl leading-10">
              Access Government Services <br className="hidden sm:block" />
              <span>Anytime, Anywhere</span>
            </h1>
            <p className="mt-4 text-lg font-light text-gray-500">
              The official digital portal to access your coMPASS credentials -
              securely
              <br className="hidden sm:block" />
              download, manage, and access your digital credentials anytime,
              anywhere.
            </p>
            {state === "ready" &&  <button
                id="sign-in-with-esignet"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Log in with eSignet
            </button>}
          </div>
          <div className="w-auto">
            <ul className="space-y-2 font-light text-gray-600">
              <li className="flex items-center">
                <br className="hidden sm:block" />
              </li>
              <li className="flex items-center">
                <br className="hidden sm:block" />
              </li>
              <li className="flex items-center">
                <br className="hidden sm:block" />
              </li>
              <li className="flex items-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                    fill="#DCFAE6"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.7952 9.8534L13.2485 19.0667L10.7152 16.3601C10.2485 15.9201 9.51522 15.8934 8.98188 16.2667C8.46188 16.6534 8.31522 17.3334 8.63522 17.8801L11.6352 22.7601C11.9285 23.2134 12.4352 23.4934 13.0085 23.4934C13.5552 23.4934 14.0752 23.2134 14.3685 22.7601C14.8485 22.1334 24.0085 11.2134 24.0085 11.2134C25.2085 9.98674 23.7552 8.90674 22.7952 9.84007V9.8534Z"
                    fill="#079455"
                  />
                </svg>
                &nbsp;&nbsp;Digital Credentials (coMPASS VC)
              </li>
              <li className="flex items-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                    fill="#DCFAE6"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.7952 9.8534L13.2485 19.0667L10.7152 16.3601C10.2485 15.9201 9.51522 15.8934 8.98188 16.2667C8.46188 16.6534 8.31522 17.3334 8.63522 17.8801L11.6352 22.7601C11.9285 23.2134 12.4352 23.4934 13.0085 23.4934C13.5552 23.4934 14.0752 23.2134 14.3685 22.7601C14.8485 22.1334 24.0085 11.2134 24.0085 11.2134C25.2085 9.98674 23.7552 8.90674 22.7952 9.84007V9.8534Z"
                    fill="#079455"
                  />
                </svg>
                &nbsp;&nbsp;Citizen Services
              </li>
              <li className="flex items-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                    fill="#DCFAE6"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.7952 9.8534L13.2485 19.0667L10.7152 16.3601C10.2485 15.9201 9.51522 15.8934 8.98188 16.2667C8.46188 16.6534 8.31522 17.3334 8.63522 17.8801L11.6352 22.7601C11.9285 23.2134 12.4352 23.4934 13.0085 23.4934C13.5552 23.4934 14.0752 23.2134 14.3685 22.7601C14.8485 22.1334 24.0085 11.2134 24.0085 11.2134C25.2085 9.98674 23.7552 8.90674 22.7952 9.84007V9.8534Z"
                    fill="#079455"
                  />
                </svg>
                &nbsp;&nbsp;Official Document Requests
              </li>
            </ul>
          </div>
        </div>
        <img
          src={require("../../assets/content.png")}
          className="mx-auto w-full pt-20"
        />
      </div>
    </div>
  );
};
