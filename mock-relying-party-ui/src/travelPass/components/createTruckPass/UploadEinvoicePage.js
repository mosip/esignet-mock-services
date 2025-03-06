import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FileUploadingSection from "./FileUploadingSection";
import relyingPartyService from "../../../services/relyingPartyService";

function UploadEinvoicePage({ userInfo, inVoiceDetails, goBack, setShowPrevDetails, setRevert }) {
  const navigate = useNavigate();
  const [showUploadingBlock, setShowUploadingBlock] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { post_uploadDetails } = {
    ...relyingPartyService,
  };

  const uploadTruckPass = async (userInfo) => {
    try {
      let full_name = userInfo.name;
      let phone_number = userInfo.phone_number;
      await post_uploadDetails(
        full_name,
        phone_number
      )
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const downloadInvoice = () => {
    const fileUrl = '/inVoice/Invoice-1.pdf';

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'travel-InVoice.pdf';
    link.click();
  };

  const previewDetails = (userInfo) => {
    uploadTruckPass(userInfo)
    setShowPrevDetails(true);
    setRevert(false);
  };

  return (
    <div className='bg-white h-[30rem] border border-[#E4E7EC] rounded-lg shadow-sm'>
      <div className='flex items-center justify-between h-[8rem] lg:px-[3rem] lg:py-[0.6rem] lg:my-2 px-[2rem] py-[0.8rem] '>
        <div className='flex-col'>
          <h1 className='text-[#2C3345] font-semibold text-lg lg:text-[1.85rem]'>Fill Your Details</h1>
          <p className='text-[#2C3345] font-base  text-xs lg:text-sm'>Lorem ipsum dolor sit amet consectetur</p>
        </div>

        {!showUploadingBlock && (
          <div className='flex items-center lg:px-[1rem] px-[1.5rem] rounded-md bg-[#FEFAEA] lg:h-[7.2rem] lg:w-[24rem] h-[6.3rem] w-[20rem]'>
            <div className='flex-col gap-y-2'>
              <h1 className='text-xs lg:text-sm text-[#620299] font-semibold'>About e-Invoice</h1>
              <p className='text-xs'>Lorem ipsum dolor sit amet consectetur. Sed euismod viverra dapibus natoque tellus molestie quam sit eu. </p>
              <p type="link" onClick={downloadInvoice}
                className='text-xs font-bold hover:text-[#5a66e6] cursor-pointer'>
                Download Sample e-Invoice
              </p>
            </div>
            <img src='images/eInVoice_icon.png' className='h-[3rem]' />
          </div>
        )}

      </div>
      <hr className='h-[0.1rem] bg-[#D7D8E1]' />
      <div className='flex justify-between lg:px-[2rem] md:px-[0.3rem] py-[0.9rem]'>
        {userInfo && (
          <form className='flex flex-wrap w-[40rem] justify-around gap-y-3'>
            <label className='lg:h-[4.15rem] lg:w-[18.5rem] md:h-[2rem] md:w-[9rem]'>
              <p className=' text-xs lg:text-sm font-base'>Full Name<span className='text-sm text-red-600'>*</span></p>
              <input disabled placeholder={userInfo.name} className='bg-[#E8EBEC] p-[0.5rem] rounded-md lg:text-xs md:text-[10px] lg:w-[17rem] md:w-[11rem]' />
            </label>
            <label className='lg:h-[4.15rem] lg:w-[18.5rem] md:h-[2rem] md:w-[9rem]'>
              <p className='text-xs lg:text-sm font-base'>UIN(National ID)<span className='text-sm text-red-600'>*</span></p>
              <input disabled placeholder={userInfo.uinId} className='bg-[#E8EBEC] p-[0.5rem] rounded-md text-xs lg:text-xs md:text-[10px] lg:w-[17rem] md:w-[11rem]' />
            </label>
            <label className='lg:h-[4.15rem] lg:w-[18.5rem] md:h-[2rem] md:w-[9rem]'>
              <p className='text-xs lg:text-sm font-base'>Phone Number<span className='text-sm text-red-600'>*</span></p>
              <input disabled placeholder={userInfo.phone_number} className='bg-[#E8EBEC] p-[0.5rem] rounded-md text-xs lg:text-xs md:text-[10px] lg:w-[17rem] md:w-[11rem]' />
            </label>
            <label className='lg:h-[4.15rem] lg:w-[18.5rem] md:h-[2rem] md:w-[9rem]'>
              <p className='text-xs lg:text-sm font-base'>Gender<span className='text-sm text-red-600'>*</span></p>
              <input disabled placeholder={userInfo.gender} className='bg-[#E8EBEC] p-[0.5rem] rounded-md text-xs lg:text-xs md:text-[10px] lg:w-[17rem] md:w-[11rem]' />
            </label>
            <label className='lg:h-[4.15rem] lg:w-[18.5rem] md:h-[2rem] md:w-[9rem]'>
              <p className='text-xs lg:text-sm font-base'>Email Id<span className='text-sm text-red-600'>*</span></p>
              <input disabled placeholder={userInfo.email} className='bg-[#E8EBEC] p-[0.5rem] rounded-md text-xs lg:text-xs md:text-[10px] lg:w-[17rem] md:w-[11rem]' />
            </label>
            <label className='lg:h-[4.15rem] lg:w-[18.5rem] md:h-[2rem] md:w-[9rem]'>
              <p className='text-xs lg:text-sm font-base'>City<span className='text-sm text-red-600'>*</span></p>
              <input disabled placeholder={userInfo.address.locality} className='bg-[#E8EBEC] p-[0.5rem] rounded-md text-xs lg:text-xs md:text-[10px] lg:w-[17rem] md:w-[11rem]' />
            </label>
          </form>
        )}

        <FileUploadingSection
          showUploadingBlock={showUploadingBlock}
          setShowUploadingBlock={setShowUploadingBlock}
          setFileUploaded={setFileUploaded}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
        <div>
        </div>
      </div>

      <hr className='h-[0.1rem] bg-[#D7D8E1]' />
      <div className='flex items-center justify-end pt-[2rem] px-[3.2rem] gap-x-4'>
        <button onClick={goBack}
          className={`px-[4rem] py-[0.75rem] border border-[#8b31e4] lg:text-xs text-[12px] font-semibold text-[#8b31e4] rounded-md hover:bg-[#8b31e4] hover:text-[#FFFFFF]`}>
          Go Back
        </button>
        <button onClick={() => previewDetails(userInfo) }
          className={`px-[3rem] py-[0.75rem] border border-[#e0d2f3] ${fileUploaded ? 'bg-[#8b31e4] text-[#FFFFFF]' : 'bg-[#E8EBEC] text-[#A0A8AC] cursor-default'} lg:text-xs text-[12px] font-semibold rounded-md`}>
          Preview Details
        </button>
      </div>
    </div>
  );
}

export default UploadEinvoicePage;
