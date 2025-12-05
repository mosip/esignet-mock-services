import React, { useState } from "react";
import { useTranslation, Trans } from "react-i18next";

const EsimStepperForm = ({ userInfo, address, onSubmitSuccess }) => {
  const { t } = useTranslation();

  const [expandedStep, setExpandedStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [eid, setEid] = useState("");
  const [confirmEid, setConfirmEid] = useState("");
  const [imei, setImei] = useState("");
  const [confirmImei, setConfirmImei] = useState("");

  const isDeviceValid =
    eid && confirmEid === eid && imei && confirmImei === imei;
  const isPlanSelected = selectedPlan !== null;
  const isFormComplete = isPlanSelected && isDeviceValid;

  const info = [];
  if (userInfo) {
    info.push({
      label: t("personalInfo.fullName"),
      value: userInfo.name || null,
    });
    info.push({
      label: t("personalInfo.mobileNumber"),
      value: userInfo.phone_number || null,
    });
    info.push({
      label: t("personalInfo.email"),
      value: userInfo.email || null,
    });
    info.push({
      label: t("personalInfo.gender"),
      value: userInfo.gender || null,
    });
    info.push({
      label: t("personalInfo.dateOfBirth"),
      value: userInfo.birthdate || null,
    });
    if (address) {
      info.push({ label: t("personalInfo.address"), value: address });
    }
  }

  const toggleStep = (step) => {
    setExpandedStep((prevExpandedStep) =>
      prevExpandedStep === step ? null : step
    );
  };

  const handleNextStep = (nextStep) => {
    setExpandedStep(nextStep);
  };

  const handleSubmit = () => {
    if (isFormComplete && onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  const plans = [
    {
      id: 0,
      data: "1 Gb",
      mins: "100 Mins",
      validity: "7 Days",
      type: "small",
    },
    {
      id: 1,
      data: "2 Gb",
      mins: "120 Mins",
      validity: "15 Days",
      type: "small",
    },
    {
      id: 2,
      data: "5 Gb",
      mins: "200 Mins",
      validity: "30 Days",
      type: "small",
    },
    {
      id: 3,
      data: "10 Gb",
      mins: "300 Mins",
      validity: "60 Days",
      type: "small",
    },
    {
      id: 4,
      data: "15 GB",
      mins: "600 Mins",
      validity: "180 days",
      type: "large",
      label: t("plans.bestValue"),
    },
    {
      id: 5,
      data: "30 GB",
      mins: "750 Mins",
      validity: "365 days",
      type: "large",
      label: t("plans.mostPopular"),
    },
  ];

  return (
    <>
      <div className="mb-6 space-y-4 w-full h-auto lg:max-w-[872px] mx-auto">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`bg-white rounded-[16px] border-[1px] border-[#E2E2E4] overflow-hidden shadow-md transition-all duration-300`}
          >
            <div
              className={`flex items-center justify-between px-4 py-3 cursor-pointer`}
              onClick={() => toggleStep(step)}
            >
              <div className="flex items-start">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#E8F7FF] flex-shrink-0`}
                >
                  <img
                    src={`/images/step-${step}.svg`}
                    alt={`Step ${step}`}
                    className="w-4 h-4"
                  />
                </div>
                <div className={`pl-[9px] font-semibold text-gray-700`}>
                  <div className="font-bold text-sm leading-4 uppercase tracking-[0.16px] text-[#696B6F]">
                    {t("stepper.stepLabel", { step: step })}
                  </div>
                  <div className="mt-1 font-bold text-[15.5px] leading-6 tracking-[-0.16px] text-[#292C31]">
                    {step === 1
                      ? t("stepper.step1.description")
                      : step === 2
                      ? t("stepper.step2.description")
                      : t("stepper.step3.description")}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <img
                  src="/images/drop-menu.svg"
                  alt="Toggle"
                  className={`w-[30px] h-[30px] rounded-full bg-[#E8F7FF] border-[0.63px] transition-transform duration-200 ${
                    expandedStep === step ? "rotate-180" : ""
                  }`}
                  style={{ borderWidth: "0.63px" }}
                />
              </div>
            </div>

            {expandedStep === step && (
              <div className="p-4 w-full h-full">
                {step === 1 && (
                  <>
                    {/* Mobile View */}
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(138px,1fr))] gap-4 mb-6 lg:hidden">
                      {plans.map((plan) => (
                        <label
                          key={plan.id}
                          className={`relative p-3 border cursor-pointer flex flex-col items-start justify-start mx-auto ${
                            plan.type === "small"
                              ? "w-[138px] h-[126px]"
                              : "w-[138px] h-[155px]"
                          } rounded-[12px] border-[1px] ${
                            selectedPlan === plan.id
                              ? "border-blue-600 bg-blue-50"
                              : "border-[#E2E2E4] bg-white"
                          }`}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          {plan.label && plan.type === "large" && (
                            <span
                              className={`absolute w-[137px] h-[27px] top-[-0.2px] left-[-0.5px] text-xs text-white px-2 py-0.5 rounded-tl-[11px] rounded-tr-[11px] bg-gradient-to-r from-[#5E97A1] to-[#01357B] flex items-center justify-center`}
                            >
                              {plan.label}
                            </span>
                          )}
                          <div
                            className={`absolute w-4 h-4 border rounded-full flex items-center justify-center ${
                              plan.type === "small"
                                ? "top-[11px]"
                                : "top-[35px]"
                            } left-3 ${
                              selectedPlan === plan.id
                                ? "border-blue-600 border-[3px]"
                                : "border-gray-400"
                            }`}
                          ></div>
                          <div
                            className={`font-medium text-base leading-6 ${
                              plan.type === "small" ? "pt-6" : "pt-10"
                            }`}
                          >
                            {plan.data}
                          </div>
                          <div className="font-medium text-base leading-6">
                            {plan.mins}
                          </div>
                          <div className="font-normal text-sm leading-normal">
                            {plan.validity}
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="bg-gray-100 mb-4 rounded-[12px] p-4 flex items-start gap-3 border-[1px] border-[#E2E2E4] w-full lg:hidden mx-auto">
                      <img
                        src="/images/info-circle-icon.svg"
                        alt="Info Icon"
                        className="w-5 h-5 mt-0.5"
                      />
                      <p className="text-sm text-gray-700 leading-snug">
                        <strong className="block mb-1">
                          {t("plans.info.title")}
                        </strong>
                        <Trans i18nKey="plans.info.content">
                          All plans have a{" "}
                          <b className="font-semibold">
                            30-day activation period
                          </b>
                          . If you get a plan{" "}
                          <b className="font-semibold">today</b> and don’t
                          activate it until{" "}
                          <b className="font-semibold">1 month</b>, it will be
                          activated automatically.
                        </Trans>
                      </p>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden lg:block">
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        {plans
                          .filter((plan) => plan.type === "small")
                          .map((plan) => (
                            <label
                              key={plan.id}
                              className={`relative p-3 border cursor-pointer flex flex-col items-start justify-start ${"w-[138px] h-[126px] rounded-[12px] border-[1px]"} ${
                                selectedPlan === plan.id
                                  ? "border-blue-600 bg-blue-50"
                                  : "border-[#E2E2E4] bg-white"
                              }`}
                              onClick={() => setSelectedPlan(plan.id)}
                            >
                              <div
                                className={`absolute w-4 h-4 border rounded-full flex items-center justify-center top-[11px] left-3 ${
                                  selectedPlan === plan.id
                                    ? "border-blue-600 border-[3px]"
                                    : "border-gray-400"
                                }`}
                              ></div>
                              <div className="font-medium text-base leading-6 pt-6">
                                {plan.data}
                              </div>
                              <div className="font-medium text-base leading-6">
                                {plan.mins}
                              </div>
                              <div className="font-normal text-sm leading-normal">
                                {plan.validity}
                              </div>
                            </label>
                          ))}

                        <div className="col-span-2 grid grid-cols-2 gap-4">
                          {plans
                            .filter((plan) => plan.type === "large")
                            .map((plan) => (
                              <label
                                key={plan.id}
                                className={`relative p-4 border cursor-pointer flex flex-col items-start justify-start ${"w-[138px] h-[155px] rounded-[12px] border-[1px]"} ${
                                  selectedPlan === plan.id
                                    ? "border-blue-600 bg-blue-50"
                                    : "border-[#E2E2E4] bg-white"
                                }`}
                                onClick={() => setSelectedPlan(plan.id)}
                              >
                                {plan.label && (
                                  <span
                                    className={`absolute w-[137px] h-[27px] top-[-0.2px] left-[-0.5px] text-xs text-white px-2 py-0.5 rounded-tl-[11px] rounded-tr-[11px] bg-gradient-to-r from-[#5E97A1] to-[#01357B] flex items-center justify-center`}
                                  >
                                    {plan.label}
                                  </span>
                                )}
                                <div
                                  className={`absolute w-4 h-4 border rounded-full flex items-center justify-center top-[35px] left-4 ${
                                    selectedPlan === plan.id
                                      ? "border-blue-600 border-[3px]"
                                      : "border-gray-400"
                                  }`}
                                ></div>
                                <div className="font-medium text-base leading-6 pt-10">
                                  {plan.data}
                                </div>
                                <div className="font-medium text-base leading-6">
                                  {plan.mins}
                                </div>
                                <div className="font-normal text-sm leading-normal">
                                  {plan.validity}
                                </div>
                              </label>
                            ))}
                        </div>

                        <div className="col-span-2 bg-gray-100 rounded-[12px] p-4 flex items-start gap-3 border-[1px] border-[#E2E2E4] h-[155px]">
                          <img
                            src="/images/info-circle-icon.svg"
                            alt="Info Icon"
                            className="w-5 h-5 mt-0.5 flex-shrink-0"
                          />
                          <p className="text-sm text-gray-700 leading-snug">
                            <strong className="block mb-1">
                              {t("plans.info.title")}
                            </strong>
                            <Trans i18nKey="plans.info.content">
                              All plans have a{" "}
                              <b className="font-semibold">
                                30-day activation period
                              </b>
                              . If you get a plan{" "}
                              <b className="font-semibold">today</b> and don’t
                              activate it until{" "}
                              <b className="font-semibold">1 month</b>, it will
                              be activated automatically.
                            </Trans>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        className={`w-full h-[48px] lg:w-[381px] border-[1px] rounded-[8px] font-medium ${
                          !isPlanSelected
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 border-[#017DC0] text-white hover:bg-blue-700"
                        }`}
                        onClick={() => handleNextStep(2)}
                        disabled={!isPlanSelected}
                      >
                        {t("common.next")}
                      </button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center mb-1">
                          <label
                            className="block text-sm font-medium text-gray-700"
                            htmlFor="eid"
                          >
                            {t("device.eid")}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative group flex items-center">
                            <img
                              src="/images/info-circle-icon.svg"
                              alt="Info for EID"
                              className="w-4 h-4 ml-1.5 cursor-pointer"
                            />
                            <div
                              className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-max max-w-xs
                                            invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300
                                            bg-gray-100 text-gray-800 rounded-lg p-3 shadow-lg z-10 border border-gray-200"
                            >
                              <h3 className="font-semibold text-base mb-1">
                                {t("device.tooltip.eid.title")}
                              </h3>
                              <p className="text-sm">
                                {t("device.tooltip.eid.description")}
                              </p>
                            </div>
                          </div>
                        </div>
                        <input
                          id="eid"
                          className="w-full p-2 border border-gray-300 rounded-md bg-white h-[44px] lg:w-[489px] rounded-[8px]"
                          placeholder={t("device.eidPlaceholder")}
                          value={eid}
                          onChange={(e) => setEid(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="confirm-eid"
                        >
                          {t("device.confirmEid")}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="confirm-eid"
                          className="w-full p-2 border border-gray-300 rounded-md bg-white h-[44px] lg:w-[489px] rounded-[8px]"
                          placeholder={t("device.eidPlaceholder")}
                          value={confirmEid}
                          onChange={(e) => setConfirmEid(e.target.value)}
                        />
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <label
                            className="block text-sm font-medium text-gray-700"
                            htmlFor="imei"
                          >
                            {t("device.imei")}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative group flex items-center">
                            <img
                              src="/images/info-circle-icon.svg"
                              alt="Info for IMEI"
                              className="w-4 h-4 ml-1.5 cursor-pointer"
                            />
                            <div
                              className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-max max-w-xs
                                            invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300
                                            bg-gray-100 text-gray-800 rounded-lg p-3 shadow-lg z-10 border border-gray-200"
                            >
                              <h3 className="font-semibold text-base mb-1">
                                {t("device.tooltip.imei.title")}
                              </h3>
                              <p className="text-sm">
                                {t("device.tooltip.imei.description")}
                              </p>
                            </div>
                          </div>
                        </div>
                        <input
                          id="imei"
                          className="w-full p-2 border border-gray-300 rounded-md bg-white h-[44px] lg:w-[489px] rounded-[8px]"
                          placeholder={t("device.imeiPlaceholder")}
                          value={imei}
                          onChange={(e) => setImei(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="confirm-imei"
                        >
                          {t("device.confirmImei")}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="confirm-imei"
                          className="w-full p-2 border border-gray-300 rounded-md bg-white h-[44px] lg:w-[489px] rounded-[8px]"
                          placeholder={t("device.imeiPlaceholder")}
                          value={confirmImei}
                          onChange={(e) => setConfirmImei(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={() => handleNextStep(3)}
                        disabled={!isDeviceValid}
                        className={`w-full h-[48px] lg:w-[381px] border-[1px] rounded-[8px] font-medium ${
                          !isDeviceValid
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 border-[#017DC0] text-white hover:bg-blue-700"
                        }`}
                      >
                        {t("common.next")}
                      </button>
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    {!userInfo ? (
                      // Loading indicator
                      <div className="flex flex-col items-center justify-center min-h-[250px] text-gray-500">
                        <svg
                          className="animate-spin h-8 w-8 text-blue-600 mb-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <p className="text-lg font-medium">
                          {t("loading.userDetails", "Loading User Details...")}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 gap-y-4 my-4">
                          {/* Renders the Photo */}
                          {userInfo.picture && (
                            <div className="col-span-1 sm:col-start-2 sm:row-start-1 sm:row-span-2">
                              <div className="flex items-center gap-2">
                                <label className="text-xs sm:text-sm font-medium text-gray-700 block">
                                  {t("personalInfo.photoLabel", "Photo")}
                                </label>
                                <div className="relative group">
                                  <img
                                    src="/images/tick.svg"
                                    alt="Verified Icon"
                                    className="w-4 h-4"
                                  />
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs font-medium rounded py-1 px-2 z-10">
                                    {t("personalInfo.verified", "Verified")}
                                    <svg
                                      className="absolute text-gray-800 h-2 w-full left-0 top-full"
                                      x="0px"
                                      y="0px"
                                      viewBox="0 0 255 255"
                                    >
                                      <polygon
                                        className="fill-current"
                                        points="0,0 127.5,127.5 255,0"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <img
                                src={userInfo.picture}
                                alt={t(
                                  "personalInfo.userPhotoAlt",
                                  "User Photo"
                                )}
                                className="w-32 h-32 rounded-md object-cover border-2 border-gray-200 shadow-md mt-1"
                              />
                            </div>
                          )}

                          {/* Renders all text-based fields */}
                          {info.map((field) => (
                            <div className="col-span-1" key={field.label}>
                              <div className="flex items-center gap-2">
                                <label className="text-xs sm:text-sm font-medium text-gray-700 block">
                                  {field.label}
                                </label>
                                {field.value && (
                                  <div className="relative group">
                                    <img
                                      src="/images/tick.svg"
                                      alt="Verified Icon"
                                      className="w-4 h-4"
                                    />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs font-medium rounded py-1 px-2 z-10">
                                      {t("personalInfo.verified", "Verified")}
                                      <svg
                                        className="absolute text-gray-800 h-2 w-full left-0 top-full"
                                        x="0px"
                                        y="0px"
                                        viewBox="0 0 255 255"
                                      >
                                        <polygon
                                          className="fill-current"
                                          points="0,0 127.5,127.5 255,0"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <input
                                type="text"
                                value={field.value || ""}
                                disabled
                                className="p-3 w-full rounded-md text-gray-600 bg-gray-100 border-gray-300 cursor-not-allowed mt-1"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Submit button */}
                        <div className="flex justify-end mt-6">
                          <button
                            className={`w-full h-[48px] lg:w-[381px] border-[1px] rounded-[8px] font-medium ${
                              !isFormComplete
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 border-[#017DC0] text-white hover:bg-blue-700"
                            }`}
                            onClick={handleSubmit}
                            disabled={!isFormComplete}
                          >
                            {t("common.submit", "Submit")}
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default EsimStepperForm;
