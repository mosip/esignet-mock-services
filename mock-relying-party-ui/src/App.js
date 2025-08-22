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
import {
  ROUTE_LOGIN,
  ROUTE_SIGNUP,
  ROUTE_USER_PROFILE,
  ROUTE_REGISTRATION,
  ROUTE_BOOK_APPOINTMENT,
} from "./constants/routes";

function App() {
  const { i18n } = useTranslation();
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

  const routes = [
    {
      path: ROUTE_LOGIN,
      element: LoginPage,
    },
    {
      path: ROUTE_SIGNUP,
      element: SignUpPage,
    },
    {
      path: ROUTE_USER_PROFILE,
      element: UserProfilePage,
    },
    {
      path: ROUTE_REGISTRATION,
      element: RegistrationPage,
    },
    {
      path: ROUTE_BOOK_APPOINTMENT,
      element: BookAppointmentPage,
    },
  ];

  return (
    <div dir={dir} className="h-screen">
      <BrowserRouter>
        <Routes>
          {routes.map(({ path, element: Component }) => (
            <Route
              key={path}
              path={process.env.PUBLIC_URL + path}
              element={<Component langOptions={langOptions} />}
            />
          ))}
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        pauseOnHover={false}
        draggable={false}
      />
    </div>
  );
}

export default App;
