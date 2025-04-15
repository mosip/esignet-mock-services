import React from "react"; // Example user icon
import { FaUserCircle, FaChevronDown } from "react-icons/fa";

export const WelcomeBanner = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between my-16 mx-auto w-[90%]">
      {/* Left Side: Welcome Text and Logo */}
      <div className="flex items-center">
        <div className="mr-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome, User!
          </h1>
          <p className="text-gray-600 text-sm">
            Your gateway to access to trusted digital government services
          </p>
        </div>
      </div>

      {/* Right Side: User Profile Dropdown */}
      <div className="relative">
        <button className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full py-2 px-4">
          <img src={require("../../assets/user.png")} className="w-12 px-1" />
          Full Name
          <FaChevronDown className="w-4 h-4 ml-1" />
        </button>
        {/* Placeholder for dropdown menu (not styled) */}
        {/* You would typically use a library like Headless UI or implement custom logic for the dropdown */}
      </div>
    </div>
  );
};
