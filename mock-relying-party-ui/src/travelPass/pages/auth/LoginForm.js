import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function LoginForm({ sentOtp }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [idError, setIdError] = useState('');

  const emailRegex = /(.+)@(.+){2,}\.(.+){2,}/;

  const footerMenu = [
    { icon: 'images/creditcard_check_icon.png', name: 'Instant TruckPass Issuance ' },
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
    <div className="flex flex-col space-y-3">
      <div className="flex gap-x-6 mb-[0.2rem] md:justify-between">
        <img src='images/truck_pass_welcome_page.png' alt='welcomeImage' className="w-[58%] md:h-[380px] xl:h-[450px] 2xl:h-[750px]" />

        <div className="bg-white flex items-center w-[30%]">
          <div className="w-full max-w-sm md:space-y-8">
            <h2 className="md:text-lg xl:text-2xl 2xl:text-3xl font-bold mb-2 text-[#101828]">Log In</h2>
            <form className="space-y-6 w-full">
              <div>
                <input
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  type="text"
                  placeholder="Enter Your Email ID"
                  className="md:text-xs lg:text-sm sm:w-[70%] xl:w-[80%] px-4 py-1.5 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                />
                {idError && <div className="text-red-700 text-xs lg:text-sm">{idError}</div>}
              </div>
              <button type="button" onClick={handleLogin}
                className={`${!inputValue ? 'bg-[#b1b0b2] cursor-default' : 'bg-purple-600 hover:bg-[#7F56D9] cursor-pointer'} md:text-xs lg:text-sm sm:w-[70%] xl:w-[80%] font-semibold py-1.5 text-white rounded-md hover: transition bg-opacity-100`}>
                Log in with OTP
              </button>
            </form>
          </div>
        </div>
      </div >
      <div className=" flex justify-evenly py-6 lg:h-[7rem] 2xl:h-[8rem]">
        {footerMenu.map((item) => {
          return (
            <div className="flex-col space-y-[4%] sm:text-xs lg:text-sm 2xl:text-xl">
              <img src={item.icon} className="h-[55%] sm:h-[45%] place-self-center border-[2px] border-[#DFDCE6] p-1.5 rounded-md" />
              <p className="text-[#292437] place-self-center text-center font-semibold md:w-[6rem] lg:w-full">{item.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default LoginForm;