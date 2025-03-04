import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function LoginForm({ sentOtp }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [idError, setIdError] = useState('');

  const emailRegex = /(.+)@(.+){2,}\.(.+){2,}/;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      setInputValue(inputValue.pop());
    }
    if (e.key === "Enter") {
      handleLogin();
      e.preventDefault()
    }
  };

  const handleLogin = () => {
    if (!inputValue) {
      setIdError('*Email is required');
      return false;
    } else if (!emailRegex.test(inputValue)) {
      setIdError('*Please enter a valid email address');
      return false;
    }
    setIdError('');
    sentOtp();
    return true;
  };

  return (
    <div className="">
      <div className="flex gap-x-6 mb-[2.5rem]">
        <img src='images/travel_pas_welcome_page.png' alt='welcomeImage' className="h-[29rem] w-[52.5rem] " />

        <div className="bg-white flex items-center justify-center w-[40%]">
          <div className="w-full max-w-sm space-y-10">
            <h2 className="text-2xl font-semibold mb-2 text-[#101828]">Log In</h2>
            <form className="space-y-6 w-full">
              <div>
                <label className="block text-sm font-medium text-[#344054] mb-1">
                  Email
                </label>
                <input
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  type="text"
                  placeholder="Enter Your Email ID"
                  className="w-full px-4 py-2 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {idError && <div className="text-red-700">{idError}</div>}
              </div>
              <button type="button" onClick={handleLogin}
                className={`${!inputValue ? 'bg-[#b1b0b2] cursor-default' : 'bg-purple-600 hover:bg-[#7F56D9] cursor-pointer'} w-full h-[44px] py-2 text-white rounded-md hover: transition bg-opacity-100`}>
                Log in with OTP
              </button>
            </form>
          </div>
        </div>
      </div >
      <div className=" flex justify-evenly py-6 h-[7rem]">
        <div className="flex-col space-y-4">
          <img src='images/creditcard_check_icon.png' className="h-8 place-self-center border-[2px] border-[#DFDCE6] p-1.5 rounded-md" />
          <p className="text-[#292437] text-md font-semibold">Instant Travel Pass Issuance </p>
        </div>
        <div className="flex-col space-y-4">
          <img src='images/export_shield_tick_icon.png' className="h-8 place-self-center border-[2px] border-[#DFDCE6] p-1.5 rounded-md" />
          <p className="text-[#292437] text-md font-semibold">Secure and Protected </p>
        </div>
        <div className="flex-col space-y-4">
          <img src='images/access_anywhere_icon.png' className="h-8 place-self-center border-[2px] border-[#DFDCE6] p-1.5 rounded-md" />
          <p className="text-[#292437] text-md font-semibold">Access Anytime, Anywhere </p>
        </div>
        <div className="flex-col space-y-4">
          <img src='images/arrows_right_icon.png' className="h-8 place-self-center border-[2px] border-[#DFDCE6] p-1.5 rounded-md" />
          <p className="text-[#292437] text-md font-semibold">Smooth Border Entry </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;