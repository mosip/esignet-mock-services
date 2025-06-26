import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import './App.css';

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
          <div className="page-wrapper">
            <NavHeader />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/prepaid" element={<div>Prepaid Page - Coming Soon</div>} />
              <Route path="/postpaid" element={<div>Postpaid Page - Coming Soon</div>} />
              <Route path="/new-plans" element={<div>New Plans Page - Coming Soon</div>} />
              <Route path="/new-sim" element={<div>New SIM Connection Page - Coming Soon</div>} />
              <Route path="/help" element={<div>Help Page - Coming Soon</div>} />
            </Routes>
            <Footer />
          </div>
        </DirectionWrapper>
      </Router>
    </I18nextProvider>
  );
}

export default App;
