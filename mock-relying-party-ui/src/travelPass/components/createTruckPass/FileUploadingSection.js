import React, { useState } from 'react';
import { use } from 'i18next';

function FileUploadingSection({ showUploadingBlock, setShowUploadingBlock, setFileUploaded, errorMsg, setErrorMsg }) {

    const [fileName, setFileName] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [removeLastUploadData, setRemoveLastUploadData] = useState(true);
    const [data, setData] = useState(null);
    const [progress, setProgress] = useState(0);
    const [fileSize, setFileSize] = useState('');


    const handleFileInputClick = () => {
        document.getElementById('file-upload').click();
    };

    const handleFileChange = (e) => {
        setShowUploadingBlock(true);
        const file = e.target.files[0];
        if (!file) return;

        if (file) {
            const fileName = file.name;
            setFileSize(file.size);
            setErrorMsg('');
            const fileExtension = fileName.split('.').pop().toLowerCase();
            if (fileExtension === 'pdf') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const fileData = e.target.result;
                    setUploading(true);
                    setRemoveLastUploadData(true);
                    setFileName(fileName);
                    setData(fileData);
                    const uploadSimulation = setInterval(() => {
                        setProgress((prev) => {
                            const newProgress = prev + 20;
                            if (newProgress >= 100) {
                                clearInterval(uploadSimulation);
                                setUploading(false);
                            }
                            if (newProgress === 100) {
                                setFileUploaded(true);
                            }
                            return newProgress;
                        });
                    }, 500);
                }
                reader.readAsText(file);
            } else {
                setErrorMsg('*File upload failed. Please try again.')
            }
        }
    };

    const cancelUpload = () => {
        setFileName("");
        setProgress(0);
        setUploading(false);
        setShowUploadingBlock(false);
        setFileUploaded(false);
    };

    return (
        <div className='flex flex-col w-[28rem] ml-[3rem]'>
            <p className='text-sm font-[450]'>Upload E-Invoice<span className='text-sm text-red-600'> *</span></p>
            <div className={`flex flex-col h-[12rem] justify-center items-center p-3 bg-white border border-[#E4E7EC] ${!showUploadingBlock && 'hover:border-[#6941C6]'} rounded-lg`}>
                {!showUploadingBlock && (
                    <>
                        <div className='border-[2px] p-1 mt-1 rounded-md'>
                            <input id='file-upload' type="file" onChange={handleFileChange} className="cursor-pointer hidden" />
                            <img src='images/upload_cloud.png' className='h-4 cursor-pointer' onClick={handleFileInputClick} />
                        </div>
                        <p className='text-xs text-[#475467]'>
                            <span className='text-xs text-[#6941C6] font-semibold cursor-pointer' onClick={handleFileInputClick}>Click to Upload</span> or drag and drop</p>
                        <p className='text-xs text-[#475467]'>PDF (max size. 1mb)</p>
                    </>
                )}

                {(showUploadingBlock && !errorMsg) ? (
                    <div className='flex justify-between lg:h-[6rem] lg:w-[23rem] h-[5rem] w-[15rem] border border-[#E4E7EC] rounded-md lg:p-2 p-1'>
                        <div className='flex items-center space-x-2'>
                            <img src='images/file_type_icon.png' className='h-6 lg:h-8' />
                            <div className='flex flex-col mt-5'>
                                <p className='text-[#344054] text-[0.7rem] font-semibold'>{fileName ? fileName : 'E-Invoice.pdf'}</p>
                                <p className='text-[0.6rem] lg:text-[0.7rem] text-[#475467] font-semibold'>{fileSize} KB</p>
                                <div className="flex w-[12rem] lg:w-[19.2rem] justify-between gap-x-1 rounded-full h-2.5 mb-4">
                                    <div className={`bg-[#7F56D9] h-1.5 lg:h-2 self-center rounded-full`}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                    <p className='text-[#344054] self-center text-[0.7rem] bg-white'>{progress}%</p>
                                </div>
                            </div>
                        </div>
                        <img src='images/trash_icon.png' className='h-3.5 cursor-pointer' onClick={cancelUpload} />
                    </div>
                ) :
                    (errorMsg && (<div className='flex flex-col justify-center items-center gap-y-2'>
                        <div className='p-1 border-[2px] mt-1 rounded-md'>
                            <input id='file-upload' type="file" onChange={handleFileChange} className="cursor-pointer hidden" />
                            <img src='images/retry_icon.png' className='lg:h-5 lg:w-5 h-4 w-4 cursor-pointer' onClick={handleFileInputClick} />
                        </div>
                        <p className='text-red-600 lg:text-sm text-[11px]'>{errorMsg}</p>
                    </div>))
                }
            </div>
        </div>
    )
}

export default FileUploadingSection;