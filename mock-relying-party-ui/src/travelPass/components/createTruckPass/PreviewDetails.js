import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PreviewDetails({personalDetails, identifications, eInvoiceDetails, goBack, submitBtn}) {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col bg-white h-auto border border-[#E4E7EC] rounded-lg shadow-sm'>
            <div className='flex items-center h-[4rem] px-[1.8rem] lg:h-[5.75rem] lg:px-[2.5rem]'>
                <h1 className='text-[#0a0b0c] text-lg lg:text-2xl font-semibold'>Confirm Your Details</h1>
            </div>
            <hr className='border' />
            <div className='flex flex-col h-[20rem] px-[1.8rem] lg:h-[22rem] lg:px-[2rem] gap-y-4 my-6 overflow-y-scroll'>
                <div className='flex flex-col'>
                    <h1 className='font-semibold text-normal lg:text-lg mb-4 text-[#b87efa]'>(1) Personal Details</h1>
                    <div className='flex flex-wrap justify-between mr-[25rem] gap-y-4 w-full'>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Full Name</p>
                            <p className='text-[0.8rem] lg:text-[0.9rem] font-semibold text-[#000000]'>{personalDetails.name}</p>
                        </div>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Gender</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{personalDetails.gender}</p>
                        </div>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Date of Birth</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{personalDetails.birthdate}</p>
                        </div>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Phone Number</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{personalDetails.phone_number}</p>
                        </div>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Email Id</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{personalDetails.email}</p>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col'>
                    <h1 className='font-semibold text-normal lg:text-lg mb-4 text-[#b87efa]'>(2) Identification</h1>
                    <div className='flex flex-wrap justify-between mr-[25rem] gap-y-4 w-full'>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Document Type</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{identifications.documentType}</p>
                        </div>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>UIN</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{identifications.uin}</p>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col my-4'>
                    <h1 className='font-semibold text-normal lg:text-lg mb-4 text-[#b87efa]'>(3) Invoice Details</h1>
                    <div className='flex flex-wrap justify-between mr-[25rem] gap-y-4 w-full'>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Invoice Number</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{eInvoiceDetails.inVoiceNumber}</p>
                        </div>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Invoice Date</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{eInvoiceDetails.invoiceDate}</p>
                        </div>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Exporter Name</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{eInvoiceDetails.expoterName}</p>
                        </div>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Importer Name</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{eInvoiceDetails.importerName}</p>
                        </div>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Truck License Plate Number</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{eInvoiceDetails.truck_license_plate_number}</p>
                        </div>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Cross-Border Entry/Exit Post</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{eInvoiceDetails.checkPostNumber}</p>
                        </div>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Date of Departure</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{eInvoiceDetails.depatureDate}</p>
                        </div>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Date of Return</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{eInvoiceDetails.returnDate}</p>
                        </div>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Country of Origin</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{eInvoiceDetails.originCountry}</p>
                        </div>
                        <div className='flex flex-col gap-y-[0.1rem] w-[48%]'>
                            <p className='text-[0.7rem] lg:text-[0.8rem] font-[600] text-[#666666]'>Country of Destination:</p>
                            <p className='text-[0.9rem] font-semibold text-[#000000]'>{eInvoiceDetails.destinationCountry}</p>
                        </div>
                    </div>
                </div>
            </div>
            <hr className='border' />
            <div className='flex place-self-end gap-x-4 m-[1.4rem] '>
                <button type='submit' onClick={submitBtn}
                    className='bg-[#7F56D9] w-[8rem] lg:w-[12rem] text-[#FFFFFF] text-center text-[0.8rem] font-semibold py-[0.6rem] rounded-md'>
                    Submit
                </button>
                <button type='submit' onClick={goBack}
                    className='border border-[#7F56D9] w-[8rem] lg:w-[12rem] text-[#7F56D9] hover:bg-[#f6f3fb] text-center text-[0.8rem] font-semibold py-[0.6rem] rounded-md'>
                    Go Back
                </button>
            </div>
        </div>
    )
}

export default PreviewDetails;