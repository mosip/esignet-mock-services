import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./i18n";
import NavHeader from "./components/NavHeader";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import "./App.css";
import ROUTES from "./constants/routes";

function DirectionWrapper({ children }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return <>{children}</>;
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <DirectionWrapper>
          <div className="flex flex-col min-h-screen">
            <NavHeader />

            <main className="flex-grow pt-[5.2rem]">
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.ESIM} element={<UserProfile />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </DirectionWrapper>
      </Router>
    </I18nextProvider>
  );
}

export default App;
