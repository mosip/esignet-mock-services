import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import ROUTES from "../constants/routes";


function Home() {
  const { t } = useTranslation();

  return (
    <section
      className="flex items-center justify-between px-16 py-15 pb-12 flex-wrap bg-no-repeat bg-cover bg-top bg-left md:flex-col-reverse md:text-center md:px-5 md:py-10"
      style={{ backgroundImage: "url('/images/Dotgrid.svg')" }}
    >
      {/* Left content (text + button) */}
      <div className="flex-1 max-w-1/2 pr-5 mr-8 -translate-x-4 rtl:translate-x-4 rtl:ml-8 rtl:mr-0 md:max-w-full md:p-5 md:m-0 md:transform-none">
        
        {/* Heading with display font */}
        <h1 className="font-display font-semibold text-[64px] leading-[76px] tracking-[-0.02em] mb-5 md:text-3xl md:leading-snug md:tracking-normal">
          {t('hero.title')}
        </h1>

        {/* Subtitle with body font */}
        <p className="font-body font-normal text-2xl md:text-3xl leading-relaxed tracking-normal text-gray-600 mb-7 md:text-base md:leading-normal">
          {t('hero.subtitle')}
        </p>
        
        <Link to={ROUTES.ESIM}>
        {/* CTA button */}
        <button className="px-6 py-3 bg-blue-600 text-white border-none rounded-md text-base cursor-pointer transition-colors duration-300 hover:bg-blue-700 md:w-full md:text-lg md:py-3.5">
          {t('hero.cta')}
        </button>
        </Link>
      </div>

      {/* Right content (image) */}
      <div className="flex-1 max-w-1/2 flex justify-center ml-8 translate-x-4 rtl:translate-x-0 rtl:justify-start rtl:ml-0 rtl:mr-8 md:max-w-full md:p-5 md:m-0 md:transform-none">
        <img src="/images/sim_image.svg" alt="SIM" className="max-w-[85%] h-auto" />
      </div>
    </section>
  );
}

export default Home;
