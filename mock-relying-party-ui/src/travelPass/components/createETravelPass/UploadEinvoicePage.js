import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FileUploadingSection from "./FileUploadingSection";

function UploadEinvoicePage({ userInfo, goBack, setShowPrevDetails }) {
  const navigate = useNavigate();
  const [showUploadingBlock, setShowUploadingBlock] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  const downloadInvoice = () => {
    const fileUrl = '/inVoice/Invoice-1.pdf';

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'travel-InVoice.pdf';
    link.click();
  };

  const previewDetails = () => {
    setShowPrevDetails(true);
  };

  return (
    <div className='bg-white h-[30rem] border border-[#E4E7EC] rounded-lg shadow-sm'>
      <div className='flex items-center justify-between h-[8rem] px-[3rem] py-[0.6rem] my-2'>
        <div className='flex-col'>
          <h1 className='text-[#2C3345] font-semibold text-[1.85rem]'>Fill Your Details</h1>
          <p className='text-[#2C3345] font-base text-sm'>Lorem ipsum dolor sit amet consectetur</p>
        </div>

        {!showUploadingBlock && (
          <div className='flex items-center px-[1rem] rounded-md bg-[#FEFAEA] h-[7.2rem] w-[24rem] '>
            <div className='flex-col gap-y-2'>
              <h1 className='text-sm text-[]#620299font font-semibold'>About e-Invoice</h1>
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
      <div className='flex justify-between px-[2rem] py-[0.9rem]'>
        <form className='flex flex-wrap w-[40rem] justify-around gap-y-3'>
          <label className='h-[4.15rem] w-[18.5rem]'>
            <p className='text-sm font-base'>Full Name<span className='text-sm text-red-600'>*</span></p>
            <input disabled placeholder={userInfo.name} className='bg-[#E8EBEC] p-[0.5rem] rounded-md text-xs w-[17rem]' />
          </label>
          <label className='h-[4.15rem] w-[18.5rem]'>
            <p className='text-sm font-base'>UIN(National ID)<span className='text-sm text-red-600'>*</span></p>
            <input disabled placeholder={userInfo.uinId} className='bg-[#E8EBEC] p-[0.5rem] rounded-md text-xs w-[17rem]' />
          </label>
          <label className='h-[4.15rem] w-[18.5rem]'>
            <p className='text-sm font-base'>Phone Number<span className='text-sm text-red-600'>*</span></p>
            <input disabled placeholder={userInfo.phone_number} className='bg-[#E8EBEC] p-[0.5rem] rounded-md text-xs w-[17rem]' />
          </label>
          <label className='h-[4.15rem] w-[18.5rem]'>
            <p className='text-sm font-base'>Gender<span className='text-sm text-red-600'>*</span></p>
            <input disabled placeholder={userInfo.gender} className='bg-[#E8EBEC] p-[0.5rem] rounded-md text-xs w-[17rem]' />
          </label>
          <label className='h-[4.15rem] w-[18.5rem]'>
            <p className='text-sm font-base'>Email Id<span className='text-sm text-red-600'>*</span></p>
            <input disabled placeholder={userInfo.email} className='bg-[#E8EBEC] p-[0.5rem] rounded-md text-xs w-[17rem]' />
          </label>
          <label className='h-[4.15rem] w-[18.5rem]'>
            <p className='text-sm font-base'>City<span className='text-sm text-red-600'>*</span></p>
            <input disabled placeholder={userInfo.address.locality} className='bg-[#E8EBEC] p-[0.5rem] rounded-md text-xs w-[17rem]' />
          </label>
        </form>
        <FileUploadingSection
          showUploadingBlock={showUploadingBlock}
          setShowUploadingBlock={setShowUploadingBlock}
          setFileUploaded={setFileUploaded}
        />
        <div>
        </div>
      </div>

      <hr className='h-[0.1rem] bg-[#D7D8E1]' />
      <div className='flex items-center justify-end pt-[2rem] px-[3.2rem] gap-x-4'>
        <button onClick={goBack}
          className={`px-[4rem] py-[0.75rem] border border-[#8b31e4] text-xs font-semibold text-[#8b31e4] rounded-md hover:bg-[#8b31e4] hover:text-[#FFFFFF]`}>
          Go Back
        </button>
        <button onClick={previewDetails}
          className={`px-[3rem] py-[0.75rem] border border-[#e0d2f3] ${fileUploaded ? 'bg-[#8b31e4] text-[#FFFFFF]' : 'bg-[#E8EBEC] text-[#A0A8AC] cursor-default'} text-xs font-semibold rounded-md`}>
          Preview Details
        </button>
      </div>
    </div>
  );
}

export default UploadEinvoicePage;
