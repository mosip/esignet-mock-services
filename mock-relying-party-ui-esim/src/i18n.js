import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: window._env_.DEFAULT_LANG,
    debug: false,
    fallbackLng: "en", 
    interpolation: {
      escapeValue: false, 
    },
    backend: {
      loadPath: process.env.PUBLIC_URL + "/locales/{{lng}}.json",
    },
  });

export default i18n;
