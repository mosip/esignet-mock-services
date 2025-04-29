import { useState, useEffect, useRef } from "react";

const Dropdown = ({field, setValue}) => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const dropdownRef = useRef(null);
    const dropdownBtnRef = useRef(null);

    const sendSelectedValue = (val) =>{
        setValue(val);
        setSelectedValue(val);
        setShowPopup(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !dropdownBtnRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="relative inline-block text-left w-full text-[18px]">
            <div>
                <button ref={dropdownBtnRef} onClick={() => setShowPopup((prevState) => !prevState)} type="button" className={`inline-flex w-full h-[60px] items-center justify-between rounded-md border-2 border-[#707070] bg-white px-4 py-2 font-medium shadow-smfocus:outline-none cursor-pointer ${selectedValue ? "text-[#1B2142]" : "text-[#9FA1AD]"}`}>
                    {selectedValue ? selectedValue : field.placeholder}
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.063a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            {showPopup && <div ref={dropdownRef} className="absolute z-10 mt-2 px-2 py-1 w-full origin-top-right rounded-md bg-white shadow-lg border-1 border-[#E4E7EC]">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    {field.options.map((eachOpt) => (
                        <p onClick={() => sendSelectedValue(eachOpt)} className={`text-[#101828] px-3 rounded-md py-1 mb-2 flex justify-between items-center ${selectedValue === eachOpt ? "bg-[#F9FAFB]" : ""} cursor-pointer`} key={eachOpt}>
                            <span>{eachOpt}</span>
                            {selectedValue === eachOpt && <img src="/assets/icons/check.svg" alt="check" />}
                        </p>
                    ))}
                </div>
            </div>}
        </div>
    )
};

export default Dropdown;