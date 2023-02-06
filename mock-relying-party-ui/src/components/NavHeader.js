import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";

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
    let lang = langOptions.find((option) => {
      return option.value === i18n.language;
    });
    setSelectedLang(lang);
  }, [langOptions]);

  //Gets fired when changeLanguage got called.
  i18n.on('languageChanged', function (lng) {
    let lang = langOptions.find((option) => {
      return option.value === lng;
    });

    setSelectedLang(lang);
  })


  const navList = [
    { label: "home", url: "#" },
    { label: "polices", url: "#" },
    { label: "registration", url: "#" },
    { label: "gov_circulars", url: "#" },
    { label: "recruitment", url: "#" },
    { label: "about_us", url: "#" },
    { label: "contact_us", url: "#" },
  ];

  return (
    <nav className="bg-white border-gray-500">
      <div className="flex items-center grid grid-cols-3 md:order-2 justify-center mb-2 mt-2">
        <div className="flex items-center justify-center col-start-2">
          <img src="images/doctor_logo.png" className="w-16 h-16 mx-4" />
          <span className="title-font text-3xl text-gray-900 font-medium">
            {t("health_portal")}
          </span>
        </div>
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
      <div className="bg-[#2F8EA3] border-gray-200 px-2 sm:px-4 py-3 rounded">
        <div className="flex items-center">
          <div className="flex w-full justify-evenly space-x-8 text-xl font-medium">
            {navList.map((nav) => {
              return (
                <div key={nav.label}>
                  <a
                    href={window.origin + nav.url}
                    className="text-gray-900 text-white hover:underline"
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
