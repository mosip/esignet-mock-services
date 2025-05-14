import { useEffect } from "react";

const PreviewDialog = ({ showPreviewDialog, submitApplication, formData }) => {
    const { firstNamePrimary, lastNameSecondary, firstNamePrimaryLatin, lastNameSecondaryLatin, nationalUid, dateOfBirth, gender, nationality, birthCountry, faceImageColor, cardAccessNumber, email } = formData;
    const [year, month, date] = dateOfBirth.split('-');

    const closePreviewDialog = () => {
        showPreviewDialog();
    };

    useEffect(() => {
        document.body.classList.add("no-scroll");
        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-[#FDEDE1] rounded-3xl w-[781px] shadow-lg pb-2 relative overflow-y-auto max-h-[90vh]">
                <h1 className="text-2xl font-bold px-6 pt-6  mb-4 text-[#181D27]">Confirm Details</h1>
                <hr className="text-[#D7D8E1]" />
                <div className="py-6 px-10">
                    <div className="flex items-start space-x-10 px-1 pb-7">
                        <div className="w-[30%]">
                            <img src={faceImageColor} alt="profile" className="h-[180px] w-full border border-[#ffffff] rounded-lg object-cover" />
                        </div>
                        <div className="break-words w-[35%]">
                            <p className="mt-4"><span className="text-[#EC6707] text-[16px]">First Name</span><br /><span className="text-[#14397E] text-[18px] font-bold">{firstNamePrimary}</span></p>
                            <p className="mt-4"><span className="text-[#EC6707] text-[16px]">Last Name</span><br /><span className="text-[#14397E] text-[18px] font-bold">{lastNameSecondary}</span></p>
                        </div>
                        <div className="break-words w-[35%]">
                            <p className="mt-4"><span className="text-[#EC6707] text-[16px]">First Name(Latin)</span><br /><span className="text-[#14397E] text-[18px] font-bold">{firstNamePrimaryLatin}</span></p>
                            <p className="mt-4"><span className="text-[#EC6707] text-[16px]">Last Name(Latin)</span><br /><span className="text-[#14397E] text-[18px] font-bold">{lastNameSecondaryLatin}</span></p>
                        </div>
                    </div>
                    <hr className="text-[#D7D8E1]" />
                    <div className="flex space-x-10 pt-6 px-1">
                        <div className="w-[50%]">
                            <p className="mb-4"><span className="text-[#EC6707] text-[16px]">Date of Birth</span><br /><span className="text-[#14397E] text-[18px] font-bold">{date + "-" + month + "-" + year}</span></p>
                            <p className="mb-4"><span className="text-[#EC6707] text-[16px]">National ID</span><br /><span className="text-[#14397E] text-[18px] font-bold">{nationalUid}</span></p>
                            <p className="mb-4"><span className="text-[#EC6707] text-[16px]">Birth Country</span><br /><span className="text-[#14397E] text-[18px] font-bold">{birthCountry}</span></p>
                            <p><span className="text-[#EC6707] text-[16px]">CAN(Card Access Number)</span><br /><span className="text-[#14397E] text-[18px] font-bold">{cardAccessNumber}</span></p>
                        </div>
                        <div className="w-[50%]">
                            <p className="mb-4"><span className="text-[#EC6707] text-[16px]">Gender</span><br /><span className="text-[#14397E] text-[18px] font-bold">{gender}</span></p>
                            <p className="mb-4"><span className="text-[#EC6707] text-[16px]">Nationality</span><br /><span className="text-[#14397E] text-[18px] font-bold">{nationality}</span></p>
                            <p><span className="text-[#EC6707] text-[16px]">Email</span><br /><span className="text-[#14397E] text-[18px] font-bold">{email}</span></p>
                        </div>
                    </div>
                </div>
                <hr className="text-[#D7D8E1]" />
                <div className="py-6 px-10 flex gap-4">
                    <button onClick={closePreviewDialog} type="button" className="btn btn-outline w-[50%] font-bold h-[60px] border-2 text-[#FF671F] text-lg cursor-pointer border-[#FF671F] rounded-md">Cancel</button>
                    <button onClick={submitApplication} type="button" className="btn btn-primary w-[50%] font-bold h-[60px] border-2 bg-[#FF671F] text-lg cursor-pointer text-[#ffffff] border-[#FF671F] rounded-md">Submit</button>
                </div>
            </div>
        </div>
    )
};

export default PreviewDialog;