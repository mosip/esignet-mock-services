import { useState } from "react";
import PreviewDialog from "../utils/PreviewDialog";
import http from "../services/http";
import AlertDialog from "../utils/AlertDialog";
import Datepicker from "../utils/DatePicker"
import Dropdown from "../utils/Dropdown";

const formConfig = [
    { label: 'First Name', name: 'firstNamePrimary', type: 'text', placeholder: 'Enter First Name', errorMessage: 'First name is required', max: 100 },
    { label: 'Last Name', name: 'lastNameSecondary', type: 'text', placeholder: 'Enter Last Name', errorMessage: 'Last name is required', max: 100 },
    { label: 'First Name(Latin)', name: 'firstNamePrimaryLatin', type: 'text', placeholder: 'Enter First Name', errorMessage: 'First name is required', max: 100 },
    { label: 'Last Name(Latin)', name: 'lastNameSecondaryLatin', type: 'text', placeholder: 'Enter Last Name', errorMessage: 'Last name is required', max: 100 },
    { label: 'National ID', name: 'nationalUid', type: 'text', placeholder: 'Enter National ID', errorMessage: 'National ID is required', max: 10 },
    { label: 'Date of Birth', name: 'dateOfBirth', type: 'date', placeholder: 'DD / MM / YYYY', errorMessage: 'Date of birth is required' },
    {
        label: 'Gender',
        name: 'gender',
        type: 'select',
        placeholder: 'Select Gender',
        options: ['Male', 'Female', 'Other'],
        errorMessage: 'Gender is required'
    },
    { label: 'Nationality', name: 'nationality', type: 'text', placeholder: 'Enter Nationality', errorMessage: 'Nationality is required', max: 100 },
    { label: 'Birth Country', name: 'birthCountry', type: 'text', placeholder: 'Enter Birth Country', errorMessage: 'Birth country is required', max: 100 },
    { label: 'Email ID', name: 'email', type: 'email', placeholder: 'Enter Your Email', errorMessage: 'Email is required', max: 100 },
    { label: 'CAN (Card Access Number)', name: 'cardAccessNumber', type: 'text', placeholder: 'Enter Card Access Number', errorMessage: 'Card Access Number is required', max: 10 },
    {
        label: 'Upload Photo',
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

        if (!value) {
            setFormData((prev) => ({
                ...prev,
                [name]: '',
            }))
        }

        if (name === "faceImageColor") {
            if (files[0]) {
                const reader = new FileReader();
                const allowedExtensions = ['jpg', 'jpeg', 'png'];
                const fileExtension = files[0]?.name.split('.').pop().toLowerCase();
                reader.readAsDataURL(files[0]);

                const fileSizeKB = files[0].size / 1024;

                if (fileSizeKB < 50 || fileSizeKB > 200) {
                    setErrors((prev) => ({
                        ...prev,
                        [name]: "The uploaded photo does not meet the required size. Please upload an image within the allowed size limits.", // clear error when typing
                    }));
                    return
                } else if (!allowedExtensions.includes(fileExtension)) {
                    setErrors((prev) => ({
                        ...prev,
                        [name]: "Invalid file type. Only JPG and PNG files are allowed.", // clear error when typing
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

                    reader.onerror = () => {
                        setErrors((prev) => ({
                            ...prev,
                            [name]: 'Failed to upload image please try again', // clear error when typing
                        }));
                    };
                }
            }
        } else if (name === "firstNamePrimaryLatin" || name === "lastNameSecondaryLatin") {
            if (/^[\p{Script=Latin} ]*$/u.test(value)) {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        } else if (name === "nationalUid" || name === "cardAccessNumber") {
            if (/^[a-zA-Z0-9]+$/.test(value)) {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }))
            }
        } else if (name === 'dateOfBirth') {
            const [day, month, year] = value.split('-');
            setFormData((prev) => ({
                ...prev,
                [name]: `${year}-${month}-${day}`,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        formConfig.forEach((field) => {
            const value = formData[field.name];

            if (field.name !== "cardAccessNumber" && !value) {
                newErrors[field.name] = field.errorMessage;
            } else if (field.name == "nationalUid" && value.length !== 10) {
                newErrors[field.name] = "Please enter a valid National ID";
            } else if (field.name === "email" && !/\S+@\S+\.\S+/.test(value)) {
                newErrors[field.name] = "Please enter a valid email address";
            } else if (field.name === "firstNamePrimary" && !/^[A-Za-z ]+$/.test(value)) {
                newErrors[field.name] = "First name must contain only alphabets";
            } else if (field.name === "lastNameSecondary" && !/^[A-Za-z ]+$/.test(value)) {
                newErrors[field.name] = "Last name must contain only alphabets";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClear = () => setShowFormClearMsg(true);

    const setGenderValue = (val) =>{
        setFormData((prev) => ({
            ...prev,
            gender: val,
        }));
    };

    const handlePreview = () => {
        if (validateForm()) {
            setShowPreviewDialog(prevState => !prevState);
        } else {
            setInvalidFormError("Please fill in all required fields before submitting the application.");
        }

    };

    const submitApplication = async () => {
        try {
            await http.post('/user-info', formData);
            showSuccessMsg(prevState => !prevState);
        } catch (err) {
            setInvalidFormError(err.response.data);
            setShowPreviewDialog(false);
        }
    }


    return (
        <div className="rounded-4xl px-12 pt-6 pb-12 bg-[#FFFDF6] min-[1060px]:w-[780px] max-[1060]:w-[680px] min-[860px]:-ml-15">
            <p className="text-[#3D4468] text-[18px] mb-5">Fields marked with an asterisk (*) are mandatory.</p>
            <form className="space-y-4">
                {formConfig.map((field) => (
                    <div key={field.name}>
                        <label className="block font-medium text-[#0033A0] text-[18px]">{field.label}{field.name !== "cardAccessNumber" && <span className="ml-1">*</span>}</label>

                        {field.type === 'select' ? (
                            <>
                                <Dropdown field={field} setValue={setGenderValue}/>
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
                                <Datepicker errors={errors} handleChange={handleChange} formData={formData} />
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
                                    className={`transition-colors duration-300 input input-bordered w-full mt-1 border-[2px] h-[60px] rounded-lg outline-none px-4 text-[18px] bg-[#ffffff] ${formData[field.name] ? "text-[#1B2142]" : "text-[#9FA1AD]"} ${errors[field.name] ? "border-red-500" : "border-[#707070]"}`}
                                    placeholder={field.placeholder}
                                    maxLength={field.max}
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