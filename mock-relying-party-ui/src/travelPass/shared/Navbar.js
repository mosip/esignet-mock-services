import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useOutsideClick from '../appUtils/UseOutsideClick';

const languages = {
    en: { code: "en", label: "English" },
    es: { code: "es", label: "Español" },
    fr: { code: "fr", label: "Français" },
};

const Navbar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const { i18n, t } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(languages[i18n.language]);
    const langDropdownRef = useRef(null);
    const navigator = useNavigate();

    useOutsideClick(langDropdownRef, () => setDropdownOpen(false));

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.id);
        setDropdownOpen(!isDropdownOpen);
        setSelectedLanguage(languages[e.target.id]);
    }

    const handleNavOptions = (e) => {
        let id = e.target.id;
        if (id === 'home') {
            navigator('/login');
            localStorage.setItem("isAuthenticated", "false");
        }
        if (id === 'home') {
            navigator('/login');
        }
    };

    return (
        <nav className="w-full bg-[#FFFFFF] md:px-[3%] h-[2rem] sm:h-[4rem] md:h-[4rem] lg:h-[5rem] lg:px-[4%] text-black flex items-center justify-between">
            <img src='images/travel_pass_apply_title.png' />
            <div className="flex space-x-6 text-[#202020] ">
                <div onClick={handleNavOptions} className="flex space-x-6 items-center">
                    <button id='home' className='cursor-pointer font-semibold text-sm lg:text-normal'>Home</button>
                    <button id='help' className='cursor-pointer font-semibold text-sm lg:text-normal'>Help</button>
                    <div className="relative inline-block text-left" ref={langDropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!isDropdownOpen)}
                            className="flex items-center rounded-lg font-semibold cursor-pointer text-sm lg:text-normal"
                        >
                            <img src='images/globe_icon.png' alt='dropdown_icon' className='md:h-[1rem] lg:h-[1.1rem] px-1' />
                            
                            <img src='images/dropdown_icon.png' alt='dropdown_icon' className='h-1.5 px-1 md:h-[0.4rem] lg:h-[0.5rem]' />
                        </button>

                        {isDropdownOpen && (
                            <div className="flex absolute mt-2 w-28 bg-white rounded-lg shadow-lg z-30">
                                <ul className="py-1 duration-200" onClick={handleLanguageChange}>
                                    <li id='en' className="px-4 py-2 hover:bg-gray-100 cursor-pointer">English</li>
                                    <li id='fr' className="px-4 py-2 hover:bg-gray-100 cursor-pointer">French</li>
                                    <li id='ar' className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Arabic</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>


                {/* <NavbarItem label="Home" to="/" />
        <NavbarItem label="About" to="/about" />
        <NavbarItem label="Contact" to="/contact" /> */}
            </div>
        </nav>
    );
};

export default Navbar;
