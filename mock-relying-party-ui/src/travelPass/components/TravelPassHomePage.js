import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TravelPassHomePage() {
    const navigate = useNavigate();
    const [step1, setStep1] = useState(true);
    const [step2, setStep2] = useState(false);

    const toggleStep1 = () => {
        setStep1(true);
        setStep2(false);
    };

    const toggleStep2 = () => {
        setStep1(false);
        setStep2(true);
    };

    const onClickDownloadProceed = () => {

    };


    return (
        <div className='flex flex-col space-y-[2.5rem] w-[65rem] absolute justify-center font-inter'>
            <div className='flex duration-200 h-[2.6rem] border-[0.065rem] border-gray-300 border-spacing-6 rounded-lg space-x-1'>
                <div className={`${step1 ? 'border border-[#7F56D9] bg-[#F8F3FF]' : 'bg-white'} h-[2.25rem] w-[39.6rem] rounded-sm text-center py-[0.5rem] hover:shadow-md`} onClick={toggleStep1}>
                    <p className={`${step1 ? 'text-purple-900' : 'text-gray-500'} cursor-default text-sm font-semibold`}>Step-1</p>
                </div>
                <div className={`${step2 ? 'border border-[#7F56D9] bg-[#F8F3FF]' : 'bg-white'} h-[2.25rem] w-[39.6rem] rounded-sm text-center py-[0.5rem] hover:shadow-md`} onClick={toggleStep2}>
                    <p className={`${step2 ? 'text-purple-900' : 'text-gray-500'} text-sm font-semibold`}>Step-2</p>
                </div>
            </div>

            <div className='flex space-x-[2.5rem] duration-200'>
                <div className='flex flex-col bg-white h-auto w-[30.63rem] items-center space-y-[3rem] font-semibold p-[3rem] border-2 border-gray-100 rounded-lg shadow-sm'>
                    <h2 className='text-purple-900 text-[1.3rem]'>Download E-Invoice</h2>
                    <img alt-='downloadInvoiceIcon' />
                    <p className='text-xs font-normal text-[#514A6A] text-center w-[19rem]'>
                        The e-Invoice is available for download. Please follow the easy process outlined below to proceed:
                    </p>
                    <ol className='place-self-start px-[2.7rem] space-y-3'>
                        <li className='flex gap-x-1 text-xs font-normal text-[#514A6A]'>
                            <p className='border-[0.1rem] border-[#7F56D9] rounded-[2rem] w-[1.1rem] h-[1.1rem] px-[0.24rem] text-[#7F56D9]'>1</p>
                            <p>Click on "Proceed" to move forward.</p>
                        </li>
                        <li className='flex gap-x-1 text-xs font-normal text-[#514A6A]'>
                            <p className='border-[0.1rem] border-[#7F56D9] rounded-[2rem] w-[1.1rem] h-[1.1rem] px-[0.24rem] text-[#7F56D9]'>2</p>
                            <p>Select your company.</p>
                        </li>
                        <li className='flex gap-x-1 text-xs font-normal text-[#514A6A]'>
                            <p className='border-[0.1rem] border-[#7F56D9] rounded-[2rem] w-[1.1rem] h-[1.1rem] px-[0.24rem] text-[#7F56D9]'>3</p>
                            <p>Download the e-Invoice.</p>
                        </li>
                    </ol>
                    <button className={`${step1 ? 'bg-purple-600 hover:bg-[#7F56D9] cursor-pointer' : 'bg-gray-300'} w-[20rem] text-xs text-white py-2 shadow-sm rounded-md`} onClick={step1 && onClickDownloadProceed}>
                        Proceed
                    </button>
                </div>
                <div className='flex flex-col bg-white h-auto w-[30.63rem] justify-between items-center space-y-[3rem] font-semibold place-self-end p-[3rem] border-2 border-gray-100 rounded-lg shadow-sm'>
                    <h2 className='text-purple-900 text-[1.3rem]'>Apply for eTravelPass</h2>
                    <img alt-='downloadInvoiceIcon' />
                    <p className='text-xs font-normal text-[#514A6A] text-center w-[22rem]'>
                        The Travel Pass Portal enables company representatives to apply for travel passes to cross borders. Follow this simple process:
                    </p>
                    <ol className='place-self-start px-[1.5rem] space-y-3 -mt-[0.9rem]'>
                        <li className='flex gap-x-1 text-xs font-normal text-[#514A6A]'>
                            <p className='border-[0.1rem] border-[#7F56D9] rounded-[2rem] w-[1.1rem] h-[1.1rem] px-[0.24rem] text-[#7F56D9]'>1</p>
                            <p>Enter Traveller National ID</p>
                        </li>
                        <li className='flex gap-x-1 text-xs font-normal text-[#514A6A]'>
                            <p className='border-[0.1rem] border-[#7F56D9] rounded-[2rem] w-[1.1rem] h-[1.1rem] px-[0.24rem] text-[#7F56D9]'>2</p>
                            <p>Verify National ID</p>
                        </li>
                        <li className='flex gap-x-1 text-xs font-normal text-[#514A6A]'>
                            <p className='border-[0.1rem] border-[#7F56D9] rounded-[2rem] w-[1.1rem] h-[1.1rem] px-[0.24rem] text-[#7F56D9]'>3</p>
                            <p>Upload E-Invoice</p>
                        </li>
                        <li className='flex gap-x-1 text-xs font-normal text-[#514A6A]'>
                            <p className='border-[0.1rem] border-[#7F56D9] rounded-[2rem] w-[1.1rem] h-[1.1rem] px-[0.24rem] text-[#7F56D9]'>4</p>
                            <p>Travel Pass VC available for download from Inji Wallet</p>
                        </li>
                    </ol>
                    <button className={`${step2 ? 'bg-purple-600 hover:bg-[#7F56D9] cursor-pointer' : 'bg-gray-300'} w-[20rem] text-xs text-white py-2 -mt-3  shadow-sm rounded-md`}>
                        Proceed
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TravelPassHomePage;