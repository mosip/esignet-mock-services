import React from 'react';

function CongratulationsPopup() {
    return (
        <div className='bg-white h-full border border-[#E4E7EC] rounded-lg shadow-sm'>
            <div className='flex flex-col h-[22rem] py-[1rem] items-center justify-center space-y-3 text-center'>
                <img
                    src='images/congratulations.gif'
                    alt='Congratulation_gif'
                    className='h-[8rem] w-[8rem] lg:h-[10rem] lg:w-[10rem]'
                />
                <h1 className='text-xl lg:text-2xl font-bold text-[#42307D]'>Congratulations!</h1>
                <p className='text-sm lg:text-lg font-semibold text-[#42307D]'>Your truck pass is now ready for download</p>
                <p className='text-xs lg:text-sm font-[500] text-[#42307D] w-[20rem]'>Please ask your driver to download the truck pass and keep it accessible for smooth border crossing.</p>
                <div className='flex justify-around w-[20rem] lg:w-[25rem] mb-[2rem]'>
                    <a href="https://drive.google.com/drive/folders/1gBjFSdpjxU4bsZi7-xS59W1-EIFKrkS8">
                        <button className='border border-[#a08ae9] hover:bg-[#7F56D9] hover:text-white text-xs lg:text-sm text-[#42307D] rounded-md px-5 py-1 lg:px-7 lg:py-2'>Inji Mobile Wallet</button>
                    </a>
                    <a href="https://injiweb.collab.mosip.net/">
                        <button className='border border-[#a08ae9] text-xs lg:text-sm text-[#42307D] hover:bg-[#7F56D9] hover:text-white rounded-md px-5 py-1 lg:px-7 lg:py-2'>Inji Web Wallet</button>
                    </a>
                </div>
            </div>
        </div >
    )
}

export default CongratulationsPopup;