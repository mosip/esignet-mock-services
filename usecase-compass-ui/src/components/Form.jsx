import { useState } from "react";
import PreviewDialog from "../utils/PreviewDialog";
import http from "../services/http";


const formConfig = [
    { label: 'First Name*', name: 'firstNamePrimary', type: 'text', placeholder: 'Enter your full name' },
    { label: 'Last Name*', name: 'lastNameSecondary', type: 'text', placeholder: 'Enter your last name' },
    { label: 'National ID*', name: 'nationalUid', type: 'text', placeholder: 'Enter your national ID' },
    { label: 'Date of Birth*', name: 'dateOfBirth', type: 'date', placeholder: 'Select your date of birth' },
    { label: 'Email ID*', name: 'email', type: 'email', placeholder: 'Enter your email address' },
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
        name: 'faceImageColor',
        type: 'file',
        accept: 'image/png, image/jpeg',
        hint: 'Supported formats: PNG/JPEG | Size: Min - 50 KB to Max - 200 KB',
        placeholder: 'Upload Photo', // placeholder not applicable for file input
    },
    { label: 'CAN (Card Access Number)*', name: 'cardAccessNumber', type: 'text', placeholder: 'Enter your CAN' },
];


const Form = ({ showSuccessMsg }) => {
    const [formData, setFormData] = useState({});
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        console.log(errors)

        setErrors((prev) => ({
            ...prev,
            [name]: '', // clear error when typing
        }));

        console.log(errors)

        if (name === "faceImageColor") {
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);

            reader.onload = () => {
                const base64Image = reader.result; // this is your Base64 string
                setFormData((prev) => ({
                    ...prev,
                    [name]: base64Image,
                }));
            };

            reader.onerror = (error) => {
                console.error("Error converting image to base64:", error);
            };
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        formConfig.forEach((field) => {
            console.log(field)
            const isFile = field.type === 'file';
            const value = isFile ? formData[field.name]?.name : formData[field.name];

            if (!value) {
                newErrors[field.name] = `${field.label.replace('*', '')} is required`;
            }
        });

        console.log(newErrors)
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClear = () => setFormData({});

    const handlePreview = () => {
        // if (validateForm()) {
        // Proceed with submit
        setShowPreviewDialog(prevState => !prevState);
        // }

    };

    const submitApplication = async () => {
        try {
            const res = await http.post('/user-info', formData);
            showSuccessMsg(prevState => !prevState)
            console.log(formData)
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <div className="rounded-4xl px-12 pt-6 pb-12 bg-[#FFFDF6] min-[1060px]:w-[780px] max-[1060]:w-auto min-[860px]:-ml-15">
            <p className="text-[#3D4468] text-[18px] mb-5">All fields are required unless marked "Optional"</p>
            <form className="space-y-4">
                {formConfig.map((field) => (
                    <div key={field.name}>
                        <label className="block font-medium text-[#0033A0] text-[18px]">{field.label}</label>

                        {field.type === 'select' ? (
                            <>
                                <select
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    className={`select select-bordered w-full mt-1 border-[2px] h-[60px] rounded-lg outline-none px-4 text-[#9FA1AD] text-[18px] bg-[#ffffff] ${errors[field.name] ? "border-red-500" : "border-[#707070]"}`}
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
                                {errors[field.name] && (
                                    <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                                )}
                            </>
                        ) : field.type === 'file' ? (
                            <>
                                {field.hint && (
                                    <p className="text-sm text-[#0033A0] mt-1 text-[14px]">{field.hint}</p>
                                )}
                                <div className={`w-[194px] h-[194px] mt-1 border-[2px] rounded-lg flex flex-col items-center justify-around bg-[#ffffff] ${errors[field.name] ? "border-red-500" : "border-[#707070]"}`}>
                                    {!formData.faceImageColor ? (
                                        <>
                                            <img src="/assets/icons/person.svg" alt='person' className="-mb-10" />
                                            <label className="flex items-center justify-center gap-2 cursor-pointer w-[134px] h-[40px] border-2 border-[#FF671F] rounded-md -mb-3">
                                                <img src="/assets/icons/upload.svg" alt="upload" />
                                                <span className="btn btn-outline text-[#FF671F] font-medium">Upload Photo</span>
                                                <input
                                                    type="file"
                                                    name={field.name}
                                                    accept={field.accept}
                                                    onChange={handleChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </>) : (
                                        <div className="w-full">
                                            <p onClick={() => setFormData(prevData => ({ ...prevData, faceImageColor: "" }))} className="flex justify-end mr-3 cursor-pointer">
                                                <img className="absolute pt-4" src="/assets/icons/Delete.svg" alt="delete" />
                                            </p>
                                            <img className="object-cover w-[194px] h-[190px] rounded-lg" src={formData.faceImageColor} alt="profile" />
                                        </div>)}
                                </div>
                                {errors[field.name] && (
                                    <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                                )}
                            </>
                        ) : (
                            <>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full mt-1 border-[2px] h-[60px] rounded-lg outline-none px-4 text-[18px] bg-[#ffffff] ${formData[field.name] ? "text-[#1B2142]" : "text-[#9FA1AD]"} ${errors[field.name] ? "border-red-500" : "border-[#707070]"}`}
                                    placeholder={field.placeholder}
                                />
                                {errors[field.name] && (
                                    <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                                )}
                            </>
                        )}
                    </div>
                ))}
                <hr className="text-[#E5EBFA] mt-8" />
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
            {showPreviewDialog && <PreviewDialog showPreviewDialog={() => setShowPreviewDialog(prevState => !prevState)} submitApplication={submitApplication} formData={formData} />}
        </div>
    )
};

export default Form;