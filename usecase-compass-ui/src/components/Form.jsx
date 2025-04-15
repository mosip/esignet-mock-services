import { useState } from "react";
import PreviewDialog from "../utils/PreviewDialog";


const formConfig = [
    { label: 'Full Name*', name: 'fullName', type: 'text', placeholder: 'Enter your full name' },
    { label: 'National ID*', name: 'nationalID', type: 'text', placeholder: 'Enter your national ID' },
    { label: 'Date of Birth*', name: 'dob', type: 'date', placeholder: 'Select your date of birth' },
    {
        label: 'Gender*',
        name: 'gender',
        type: 'text',
        placeholder: 'Enter gender'
    },
    { label: 'Nationality*', name: 'nationality', type: 'text', placeholder: 'Enter your nationality' },
    { label: 'Birth Country*', name: 'birthCountry', type: 'text', placeholder: 'Enter your birth country' },
    {
        label: 'Upload Photo*',
        name: 'photo',
        type: 'file',
        accept: 'image/png, image/jpeg',
        hint: 'Supported formats: PNG/JPEG | Size: Min - 50 KB to Max - 200 KB',
        placeholder: 'Upload Photo', // placeholder not applicable for file input
    },
    { label: 'CAN (Card Access Number)*', name: 'can', type: 'text', placeholder: 'Enter your CAN' },
];

const Form = ({showSuccessMsg}) => {
    const [formData, setFormData] = useState({});
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleClear = () => setFormData({});

    const handlePreview = () => {
        setShowPreviewDialog(prevState => !prevState);
    };

    const submitApplication = () =>{
        showSuccessMsg(prevState => !prevState)
    }
    

    return (
        <div className="rounded-4xl px-12 pt-6 pb-12 bg-[#FFFDF6] w-[780px]">
            <p className="text-[#3D4468] text-[18px] mb-5">All fields are required, except ones marked as optional</p>
            <form className="space-y-4">
                {formConfig.map((field) => (
                    <div key={field.name}>
                        <label className="block font-medium text-[#0033A0] text-[18px]">{field.label}</label>

                        {field.type === 'select' ? (
                            <select
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                className="select select-bordered w-full mt-1 border-[2px] border-[#707070] h-[60px] rounded-lg outline-none px-4 text-[#9FA1AD] text-[18px]"
                            >
                                <option disabled value="">
                                    {field.placeholder}
                                </option>
                                {field.options.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        ) : field.type === 'file' ? (
                            <>
                                {field.hint && (
                                    <p className="text-sm text-[#0033A0] mt-1 text-[14px]">{field.hint}</p>
                                )}
                                <div className="w-[194px] h-[194px] mt-1 border-[2px] border-[#707070] rounded-lg flex flex-col items-center justify-around">
                                    <img src="src/assets/icons/person.svg" alt='person' className="-mb-7"/>
                                    <label className="flex items-center justify-center gap-2 cursor-pointer w-[134px] h-[40px] border-2 border-[#FF671F] rounded-md -mb-3">
                                        <img src="src\assets\icons\upload.svg" alt="upload"/>
                                        <span className="btn btn-outline text-[#FF671F] font-medium">Upload Photo</span>
                                        <input
                                            type="file"
                                            name={field.name}
                                            accept={field.accept}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </>
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                className={`input input-bordered w-full mt-1 border-[2px] border-[#707070] h-[60px] rounded-lg outline-none px-4 text-[18px] ${formData[field.name] ? "text-#1B2142" : "text-[#9FA1AD]"} `}
                                placeholder={field.placeholder}
                            />
                        )}
                    </div>
                ))}
                <hr className="text-[#E5EBFA] mt-8"/>
                <div className="flex gap-4 mt-8 px-3">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="btn btn-outline w-[50%] font-bold h-[60px] border-2 text-[#FF671F] text-lg cursor-pointer border-[#FF671F] rounded-md"
                    >
                        Clear Form
                    </button>
                    <button
                        type="button"
                        onClick={handlePreview}
                        className="btn btn-primary w-[50%] font-bold h-[60px] border-2 bg-[#FF671F] text-lg cursor-pointer text-[#ffffff] border-[#FF671F] rounded-md"
                    >
                        Preview
                    </button>
                </div>
            </form>
            {showPreviewDialog && <PreviewDialog showPreviewDialog={() => setShowPreviewDialog(prevState => !prevState)} submitApplication={submitApplication}/>}
        </div>
    )
};

export default Form;