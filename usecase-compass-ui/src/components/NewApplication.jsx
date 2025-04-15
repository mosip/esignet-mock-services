import { Link } from "react-router";
import Form from "./Form";
import PreviewDialog from "../utils/PreviewDialog";
import { useState } from "react";
import SuccessMsg from "./SuccessMsg";

const NewApplication = () => {
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);

    return (
        <div className={`${showSuccessMsg ? "flex items-center justify-center bg-[length:100%_100%]" : "bg-[length:100%_50%]"} bg-[url('src/assets/background.png')] bg-no-repeat w-[100%] py-8 px-12`}>
            {showSuccessMsg ? (<SuccessMsg />) : (<div>
                <div className="flex space-x-3 mb-8">
                    <Link to="/home"><img src="src/assets/icons/back.svg" alt="back" className="cursor-pointer mt-1" /></Link>
                    <div><h1 className="text-[#162E63] text-[21px]">New Application</h1> <Link to="/home" className="text-[#FF671F] text-[14px] cursor-pointer">Home</Link></div>
                </div>
                <Form showSuccessMsg={setShowSuccessMsg}/>
            </div>)}

        </div>
    )
};


export default NewApplication;