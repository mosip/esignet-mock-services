import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function LoginForm({ sentOtp }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [idError, setIdError] = useState('');

  const emailRegex = /(.+)@(.+){2,}\.(.+){2,}/;

  const footerMenu = [
    { icon: 'images/creditcard_check_icon.png', name: 'Instant Travel Pass Issuance ' },
    { icon: 'images/export_shield_tick_icon.png', name: 'Secure and Protected' },
    { icon: 'images/access_anywhere_icon.png', name: 'Access Anytime, Anywhere' },
    { icon: 'images/arrows_right_icon.png', name: 'Smooth Border Entry' }
  ]

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
    <div className="flex flex-col">
      <div className="flex gap-x-6 mb-[0.2rem] md:justify-between">
        <img src='images/travel_pas_welcome_page.png' alt='welcomeImage' className="h-[20rem] w-[60%]" />

        <div className="bg-white flex items-center w-[30%]">
          <div className="w-full max-w-sm md:space-y-8">
            <h2 className="md:text-lg lg:text-xl font-semibold mb-2 text-[#101828]">Log In</h2>
            <form className="space-y-6 w-full">
              <div>
                <label className="block md:text-xs lg:text-sm font-medium text-[#344054] mb-1">
                  Email
                </label>
                <input
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  type="text"
                  placeholder="Enter Your Email ID"
                  className="md:text-xs lg:text-sm w-[80%] h-[42%] px-4 py-2 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {idError && <div className="text-red-700 text-xs lg:text-sm">{idError}</div>}
              </div>
              <button type="button" onClick={handleLogin}
                className={`${!inputValue ? 'bg-[#b1b0b2] cursor-default' : 'bg-purple-600 hover:bg-[#7F56D9] cursor-pointer'} md:text-xs md:w-[80%] md:h-[42%] lg:text-sm lg:w-[80%] lg:h-[42%] py-2 text-white rounded-md hover: transition bg-opacity-100`}>
                Log in with OTP
              </button>
            </form>
          </div>
        </div>
      </div >
      <div className=" flex justify-evenly py-6 h-[7rem]">
        {footerMenu.map((item) => {
          return (
            <div className="flex-col md:space-y-[4%] text-[80%]">
              <img src={item.icon} className="h-[55%] place-self-center border-[2px] border-[#DFDCE6] p-1.5 rounded-md" />
              <p className="text-[#292437] place-self-center text-center font-semibold md:w-[6rem] lg:w-full">{item.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default LoginForm;