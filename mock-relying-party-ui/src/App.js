import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import langConfigService from "./services/langConfigService";
import Login from './travelPass/pages/auth/Login';
import MainLayout from "./travelPass/pages/MainLayout";
import Dashboard from "./travelPass/components/Dashboard";
import ApplyForTravelPass from "./travelPass/components/ApplyForTravelPass";
import CreateTravelMain from "./travelPass/components/createETravelPass/CreateTravelMain";


import LoginPage from "./pages/Login";
import UserProfilePage from "./pages/UserProfile";
import SignUpPage from "./pages/SignUp";
import RegistrationPage from "./pages/Registration";
import BookAppointmentPage from "./pages/BookAppointment";
import UploadEinvoicePage from "./travelPass/components/createETravelPass/UploadEinvoicePage";
import PreviewDetails from "./travelPass/components/createETravelPass/PreviewDetails";
import CongratulationsPopup from "./travelPass/components/createETravelPass/CongratulationsPopup";

function App() {
  const { i18n } = useTranslation();
  const [langOptions, setLangOptions] = useState([]);
  const [dir, setDir] = useState("ltr");
  const [isTravelPass, setIsTravelPass] = useState(false);

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
        setDir(response.rtlLanguages.includes(i18n.language) ? "rtl" : "ltr");

        //Gets fired when changeLanguage got called.
        i18n.on("languageChanged", function (lng) {
          setDir(response.rtlLanguages.includes(lng) ? "rtl" : "ltr");
        });
      });
    } catch (error) {
      console.error("Failed to load rtl languages!");
    }
  }, []);

  return (
    <div dir={dir} className="h-full">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={process.env.PUBLIC_URL + "/login"} replace />} />
          <Route path={process.env.PUBLIC_URL + "/login"} element={<MainLayout> <Login /> </MainLayout>} />
          <Route path={process.env.PUBLIC_URL + "/dashboard"} element={<MainLayout> <Dashboard /> </MainLayout>} />
          <Route path={process.env.PUBLIC_URL + "/applyForTravelPass"} element={<MainLayout> <ApplyForTravelPass /> </MainLayout>} />
          <Route path={process.env.PUBLIC_URL + "/userprofile"} element={<MainLayout> <CreateTravelMain /> </MainLayout>} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-center" hideProgressBar={true} pauseOnHover={false} draggable={false} />
    </div >
  );
}

export default App;
