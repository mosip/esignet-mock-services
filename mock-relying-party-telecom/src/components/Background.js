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
      <section className="flex flex-col h-screen mrp-section-background">
        <NavHeader langOptions={langOptions} />
        <div className="container flex mx-auto px-5 sm:flex-row flex-col">
          <div className="flex justify-center m-10 lg:mt-20 mb:mt-0 lg:w-1/2 md:w-1/2 md:block sm:w-1/2 sm:block hidden w-5/6 mt-20 mb-10 md:mb-0">
            <div>
              <img
                className="mrp-background-logo object-contain rtl:scale-x-[-1]"
                alt={t("background_image_alt")}
              />
            </div>
          </div>
          <div className="rounded-[20px] shadow-lg mt-[60px] pb-4 w-full md:w-3/6 sm:w-1/2 sm:max-w-sm bg-white">
            <div className="flex flex-col flex-grow lg:px-5 md:px-4 sm:px-3 px-3">
              {component}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
