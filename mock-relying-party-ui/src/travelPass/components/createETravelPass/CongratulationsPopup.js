import React from 'react';

function CongratulationsPopup() {
    return (
        <div className='bg-white h-full border border-[#E4E7EC] rounded-lg shadow-sm'>
            <div className='flex flex-col h-[22rem] py-[1rem] items-center justify-center space-y-3 text-center'>
                <img
                    src='images/congratulations.gif'
                    alt='Congratulation_gif'
                    className='h-[10rem] w-[10rem]'
                />
                <h1 className='text-2xl font-bold text-[#42307D]'>Congratulations!</h1>
                <p className='text-lg font-semibold text-[#42307D]'>Your driver's travel pass is now ready for download</p>
                <p className='text-sm font-[500] text-[#42307D] w-[25rem]'>Please ask your driver/traveler to download the travel pass and keep it accessible for smooth border crossing.</p>
                <div className='flex justify-around w-[25rem] mb-[2rem]'>
                    <button className='border border-[#a08ae9] hover:bg-[#7F56D9] hover:text-white text-sm text-[#42307D] rounded-md px-7 py-2'>Inji Mobile Wallet</button>
                    <button className='border border-[#a08ae9] text-sm text-[#42307D] hover:bg-[#7F56D9] hover:text-white rounded-md px-7 py-2'>Inji Web Wallet</button>
                </div>
            </div>
        </div>
    )
}

export default CongratulationsPopup;