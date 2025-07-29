import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import StepperHeader from "../components/EsimStepperForm";
import SuccessScreen from "../components/SuccessScreen";

function UserProfile() {
  const { t } = useTranslation();

  const images = [
    "/images/step1-graphic.svg",
    "/images/step2-graphic.svg",
    "/images/step3-graphic.svg"
  ];

  const texts = [
    {
      title: t('userProfile.carousel.item1.title'),
      lines: [t('userProfile.carousel.item1.description')]
    },
    {
      title: t('userProfile.carousel.item2.title'),
      lines: [t('userProfile.carousel.item2.description')]
    },
    {
      title: t('userProfile.carousel.item3.title'),
      lines: [t('userProfile.carousel.item3.description')]
    }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleFormSuccess = () => {
    setFormSubmitted(true);
  };

  return (
    <>
      {!formSubmitted ? (
        <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 -mx-5 lg:-mx-16">
          {/* Left rotating image section */}
          <div className="hidden lg:block lg:w-[45%] bg-gradient-to-br from-blue-100 to-blue-300 relative overflow-hidden">
            <img
              src="/images/bg-static.svg"
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Wrap image and text in flex-col for spacing */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              {/* Image */}
              <img
                src={images[currentImageIndex]}
                alt={`Step ${currentImageIndex + 1}`}
                className="w-2/3 h-auto"
              />

              {/* Dynamic text with gap and left alignment */}
              <div className="mt-12 text-white px-6 z-20 max-w-[361px] text-left">
                <h2 className="font-display font-semibold text-xl md:text-2xl leading-tight mb-3 text-white w-full">
                  {texts[currentImageIndex].title}
                </h2>
                {texts[currentImageIndex].lines.map((line, i) => (
                  <p
                    key={i}
                    className="font-body font-medium italic text-sm md:text-base leading-snug mb-2 text-white"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Container for Arrows and Dots at the bottom */}
            <div className="absolute bottom-4 w-full flex items-center justify-between px-12 z-20">
              {/* Left Arrow */}
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
                }
                className="p-1.5 rounded-full z-20 hover:bg-white/20 transition-colors text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
                  <path
                    fillRule="evenodd"
                    d="M12.78 15.28a.75.75 0 01-1.06 0L6.22 10l5.5-5.28a.75.75 0 011.06 1.06L8.56 10l4.22 4.22a.75.75 0 010 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dots Container */}
              <div className="flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      currentImageIndex === index ? "bg-white" : "bg-white/50 hover:bg-white/70"
                    }`}
                  ></button>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) => (prev + 1) % images.length)
                }
                className="p-1.5 rounded-full z-20 hover:bg-white/20 transition-colors text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
                  <path
                    fillRule="evenodd"
                    d="M7.22 4.72a.75.75 0 011.06 0L13.78 10l-5.5 5.28a.75.75 0 01-1.06-1.06L11.44 10 7.22 5.78a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right stepper form content */}
          <div className="w-full lg:flex-grow px-4 py-6 lg:px-10 lg:py-10">
            <StepperHeader onSubmitSuccess={handleFormSuccess} />
          </div>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center bg-slate-50 px-4">
          <SuccessScreen />
        </div>
      )}
    </>
  );
}

export default UserProfile;