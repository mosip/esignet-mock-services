import React from "react";

export const WelcomeBanner = () => {
  return (
      <div className="bg-white shadow rounded-3xl p-4 flex items-center justify-between w-[90%] mx-auto mt-6 mb-8">
          <div className="flex items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mr-4">
                  <img
                      alt="User Avatar"
                      id={"user-avtar"}
                      className="w-full h-full object-cover"
                  />
              </div>
              <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                      Welcome &lt;FullName&gt;! 👋
                  </h2>
                  <p className="text-sm text-gray-500">
                      Your gateway to seamless access to trusted digital government services
                  </p>
              </div>
          </div>

          {/* Right Section (Search Bar) */}
          <div className=" h-14 w-1/2 pl-8 flex border border-gray-300 rounded-md">
              <input
                  type="text"
                  placeholder="Search UtopiaGov"
                  className="focus:border-none flex-grow hover:border-none border-none  "
              />
              <button
                  className=" px-8 bg-blue-500 text-white rounded-md h-14"
              >
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
