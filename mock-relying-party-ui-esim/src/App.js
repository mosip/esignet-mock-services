import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import './App.css';
import ROUTES from './constants/routes';

function DirectionWrapper({ children }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
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

            <main className="flex-grow">
              <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.PREPAID} element={<div>Prepaid Page - Coming Soon</div>} />
                <Route path={ROUTES.POSTPAID} element={<div>Postpaid Page - Coming Soon</div>} />
                <Route path={ROUTES.NEW_PLANS} element={<div>New Plans Page - Coming Soon</div>} />
                <Route path={ROUTES.NEW_SIM} element={<div>New SIM Connection Page - Coming Soon</div>} />
                <Route path={ROUTES.HELP} element={<div>Help Page - Coming Soon</div>} />
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