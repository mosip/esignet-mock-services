import { useTranslation } from "react-i18next";

function SuccessScreen() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center bg-slate-50 px-4">
      <div className="relative w-full max-w-[600px] h-[626px] bg-white rounded-[20px] shadow-xl flex flex-col items-center overflow-hidden">
        {/* Top Green Bar */}
        <div className="w-full h-[12px] bg-[#6ABA3F] rounded-t-[20px]" />

        {/* Content */}
        <div className="flex flex-col items-center justify-start flex-grow px-6 sm:px-10 pt-10 text-center">
          {/* Image */}
          <div className="w-[220px] sm:w-[256px] h-[220px] sm:h-[258px] mb-6">
            <img
              src="/Images/container.svg"
              alt="Success"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Heading */}
          <h2 className="font-montserrat font-semibold text-[24px] sm:text-[32px] text-gray-800 leading-[100%] mb-4">
            {t('success.title')}
          </h2>

          {/* Subtext */}
          <div className="max-w-[400px] space-y-4 px-1">
            <p className="font-montserrat font-medium text-[16px] sm:text-[18px] text-gray-600 leading-[100%]">
              {t('success.line1')}
            </p>
            <p className="font-montserrat font-medium text-[16px] sm:text-[18px] text-gray-600 leading-[100%]">
              {t('success.line2')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessScreen;