import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';

const EsimStepperForm = ({ onSubmitSuccess }) => {
  const { t } = useTranslation();

  const [expandedStep, setExpandedStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [eid, setEid] = useState('');
  const [confirmEid, setConfirmEid] = useState('');
  const [imei, setImei] = useState('');
  const [confirmImei, setConfirmImei] = useState('');

  const isDeviceValid = eid && confirmEid === eid && imei && confirmImei === imei;
  const isPlanSelected = selectedPlan !== null;
  const isFormComplete = isPlanSelected && isDeviceValid;

  const info = [
    { label: t('personalInfo.fullName'), value: 'Mathew Thompson' },
    { label: t('personalInfo.mobileNumber'), value: '+919876543210' },
    { label: t('personalInfo.email'), value: 'mathewthompson@gmail.com' },
    { label: t('personalInfo.gender'), value: 'Male' },
    { label: t('personalInfo.dateOfBirth'), value: '30/09/1998' },
    { label: t('personalInfo.address'), value: '#491, Sector 8A, Chandigarh, a very long address to test truncation' },
  ];

  const toggleStep = (step) => {
    setExpandedStep(prevExpandedStep => prevExpandedStep === step ? null : step);
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
    { id: 0, data: '1 Gb', mins: '100 Mins', validity: '7 Days', type: 'small' },
    { id: 1, data: '2 Gb', mins: '120 Mins', validity: '15 Days', type: 'small' },
    { id: 2, data: '5 Gb', mins: '200 Mins', validity: '30 Days', type: 'small' },
    { id: 3, data: '10 Gb', mins: '300 Mins', validity: '60 Days', type: 'small' },
    { id: 4, data: '15 GB', mins: '600 Mins', validity: '180 days', type: 'large', label: t('plans.bestValue') },
    { id: 5, data: '30 GB', mins: '750 Mins', validity: '365 days', type: 'large', label: t('plans.mostPopular') },
  ];

  return (
    <>
      <div
        className="mb-6 space-y-4 w-full h-auto lg:max-w-[872px] mx-auto"
      >
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
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#E8F7FF] flex-shrink-0`}>
                  <img src={`/images/step-${step}.svg`} alt={`Step ${step}`} className="w-4 h-4" />
                </div>
                <div className={`pl-[9px] font-semibold text-gray-700`}>
                  <div className="font-semibold w-[137px] h-4 leading-4">{t('stepper.stepLabel', { step: step })}</div>
                  <div className="text-sm font-normal mt-1 leading-6">
                    {step === 1 ? t('stepper.step1.description') : step === 2 ? t('stepper.step2.description') : t('stepper.step3.description')}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <img
                  src="/Images/drop-menu.svg"
                  alt="Toggle"
                  className={`w-[30px] h-[30px] rounded-full bg-[#E8F7FF] border-[0.63px] border-[#292C31] transition-transform duration-200 ${expandedStep === step ? 'rotate-180' : ''}`}
                  style={{ borderWidth: '0.63px' }}
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
                          className={`relative p-3 border rounded-md cursor-pointer flex flex-col items-start justify-start mx-auto ${
                            plan.type === 'small' ? 'w-[138px] h-[126px]' : 'w-[138px] h-[155px]'
                          } rounded-[12px] border-[1px] ${
                            selectedPlan === plan.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-[#E2E2E4] bg-white'
                          }`}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          {plan.label && (plan.type === 'large') && (
                            <span className={`absolute w-[137px] h-[27px] top-[1px] left-[1px] text-xs text-white px-2 py-0.5 rounded-tl-[11px] rounded-tr-[11px] bg-gradient-to-r from-[#5E97A1] to-[#01357B] flex items-center justify-center`}>
                              {plan.label}
                            </span>
                          )}
                          <div className={`absolute w-4 h-4 border rounded-full flex items-center justify-center ${plan.type === 'small' ? 'top-[11px]' : 'top-[35px]'} left-3 ${selectedPlan === plan.id ? 'border-blue-600 border-[3px]' : 'border-gray-400'}`}>
                          </div>
                          <div className={`font-medium text-base leading-6 ${plan.type === 'small' ? 'pt-6' : 'pt-10'}`}>{plan.data}</div>
                          <div className="font-medium text-base leading-6">{plan.mins}</div>
                          <div className="font-normal text-sm leading-normal">{plan.validity}</div>
                        </label>
                      ))}
                    </div>
                    <div className="bg-gray-100 rounded-[12px] p-4 flex items-start gap-3 border-[1px] border-[#E2E2E4] w-full lg:hidden mx-auto">
                      <img src="/Images/info-circle-icon.svg" alt="Info Icon" className="w-5 h-5 mt-0.5" />
                      <p className="text-sm text-gray-700 leading-snug">
                          <strong className="block mb-1">{t('plans.info.title')}</strong>
                          <Trans i18nKey="plans.info.content">
                            All plans have a <b className="font-semibold">30-day activation period</b>. If you get a plan <b className="font-semibold">today</b> and don’t activate it until <b className="font-semibold">1 month</b>, it will be activated automatically.
                          </Trans>
                      </p>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden lg:block">
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        {plans.filter(plan => plan.type === 'small').map((plan) => (
                          <label
                            key={plan.id}
                            className={`relative p-3 border rounded-md cursor-pointer flex flex-col items-start justify-start ${
                              'w-[138px] h-[126px] rounded-[12px] border-[1px]'
                            } ${
                              selectedPlan === plan.id
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-[#E2E2E4] bg-white'
                            }`}
                            onClick={() => setSelectedPlan(plan.id)}
                          >
                            <div className={`absolute w-4 h-4 border rounded-full flex items-center justify-center top-[11px] left-3 ${selectedPlan === plan.id ? 'border-blue-600 border-[3px]' : 'border-gray-400'}`}>
                            </div>
                            <div className="font-medium text-base leading-6 pt-6">{plan.data}</div>
                            <div className="font-medium text-base leading-6">{plan.mins}</div>
                            <div className="font-normal text-sm leading-normal">{plan.validity}</div>
                          </label>
                        ))}
                        
                        <div className="col-span-2 grid grid-cols-2 gap-4">
                          {plans.filter(plan => plan.type === 'large').map((plan) => (
                            <label
                              key={plan.id}
                              className={`relative p-4 border rounded-md cursor-pointer flex flex-col items-start justify-start ${
                                'w-[138px] h-[155px] rounded-[12px] border-[1px]'
                              } ${
                                selectedPlan === plan.id
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-[#E2E2E4] bg-white'
                              }`}
                              onClick={() => setSelectedPlan(plan.id)}
                            >
                              {plan.label && (
                                <span className={`absolute w-[137px] h-[27px] top-[1px] left-[1px] text-xs text-white px-2 py-0.5 rounded-tl-[11px] rounded-tr-[11px] bg-gradient-to-r from-[#5E97A1] to-[#01357B] flex items-center justify-center`}>
                                  {plan.label}
                                </span>
                              )}
                              <div className={`absolute w-4 h-4 border rounded-full flex items-center justify-center top-[35px] left-4 ${selectedPlan === plan.id ? 'border-blue-600 border-[3px]' : 'border-gray-400'}`}>
                              </div>
                              <div className="font-medium text-base leading-6 pt-10">{plan.data}</div>
                              <div className="font-medium text-base leading-6">{plan.mins}</div>
                              <div className="font-normal text-sm leading-normal">{plan.validity}</div>
                            </label>
                          ))}
                        </div>

                        <div className="col-span-2 bg-gray-100 rounded-[12px] p-4 flex items-start gap-3 border-[1px] border-[#E2E2E4] h-[155px]">
                          <img src="/Images/info-circle-icon.svg" alt="Info Icon" className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700 leading-snug">
                            <strong className="block mb-1">{t('plans.info.title')}</strong>
                            <Trans i18nKey="plans.info.content">
                              All plans have a <b className="font-semibold">30-day activation period</b>. If you get a plan <b className="font-semibold">today</b> and don’t activate it until <b className="font-semibold">1 month</b>, it will be activated automatically.
                            </Trans>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        className={`w-full h-[48px] lg:w-[381px] border-[1px] rounded-[8px] font-medium ${
                          !isPlanSelected
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 border-[#017DC0] text-white hover:bg-blue-700'
                        }`}
                        onClick={() => handleNextStep(2)}
                        disabled={!isPlanSelected}
                      >
                        {t('common.next')}
                      </button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center mb-1">
                          <label className="block text-sm font-medium text-gray-700" htmlFor="eid">
                            {t('device.eid')}<span className="text-red-500">*</span>
                          </label>
                          <div className="relative group flex items-center">
                            <img src="/Images/info-circle-icon.svg" alt="Info for EID" className="w-4 h-4 ml-1.5 cursor-pointer" />
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-max max-w-xs
                                            invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300
                                            bg-gray-100 text-gray-800 rounded-lg p-3 shadow-lg z-10 border border-gray-200">
                              <h3 className="font-semibold text-base mb-1">{t('device.tooltip.eid.title')}</h3>
                              <p className="text-sm">{t('device.tooltip.eid.description')}</p>
                            </div>
                          </div>
                        </div>
                        <input
                          id="eid"
                          className="w-full p-2 border border-gray-300 rounded-md bg-white h-[44px] lg:w-[489px] rounded-[8px]"
                          placeholder={t('device.eidPlaceholder')}
                          value={eid}
                          onChange={(e) => setEid(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirm-eid">
                          {t('device.confirmEid')}<span className="text-red-500">*</span>
                        </label>
                        <input
                          id="confirm-eid"
                          className="w-full p-2 border border-gray-300 rounded-md bg-white h-[44px] lg:w-[489px] rounded-[8px]"
                          placeholder={t('device.eidPlaceholder')}
                          value={confirmEid}
                          onChange={(e) => setConfirmEid(e.target.value)}
                        />
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <label className="block text-sm font-medium text-gray-700" htmlFor="imei">
                            {t('device.imei')}<span className="text-red-500">*</span>
                          </label>
                          <div className="relative group flex items-center">
                            <img src="/Images/info-circle-icon.svg" alt="Info for IMEI" className="w-4 h-4 ml-1.5 cursor-pointer" />
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-max max-w-xs
                                            invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300
                                            bg-gray-100 text-gray-800 rounded-lg p-3 shadow-lg z-10 border border-gray-200">
                              <h3 className="font-semibold text-base mb-1">{t('device.tooltip.imei.title')}</h3>
                              <p className="text-sm">{t('device.tooltip.imei.description')}</p>
                            </div>
                          </div>
                        </div>
                        <input
                          id="imei"
                          className="w-full p-2 border border-gray-300 rounded-md bg-white h-[44px] lg:w-[489px] rounded-[8px]"
                          placeholder={t('device.imeiPlaceholder')}
                          value={imei}
                          onChange={(e) => setImei(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirm-imei">
                          {t('device.confirmImei')}<span className="text-red-500">*</span>
                        </label>
                        <input
                          id="confirm-imei"
                          className="w-full p-2 border border-gray-300 rounded-md bg-white h-[44px] lg:w-[489px] rounded-[8px]"
                          placeholder={t('device.imeiPlaceholder')}
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
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 border-[#017DC0] text-white hover:bg-blue-700'
                        }`}
                      >
                        {t('common.next')}
                      </button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                      <div className="space-y-4 lg:hidden">
                          {info.map((field, index) => (
                          <div key={index} className="flex flex-col">
                              <div className="flex items-center mb-1">
                              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                              <div className="flex items-center ml-2 text-[#4CAF50]">
                                  <img src="/Images/tick.svg" alt="Verified" className="w-4 h-4" />
                                  <span className="ml-1 text-xs font-medium">{t('personalInfo.verified')}</span>
                              </div>
                              </div>
                              <div className="bg-[#F8F8F8] p-3 rounded-[8px] h-[44px] text-sm text-gray-600 flex items-center w-full">
                                <span className="truncate">{field.value}</span>
                              </div>
                          </div>
                          ))}
                      </div>

                      <div className="hidden lg:block space-y-4">
                          {info.map((field, index) => (
                              <div key={index} className="flex flex-col">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                  <div className="flex flex-row items-center gap-4">
                                      <div className="bg-[#F8F8F8] p-3 rounded-[8px] h-[44px] text-sm text-gray-600 flex items-center flex-grow lg:flex-grow-0 lg:w-[489px]">
                                        <span className="truncate">{field.value}</span>
                                      </div>
                                      <div className="flex items-center justify-center bg-[#F2FFF9] border border-[#C6EDDB] rounded-[8px] w-[123px] h-[44px] text-[#4CAF50] text-sm font-medium flex-shrink-0">
                                      <img src="/Images/tick.svg" alt="Tick" className="w-5 h-5" />
                                      <span className="ml-1">{t('personalInfo.verified')}</span>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
  
                    <div className="flex justify-end mt-6">
                      <button
                        className={`w-full h-[48px] lg:w-[381px] border-[1px] rounded-[8px] font-medium ${
                          !isFormComplete
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 border-[#017DC0] text-white hover:bg-blue-700'
                        }`}
                        onClick={handleSubmit}
                        disabled={!isFormComplete}
                      >
                        {t('common.submit')}
                      </button>
                    </div>
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