import { useTranslation } from "react-i18next";
import NavHeader from "./NavHeader";

export default function Background({
  component,
  i18nKeyPrefix = "background",
  langOptions,
}) {
  const { t } = useTranslation("translation", {
    keyPrefix: i18nKeyPrefix,
  });

  return (
    <>
      <section className="flex flex-col h-screen">
        <NavHeader langOptions={langOptions} />
        <div className="flex flex-grow md:flex-row flex-col h-fit backgroundColor">
          <div className="flex flex-col md:w-1/2">
            <div className="h-3/5 mt-5 flex justify-center h-96">
              <img
                alt="util"
                src="images/backgroundImage.png"
              />
            </div>
          </div>
          <div className="lg:flex-grow md:w-1/2 lg:px-24 md:px-16 flex flex-col md:items-start md:text-left">
            {component}
          </div>
        </div>
      </section>
    </>
  );
}
