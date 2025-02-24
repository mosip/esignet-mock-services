import React from "react";
import { useTranslation } from "react-i18next";

function LoginForm({ sentOtp }) {
  const { t } = useTranslation();

  const handleLogin = () => {
    sentOtp();
  }

  return (
    <div className="">
      <div className="flex gap-x-6">
        <img src='images/travel_pas_welcome_page.png' alt='welcomeImage' className="h-[33rem] w-[54rem]" />

        <div className="bg-white flex items-center justify-center w-[40%]">
          <div className="w-full max-w-sm space-y-10">
            <h2 className="text-2xl font-semibold mb-2 text-[#101828]">Log In</h2>
            <form className="space-y-6 w-full">
              <div>
                <label className="block text-sm font-medium text-[#344054] mb-1">
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Email ID"
                  className="w-full px-4 py-2 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button type="button" className="w-full h-[44px] py-2 text-white rounded-md hover: transition bg-[#7F56D9] bg-opacity-100 cursor-pointer" onClick={handleLogin}>
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