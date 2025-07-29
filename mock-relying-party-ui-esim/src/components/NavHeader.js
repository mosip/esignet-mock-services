import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import langConfigService from '../services/langConfigService';
import ROUTES from '../constants/routes';

function NavHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [languages, setLanguages] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false); // State for logout popup
  const { t, i18n } = useTranslation();

  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLanguages = async () => {
      const config = await langConfigService.getLocaleConfiguration();
      setLanguages(config.languages);
    };
    fetchLanguages();
  }, []);

  const currentLanguageName = languages[i18n.language] || i18n.language;

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // This function is now the confirmation action for the popup
  const handleConfirmLogout = () => {
    console.log('Logging out...');
    setIsLogoutPopupOpen(false); // Close the popup
    navigate(ROUTES.HOME); // Navigate to home page
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full flex justify-between items-center py-5 px-4 md:px-4 bg-white rtl:flex-row-reverse shadow-md z-50">
        {/* Left Section (LTR) / Right Section (RTL): Menu + Logo */}
        <div className="flex items-center gap-5 order-1 rtl:order-3 md:order-1">
          <button
            id="menu-toggle"
            className="hidden text-2xl bg-none border-none cursor-pointer text-gray-800 md:block"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <img src="/Images/menu.svg" alt="Menu" className="w-8 h-6 max-w-none" />
          </button>

          <Link id="logo-link" to={ROUTES.HOME}>
            <img
              src="/Images/Logo.svg"
              alt="Logo"
              className="h-9 max-w-none md:m-0 rtl:ml-4"
            />
          </Link>
        </div>

        {/* Right Section (LTR) / Left Section (RTL) */}
        <div className="flex items-center gap-5 ml-auto rtl:ml-0 rtl:mr-auto order-2 rtl:order-1 md:order-2">
          {/* Nav Links */}
          <nav className={`
            flex items-center gap-5 rtl:flex-row-reverse
            ${menuOpen ? 'md:flex' : 'md:hidden'}
            md:flex-col md:absolute md:top-16 md:left-0 md:right-0
            md:bg-white md:p-5 md:gap-4 md:shadow-lg md:z-[999]
            md:text-left md:items-start
            rtl:md:flex-col rtl:md:items-start rtl:md:text-left
          `}>
            <Link to={ROUTES.PREPAID} className="no-underline text-black font-medium transition-all duration-200 hover:text-blue-600 hover:font-semibold md:text-base">
              {t('nav.prepaid')}
            </Link>
            <Link to={ROUTES.POSTPAID} className="no-underline text-black font-medium transition-all duration-200 hover:text-blue-600 hover:font-semibold md:text-base">
              {t('nav.postpaid')}
            </Link>
            <Link to={ROUTES.NEW_PLANS} className="no-underline text-black font-medium transition-all duration-200 hover:text-blue-600 hover:font-semibold md:text-base">
              {t('nav.newPlans')}
            </Link>
            <Link to={ROUTES.NEW_SIM} className="no-underline text-black font-medium transition-all duration-200 hover:text-blue-600 hover:font-semibold md:text-base">
              {t('nav.newSim')}
            </Link>
            <Link to={ROUTES.HELP} className="no-underline text-black font-medium transition-all duration-200 hover:text-blue-600 hover:font-semibold md:text-base">
              {t('nav.help')}
            </Link>
          </nav>

          {/* Language Dropdown */}
          <div className="relative inline-block" ref={dropdownRef}>
            <div className="flex items-center gap-1 ml-1 rtl:flex-row-reverse md:ml-0 rtl:mr-0 rtl:gap-1.5">
              <img
                src="/Images/globe.svg"
                alt="World"
                className="w-[21.08px] h-[21.08px] relative -bottom-[2px]"
              />
              <button
                id="language-toggle"
                className="flex items-center gap-1 font-semibold text-base text-gray-800 py-1 border-none rounded bg-transparent cursor-pointer transition-colors duration-200 min-w-20 justify-between pr-6 md:px-3 md:py-2 md:min-w-18"
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              >
                <span>{currentLanguageName}</span>
                <svg
                  className={`transition-transform duration-200 flex-shrink-0 ${languageDropdownOpen ? 'rotate-180' : ''}`}
                  width="10"
                  height="6"
                >
                  <path d="M0 0l5 6 5-6H0z" fill="#017DC0" />
                </svg>
              </button>
            </div>

            {languageDropdownOpen && (
              <div className="absolute top-full -left-15 rtl:right-auto rtl:left-0 bg-white border border-gray-200 rounded-lg shadow-lg min-w-58 z-[1000] mt-1 py-2 md:-right-2.5 md:-left-2.5 md:w-[calc(100%+20px)] before:content-[''] before:absolute before:-top-1.5 before:left-1/2 before:transform before:-translate-x-1/2 before:rotate-45 before:w-3 before:h-3 before:bg-white before:border-l before:border-t before:border-gray-200 before:-z-10">
                {Object.entries(languages).map(([code, name], index, array) => (
                  <button
                    key={code}
                    className={`relative flex items-center justify-between w-full px-4 py-3 border-none bg-none text-left cursor-pointer text-base text-gray-800 transition-colors duration-200 hover:font-semibold hover:text-blue-600
                      md:px-4 md:py-3.5 md:text-lg
                      ${i18n.language === code ? 'font-semibold text-blue-600' : 'font-normal'}`}
                    onClick={() => changeLanguage(code)}
                  >
                    <span className="flex-1 font-normal">{name}</span>
                    {i18n.language === code && (
                      <svg className="flex-shrink-0 ml-2" width="16" height="16">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" fill="#017DC0" />
                      </svg>
                    )}
                    {index !== array.length - 1 && (
                      <span className="absolute bottom-0 left-6 right-6 h-px bg-gray-200"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Logout Button - Only on /userprofile (ROUTES.ESIM) */}
          {location.pathname === ROUTES.ESIM && (
            <button
              onClick={() => setIsLogoutPopupOpen(true)} // Opens the popup
              className="ml-2 text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-3 focus:outline-none"
              aria-label={t('logout.ariaLabel')}
            >
              <img
                src="/Images/logout-desktop-icon.svg"
                alt="Logout Icon Mobile"
                className="h-[40px] block md:hidden"
              />
              <img
                src="/Images/logout-mobile-icon.svg"
                alt="Logout Icon Desktop"
                className="hidden md:block w-[150px] h-[50px]"
              />
            </button>
          )}
        </div>
      </header>
      
      {/* --- Embedded Logout Popup --- */}
      {isLogoutPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('logout.title')}</h2>
            <p className="text-gray-600 mb-6">{t('logout.description')}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsLogoutPopupOpen(false)}
                className="w-full px-6 py-2 rounded-md border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
              >
                {t('logout.cancel')}
              </button>
              <button
                onClick={handleConfirmLogout}
                className="w-full px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                {t('logout.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavHeader;