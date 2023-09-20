import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import themes from "../components/theme.json"

export default function NavHeader({ langOptions, i18nKeyPrefix = "background" }) {
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: i18nKeyPrefix,
  });
  const [selectedLang, setSelectedLang] = useState();


  const changeLanguageHandler = (e) => {
    i18n.changeLanguage(e.value);
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      border: 0,
      boxShadow: "none",
    }),
  };

  useEffect(() => {
    if (!langOptions || langOptions.length === 0) {
      return;
    }

    let lang = langOptions.find((option) => {
      return option.value === i18n.language;
    });
    setSelectedLang(lang);
    //Gets fired when changeLanguage got called.
    i18n.on("languageChanged", function (lng) {
      let lang = langOptions.find((option) => {
        return option.value === lng;
      });
      setSelectedLang(lang);
    });
  }, [langOptions]);

  const navList = [
    { label: "prepaid", url: "#" },
    { label: "postpaid", url: "#" },
    { label: "new_sim_connection", url: "/sim-register" },
    { label: "explore", url: "#" },
    { label: "help", url: "#" },
  ];

  const telecomLogo = process.env.REACT_APP_TELECOM_LOGO_URL;

  return (
    <nav className="bg-white border-gray-500">
      <div className="flex items-center grid grid-cols-3 md:order-2 justify-center mb-2 mt-2">
        <div className="flex justify-end col-start-3 mr-3">
          <img src="images/language_icon.png" alt={t("language")} className="mr-2" />
          <Select
            styles={customStyles}
            isSearchable={false}
            className="appearance-none"
            value={selectedLang}
            options={langOptions}
            placeholder="Language"
            onChange={changeLanguageHandler}
          />
        </div>
      </div>
      <div className="bg-[#FFFFFF] shadow-lg border-[#707070] px-2 sm:px-4 py-3">
        <div className="flex items-center">
          <img src={themes.images.telecomLogo} alt={t("fastline")} className="ml-8 mr-8" />
          <div className="flex w-full justify-end space-x-8 ml-8 mr-8 text-xl font-medium">
            {navList.map((nav) => {
              return (
                <div key={nav.label}>
                  <a
                    href={process.env.PUBLIC_URL + nav.url}
                    className="text-[#1C1C1C] hover:text-[#014AE7]"
                    aria-current="page"
                  >
                    {t(nav.label)}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
