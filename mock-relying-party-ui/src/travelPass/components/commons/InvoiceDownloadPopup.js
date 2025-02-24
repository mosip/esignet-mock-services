import React from 'react';

function InvoiceDownloadPopup({ setShowDownloadPopup }) {
    const travelAgencies = [
        { icon: 'Respective Icon', name: 'Solana Enterprices' },
        { icon: 'Respective Icon', name: 'Drexia Logistics' },
        { icon: 'Respective Icon', name: 'Rovia Imports' },
        { icon: 'Respective Icon', name: 'Zara Freight' }
    ]

    const onCancel = () => {
        setShowDownloadPopup(false);
    };

    return (
        <div className="flex fixed inset-0 bg-black bg-opacity-[9%] justify-center items-center z-50 w-full">
            <div className="flex flex-col bg-white h-auto w-[36rem] rounded-xl py-9 shadow-md mt-[3.5rem]">
                <div className='flex items-center justify-between px-[1rem]'>
                    <h2 className="text-[0.9rem] text-normal">Please select an E-Voice from Companies below</h2>
                    <div className="flex border border-gray-300 items-center rounded-sm w-[13rem] shadow-md">
                        <button className="px-2 transform text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6M10 18a8 8 0 110-16 8 8 0 010 16z"></path>
                            </svg>
                        </button>
                        <input type="text" className="py-[0.45rem] text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search" />
                    </div>
                </div>
                <hr className='mt-2 h-px text-gray-300' />
                <div className='flex flex-wrap justify-between px-[1rem] pt-[1.5rem]'>
                    {travelAgencies.map((agency) => {
                        return (
                            <div className='flex-col border-[0.093rem] border-gray-300 rounded-sm h-[5.5rem] p-2 w-[16rem] mb-[1.5rem]'>
                                <img src={agency.icon} />
                                <p className='text-sm text-[0.8rem]'>{agency.name}</p>
                            </div>
                        )
                    })}
                </div>
                <hr className='h-px text-gray-300' />
                <div className='flex self-end pr-[0.5rem] mt-6 -mb-2'>
                    <button className='text-[0.7rem] font-semibold px-2 py-1.5 w-[9rem] text-purple-900 border border-purple-900 rounded-sm  cursor-pointer shadow-xs mx-2' onClick={onCancel}>
                        Cancel
                    </button>
                    <button className='text-[0.7rem] font-semibold px-2 py-1.5 w-[9rem] bg-gray-200 text-gray-400 border border-gray-300 rounded-sm cursor-pointer shadow-xs mx-2'>
                        Download
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InvoiceDownloadPopup;