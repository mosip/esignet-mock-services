import React from "react";

export const WelcomeBanner = (userInfo) => {
  return (
    <div className="bg-white shadow-sm rounded-3xl p-6 flex items-center justify-between w-[90%] mx-auto mt-6 mb-8 border-[1.75px] border-[#EBEBEB]">
      <div className="flex items-center">
        <div className="w-24 h-24 rounded-md overflow-hidden mr-4">
          <img
            alt="User Avatar"
            id={"user-avtar"}
            className="w-full h-full object-cover"
            src={
              userInfo?.user?.picture
                ? userInfo.user.picture
                : "User-Profile-Icon.png"
            }
          />
        </div>
        <div>
          <h2 className="text-[1.5rem] font-semibold text-gray-800">
            Welcome {userInfo?.user?.first_name} {userInfo?.user?.last_name}! 👋
          </h2>
          <p className="text-sm text-[#535862] pt-4 font-normal">
            Your gateway to seamless access to trusted digital government
            services
          </p>
        </div>
      </div>

      {/* Right Section (Search Bar) */}
      <div className=" h-14 w-1/2 flex border border-gray-300 rounded-md">
        <input
          type="text"
          placeholder="Search UtopiaGov"
          className="flex-grow pl-6 rounded-md rounded-tr-none rounded-br-none"
        />
        <button className="px-8 bg-[#2868E8] text-white rounded-md rounded-tl-none rounded-bl-none h-14">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 inline-block mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search
        </button>
      </div>
    </div>
  );
};
