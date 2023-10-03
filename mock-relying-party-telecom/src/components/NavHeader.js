import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";

export default function NavHeader({
  langOptions,
  i18nKeyPrefix = "background",
}) {
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
    { label: "new_sim_connection", url: "#" },
    { label: "explore", url: "#" },
    { label: "help", url: "#" },
  ];

  return (
    <nav className="bg-white border-gray-500 shadow px-2 sm:px-4 py-2">
      <div className="flex justify-between">
        <div className="ltr:sm:ml-8 rtl:sm:mr-8 ltr:ml-1 rtl:mr-1">
          <img className="mrp-brand-logo" />
        </div>
        <div className="flex rtl:sm:ml-8 ltr:sm:mr-8 rtl:ml-1 ltr:mr-1">
          <div className="flex w-full text-xl justify-evenly space-x-8 font-medium">
            {navList.map((nav) => {
              return (
                <div key={nav.label}>
                  <a
                    href={process.env.PUBLIC_URL + nav.url}
                    className="mrp-navbar-header-list"
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
