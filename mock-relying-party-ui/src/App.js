import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import UserProfilePage from "./pages/UserProfile";
import SignUpPage from "./pages/SignUp";
import RegistrationPage from "./pages/Registration";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import langConfigService from "./services/langConfigService";
import BookAppointmentPage from "./pages/BookAppointment";
import Login from './travelPass/pages/auth/Login';
import Navbar from "./travelPass/shared/Navbar";
import MainLayout from "./travelPass/pages/MainLayout";
import TravelPassHomePage from "./travelPass/components/TravelPassHomePage";
import Dashboard from "./travelPass/components/Dashboard";

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
          <Route path={process.env.PUBLIC_URL + "/"} element={<Login langOptions={langOptions} />} />
          {/* <Route path={process.env.PUBLIC_URL + "/signup"} element={<SignUpPage langOptions={langOptions} />} />
          <Route path={process.env.PUBLIC_URL + "/userprofile"} element={<UserProfilePage langOptions={langOptions} />} />
          <Route path={process.env.PUBLIC_URL + "/registration"} element={<RegistrationPage langOptions={langOptions} />} />
          <Route path={process.env.PUBLIC_URL + "/bookappointment"} element={<BookAppointmentPage langOptions={langOptions} />} /> */}

          <Route path="/login" element={<MainLayout> <Login /> </MainLayout>} />
          <Route path="/dashboard" element={<MainLayout> <Dashboard /> </MainLayout>} />

        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-center" hideProgressBar={true} pauseOnHover={false} draggable={false} />
    </div >
  );
}

export default App;
