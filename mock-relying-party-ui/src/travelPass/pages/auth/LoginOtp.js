import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";

function LoginOtp() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [verify, setVerify] = useState(false);
    const [disableBtn, setDisableBtn] = useState(true);

    const handleLogin = () => {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/applyForTravelPass");
    };

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        if (index === 5 && value) {
            setDisableBtn(false);
            setVerify(true);
        }

        if (index < 7 && !value) {
            setDisableBtn(true);
            setVerify(false);
        }

        let newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
            }
        }
    };

    const onClickBackArrow = () => {
        navigate('/login')
    };

    return (
        <div className="flex text-center justify-center px-6 text-cente bg-white">
            <img src='images/background_pattern_decorative.png' className="h-[28rem]"/>
            <div className="p-10 rounded-2xl fixed w-full max-w-lg text-center mt-10 space-y-8">
                <div className=" flex h-[40px] w-[40px] rounded shadow place-self-center bg-white">
                    <img src='images/mail_id_icon.png' className="m-auto" />
                </div>
                <div>
                    <h2 className="text-3xl font-semibold text-[#101828]">Check your email</h2>
                    <p className="text-[#475467] text-[15px] mt-3">We sent a OTP to your email</p>
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
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                placeholder="0"
                                className={`${digit ? "border-[#9E77ED] text-[#9E77ED]" : "border-[#D0D5DD] text-[#D0D5DD]"} w-[80px] h-[80px] text-center text-5xl font-[500] border-2 rounded-lg outline-none focus:border-[#9E77ED] focus:ring-2 focus:ring-[#9E77ED] focus:ring-offset-3 focus:ring-offset-white`}
                            />
                            {index === 2 && <div className="ml-4 flex justify-center flex-col">
                                <div className="h-[5px] w-4 bg-[#D0D5DD] font-bold"></div>
                            </div>
                            }
                        </div>
                    ))}
                </div>

                <button disabled={disableBtn} onClick={handleLogin}
                    className={`px-4 py-2 ${verify ? 'bg-[#7F56D9] cursor-pointer' : 'bg-[#D0D5DD] cursor-default'} text-white text-lg mt-2 rounded-[6px] font-semibold w-[360px]`}
                >
                    Verify
                </button>

                <p className="font-semibold text-[#475467] text-sm flex items-center justify-center cursor-pointer" onClick={onClickBackArrow}>
                    &larr; Back to log in
                </p>
            </div>
        </div>
    )
}

export default LoginOtp;