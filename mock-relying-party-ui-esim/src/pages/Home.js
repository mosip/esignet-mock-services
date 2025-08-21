import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clientDetails from "../constants/clientDetails";
import { useExternalScript } from "../hooks/useExternalScript";


function Home() {
  const { t, i18n } = useTranslation();
  //Button changes
  const signInButtonScript = window._env_.SIGN_IN_BUTTON_PLUGIN_URL;
  const state = useExternalScript(signInButtonScript);

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
        labelText: t('hero.cta'),
        width: "100%"
      },
      signInElement: document.getElementById("sign-in-with-esignet"),
    });
  }

  useEffect(() => {
    const handleRender = () => {
      if (state === "ready") {
        renderSignInButton();
      }
    };

    handleRender();
    i18n.on("languageChanged", handleRender);

    return () => {
      i18n.off("languageChanged", handleRender);
    };
  }, [state, i18n]); // The effect will re-run if 'state' or 'i18n' changes.



  return (
    <section
      className="flex items-center justify-between px-16 py-15 pb-12 flex-wrap bg-no-repeat bg-cover bg-top bg-left md:flex-col-reverse md:text-center md:px-5 md:py-10"
      style={{ backgroundImage: "url('/images/dotgrid.svg')" }}
    >
      {/* Left content (text + button) */}
      <div className="flex-1 max-w-1/2 pr-5 mr-8 -translate-x-4 rtl:translate-x-4 rtl:ml-8 rtl:mr-0 md:max-w-full md:p-5 md:m-0 md:transform-none">

        {/* Heading with display font */}
        <h1 className="font-display font-semibold text-[64px] leading-[76px] tracking-[-0.02em] mb-5 md:text-3xl md:leading-snug md:tracking-normal">
          {t('hero.title')}
        </h1>

        {/* Subtitle with body font */}
        <p className="font-body font-normal text-2xl md:text-3xl leading-relaxed tracking-normal text-gray-600 mb-7 md:text-base md:leading-normal">
          {t('hero.subtitle')}
        </p>

        {state === "ready" && <div id="sign-in-with-esignet" ></div>}
      </div>

      {/* Right content (image) */}
      <div className="flex-1 max-w-1/2 flex justify-center ml-8 translate-x-4 rtl:translate-x-0 rtl:justify-start rtl:ml-0 rtl:mr-8 md:max-w-full md:p-5 md:m-0 md:transform-none">
        <img src="/images/sim_image.svg" alt="SIM" className="max-w-[85%] h-auto" />
      </div>
    </section>
  );
}

export default Home;
