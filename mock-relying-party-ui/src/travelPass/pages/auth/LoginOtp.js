import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";

function LoginOtp() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(new Array(6).fill(""));

    const handleLogin = () => {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/dashboard");
    };

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        let newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    return (
        <div className="flex text-center justify-center min-h-screen px-6 text-cente bg-white">
            <div className="p-10 rounded-2xl w-full max-w-lg text-center mt-10 space-y-8">
                <div className="h-[40px] w-[40px] bg-purple-200 rounded shadow mx-auto"></div>
                <div>
                    <h2 className="text-3xl font-semibold text-[#101828]">Check your email</h2>
                    <p className="text-[#475467] text-[15px] mt-3">We sent an OTP to your email</p>
                </div>
                {/* OTP Input Boxes */}
                <div className="flex justify-center gap-4">
                    {otp.map((digit, index) => (
                        <div key={index} className="flex items-center">
                            <Input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                value={digit}
                                maxLength={1}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="0"
                                className={`${digit ? "border-[#9E77ED] text-[#9E77ED]" : "border-[#D0D5DD] text-[#D0D5DD]"} w-[80px] h-[80px] text-center text-5xl font-[500] border-2 rounded-lg outline-none focus:border-[#9E77ED] focus:ring-2 focus:ring-[#9E77ED] focus:ring-offset-3 focus:ring-offset-white`}
                            />
                            {index === 2 && <div className="ml-4 flex justify-center flex-col"><div className="h-[5px] w-4 bg-[#D0D5DD] font-bold"></div></div>}
                        </div>
                    ))}
                </div>

                <button onClick={handleLogin} className="px-4 py-2 bg-[#7F56D9] text-white text-lg mt-2 rounded-[6px] font-semibold w-[360px] cursor-pointer">Verify</button>

                <p className="text-sm">
                    <span className="text-[#475467]">Didn’t receive the OTP?</span> <span className="text-[#6941C6] font-semibold">Click to resend</span>
                </p>
                <p className="font-semibold text-[#475467] text-sm flex items-center justify-center cursor-pointer">
                    &larr; Back to log in
                </p>
            </div>
        </div>
    )
}

export default LoginOtp;