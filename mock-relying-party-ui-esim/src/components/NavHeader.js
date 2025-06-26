import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import langConfigService from '../services/langConfigService';

function NavHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const { t, i18n } = useTranslation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      const config = await langConfigService.getLocaleConfiguration();
      setLanguages(config.languages);
    };
    fetchLanguages();
  }, []);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || {};

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setLanguageDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="nav-left">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <Link to="/">
          <img src="/Images/Logo.svg" alt="Logo" className="logo" />
        </Link>
      </div>

      <div className="nav-right">
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/prepaid">{t('nav.prepaid')}</Link>
          <Link to="/postpaid">{t('nav.postpaid')}</Link>
          <Link to="/new-plans">{t('nav.newPlans')}</Link>
          <Link to="/new-sim">{t('nav.newSim')}</Link>
          <Link to="/help">{t('nav.help')}</Link>
        </nav>

        <div className="language-dropdown-container" ref={dropdownRef}>
          <div className="language-container">
            <img src="/Images/globe.svg" alt="World" className="globe-icon" />
            <button className="language-dropdown-button" onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}>
              {currentLanguage.nativeName}
              <svg className={`dropdown-arrow ${languageDropdownOpen ? 'open' : ''}`} width="10" height="6">
                <path d="M0 0l5 6 5-6H0z" fill="#017DC0"/>
              </svg>
            </button>
          </div>
          {languageDropdownOpen && (
            <div className="language-dropdown-menu">
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`language-option ${currentLanguage.code === language.code ? 'selected' : ''}`}
                  onClick={() => changeLanguage(language.code)}
                >
                  <span className="language-name">{language.nativeName}</span>
                  {currentLanguage.code === language.code && (
                    <svg className="check-icon" width="16" height="16">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" fill="#017DC0"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavHeader;
