import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import UserProfilePage from "./pages/UserProfile";
import SignUpPage from "./pages/SignUp";
import RegistrationPage from "./pages/Registration";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import langConfigService from "./services/langConfigService";

function App() {
  const { i18n } = useTranslation();

  const [rtlLangs, setRtlLangs] = useState([]);
  const [langOptions, setLangOptions] = useState([]);
  const [dir, setDir] = useState("ltr");

  //Loading rtlLangs
  useEffect(() => {
    try {
      langConfigService.getLocaleConfiguration().then((response) => {
        let lookup = {};
        let supportedLanguages = response.languages;
        let langData = [];
        for (let lang in supportedLanguages) {
          //check to avoid duplication language labels
          if (!(supportedLanguages[lang] in lookup)) {
            lookup[supportedLanguages[lang]] = 1;
            langData.push({
              label: supportedLanguages[lang],
              value: lang,
            });
          }
        }
        setLangOptions(langData);
        setRtlLangs(response.rtlLanguages);
        setDir(response.rtlLanguages.includes(i18n.language) ? "rtl" : "ltr")
      });
    } catch (error) {
      console.error("Failed to load rtl languages!");
    }
  }, []);

  //Gets fired when changeLanguage got called.
  i18n.on('languageChanged', function (lng) {
    setDir(rtlLangs.includes(lng) ? "rtl" : "ltr")
  })


  return (
    <div dir={dir} className="h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage langOptions={langOptions} />} />
          <Route path="/signup" element={<SignUpPage langOptions={langOptions} />} />
          <Route path="/userprofile" element={<UserProfilePage langOptions={langOptions} />} />
          <Route path="/registration" element={<RegistrationPage langOptions={langOptions} />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-center" hideProgressBar={true} pauseOnHover={false} draggable={false} />
    </div>
  );
}

export default App;
