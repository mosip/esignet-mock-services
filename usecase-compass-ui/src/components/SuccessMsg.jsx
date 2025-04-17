import { Link } from "react-router";

const SuccessMsg = () => {
    return (
        <div className="bg-[#ffffff] shadow rounded-3xl h-[100%] w-[70%] border-t-10 border-[#0A8754]">
            <div className="flex flex-col items-center text-center justify-center h-[80%]">
                <img src="/assets/icons/success_message_icon.svg" />
                <h1 className="text-[#000000] text-[32px] font-bold">Congratulations!</h1>
                <p className="text-[#666666] text-[20px]">Your application has been submitted successfully.</p>
            </div>
            <hr className="text-[#D7D8E1]" />
            <div className="flex justify-center flex-col items-center h-[20%] w-full">
                <Link to='/home' className="w-full text-center"><button className="text-[#ffffff] w-[50%] max-[1350px]:w-[70%] h-[60px] bg-[#FF671F] rounded-lg cursor-pointer">Go To Home</button></Link>
            </div>
        </div>
    )
};

export default SuccessMsg;