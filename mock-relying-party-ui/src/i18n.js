import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";


// Function to extract query parameters from the URL
const getQueryParam = (param) => {
    // getting all query params
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(param);
}

// Extract ui_locales and its value, from the current url
const uiLocales = getQueryParam('ui_locales');

i18n
  // detect available locale files
  .use(Backend)
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    lng: uiLocales ?? window._env_.DEFAULT_LANG,
    debug: false,
    fallbackLng: "en", //window["envConfigs"].defaultLang, //default language
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      loadPath: process.env.PUBLIC_URL + "/locales/{{lng}}.json",
    },
  });

export default i18n;
