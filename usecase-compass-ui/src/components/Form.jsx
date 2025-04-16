import { useState } from "react";
import PreviewDialog from "../utils/PreviewDialog";
import http from "../services/http";
import AlertDialog from "../utils/AlertDialog";

const formConfig = [
    { label: 'First Name', name: 'firstNamePrimary', type: 'text', placeholder: 'Enter First Name', errorMessage: 'First name is required' },
    { label: 'Last Name', name: 'lastNameSecondary', type: 'text', placeholder: 'Enter Last Name', errorMessage: 'Last name is required' },
    { label: 'National ID', name: 'nationalUid', type: 'text', placeholder: 'Enter National ID', errorMessage: 'National ID is required' },
    { label: 'Date of Birth', name: 'dateOfBirth', type: 'date', placeholder: 'DD / MM / YYYY', errorMessage: 'Date of birth is required' },
    {
        label: 'Gender',
        name: 'gender',
        type: 'text',
        placeholder: 'Enter Gender',
        errorMessage: 'Gender is required'
    },
    { label: 'Nationality', name: 'nationality', type: 'text', placeholder: 'Enter Nationality', errorMessage: 'Nationality is required' },
    { label: 'Birth Country', name: 'birthCountry', type: 'text', placeholder: 'Enter Birth Country', errorMessage: 'Birth country is required' },
    { label: 'CAN (Card Access Number)', name: 'cardAccessNumber', type: 'text', placeholder: 'Enter Card Access Number)', errorMessage: 'Card Access Number is required' },
    { label: 'Email ID', name: 'email', type: 'email', placeholder: 'Enter Your Email', errorMessage: 'Email is required' },
    {
        label: 'Upload Photo*',
        name: 'faceImageColor',
        type: 'file',
        accept: 'image/png, image/jpeg',
        hint: 'Supported formats: PNG/JPEG | Size: Min - 50 KB to Max - 200 KB',
        placeholder: 'Upload Photo', // placeholder not applicable for file input
        errorMessage: 'Citizen photo is required. Please upload a valid image file.'
    }
];


const Form = ({ showSuccessMsg }) => {
    const [formData, setFormData] = useState({});
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const [errors, setErrors] = useState({});
    const [invalidFormError, setInvalidFormError] = useState("");
    const [showFormClearMsg, setShowFormClearMsg] = useState(false);

    const clearFormConfMsg = { title: "Clear Form", message: "Are you sure you want to clear the form?" };


    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "faceImageColor") {
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);

            const fileSizeKB = files[0].size / 1024;

            if (fileSizeKB < 50 || fileSizeKB > 200) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: "The uploaded photo does not meet the required size. Please upload an image within the allowed size limits.", // clear error when typing
                }));
                return
            } else {
                reader.onload = () => {
                    const base64Image = reader.result; // this is your Base64 string
                    setFormData((prev) => ({
                        ...prev,
                        [name]: base64Image,
                    }));
                };

                reader.onerror = (error) => {
                    setErrors((prev) => ({
                        ...prev,
                        [name]: 'Failed to upload image please try again', // clear error when typing
                    }));
                };
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        setErrors((prev) => ({
            ...prev,
            [name]: '', // clear error when typing
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        formConfig.forEach((field) => {
            const value = formData[field.name];

            if (!value) {
                newErrors[field.name] = field.errorMessage;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClear = () => setShowFormClearMsg(true);

    const handlePreview = () => {
        if (validateForm()) {
            setShowPreviewDialog(prevState => !prevState);
        } else {
            setInvalidFormError("Please fill in all required fields before submitting the application.");
        }

    };

    const submitApplication = async () => {
        try {
            const res = await http.post('/user-info', formData);
            showSuccessMsg(prevState => !prevState);
        } catch (err) {
            setInvalidFormError(err.response.data);
            setShowPreviewDialog(false);
        }
    }


    return (
        <div className="rounded-4xl px-12 pt-6 pb-12 bg-[#FFFDF6] min-[1060px]:w-[780px] max-[1060]:w-[680px] min-[860px]:-ml-15">
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
                                {invalidFormError.errors && invalidFormError.errors[field.name] && (
                                    <p className="text-red-500 text-xs mt-1">{invalidFormError.errors[field.name]}</p>
                                )}
                            </>
                        ) : field.type === 'file' ? (
                            <>
                                {field.hint && (
                                    <p className="text-sm text-[#0033A0] mt-1 text-[14px]">{field.hint}</p>
                                )}
                                <div className={`w-[194px] h-[194px] mt-1 border-2 rounded-lg flex flex-col items-center justify-around bg-[#ffffff] ${errors[field.name] ? "border-red-500" : "border-[#707070]"}`}>
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
                                {invalidFormError.errors && invalidFormError.errors[field.name] && (
                                    <p className="text-red-500 text-xs mt-1">{invalidFormError.errors[field.name]}</p>
                                )}
                            </>
                        ) : field.type === 'date' ? (
                            <>
                                <div className={`w-full border-2 rounded-lg flex items-center px-4 text-[#9FA1AD] ${errors[field.name] ? "border-red-500" : "border-[#707070]"}`}>
                                    <img src="assets/icons/calendar.svg"/>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name] || 'DD / MM / YYYY'}
                                        onChange={handleChange}
                                        className={`transition-colors duration-300 w-full input input-bordered mt-1 h-[60px] rounded-lg outline-none px-4 text-[18px] bg-[#ffffff] text-[#9FA1AD] ${formData[field.name] ? "text-[#1B2142]" : "text-[#9FA1AD]"}`}
                                        placeholder={field.placeholder}
                                    />
                                </div>
                                {errors[field.name] && (
                                    <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                                )}
                                {invalidFormError.errors && invalidFormError.errors[field.name] && (
                                    <p className="text-red-500 text-xs mt-1">{invalidFormError.errors[field.name]}</p>
                                )}
                            </>
                        ) : (
                            <>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    className={`transition-colors duration-300 input input-bordered w-full mt-1 border-[2px] h-[60px] rounded-lg outline-none px-4 text-[18px] text-[] bg-[#ffffff] ${formData[field.name] ? "text-[#1B2142]" : "text-[#9FA1AD]"} ${errors[field.name] ? "border-red-500" : "border-[#707070]"}`}
                                    placeholder={field.placeholder}
                                />
                                {errors[field.name] && (
                                    <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                                )}
                                {invalidFormError.errors && invalidFormError.errors[field.name] && (
                                    <p className="text-red-500 text-xs mt-1">{invalidFormError.errors[field.name]}</p>
                                )}
                            </>
                        )}
                    </div>
                ))}
                {invalidFormError && <p className="text-red-500">{invalidFormError.message}</p>}
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
            {showFormClearMsg && <AlertDialog data={clearFormConfMsg} confirmMsg={() => { setFormData({}); setShowFormClearMsg(false) }} closePopup={() => setShowFormClearMsg(false)} />}
        </div>
    )
};

export default Form;