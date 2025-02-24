import React from 'react'
import { useTranslation } from 'react-i18next';

function FetchDetailsLoader() {
  const {t} = useTranslation('');
  return (
    <div className="h-[37rem] flex flex-col items-center py-8 relative overflow-hidden bg-[rgba(249,245,255,1)] font-inter">
      <div>
        <div className="absolute top-[65%] left-[-4%] w-[26%] min-[1800px]:w-[40%] h-20 bg-[rgba(233,215,254,1)] transform -rotate-10"></div>
        <div className="absolute top-[75%] left-[-5%] w-[26%] min-[1800px]:w-[40%] h-14 bg-[rgba(214,187,251,1)] transform -rotate-10"></div>
      </div>

      <div>
        <div className="absolute top-[34%] left-[54%] w-[56%] h-20 bg-[rgba(214,187,251,1)] transform -rotate-10"></div>
        <div className="absolute top-[45%] left-[54%] w-[56%] h-14 bg-[rgba(233,215,254,1)] transform -rotate-10"></div>
      </div>

      <div className="absolute top-[76%] left-[-10%] w-[120%] h-[50%] bg-white transform -rotate-10 z-0"></div>

      <div className='flex flex-col mt-[2rem] bg-white w-[60rem] h-[32rem] space-y-[5rem] items-center place-self-center rounded-xl drop-shadow-sm'>
        <h2 className='text-[#42307D] font-[600] text-4xl mt-[5rem]'>
         {t('fetchDetailsLoader.fetchDetails')}
        </h2>
        <p className='border py-[3rem]'>Loading Dots</p>
        <p className='text-[#42307D] text-[1.3rem] font-base'>{t('fetchDetailsLoader.pleaseWait')}</p>
      </div>

    </div>
  )
}

export default FetchDetailsLoader;