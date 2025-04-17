import React from "react";
import { useNavigate } from "react-router-dom";

export const Header = (props) => {
  const navigate = useNavigate();

  return (
    <header>
      <div
        data-testid="Header-Container"
        className="bg-white flex fixed top-0 left-0 right-0 bg-iw-background py-7 z-10 shadow"
      >
        <div className="container mx-32 flex justify-between items-center">
          <div
            data-testid="Header-InjiWeb-Logo-Container"
            className={`flex flex-row 'space-x-9'} justify-center items-center`}
          >
            <div
              role={"button"}
              tabIndex={0}
              onMouseDown={() => navigate("/")}
              onKeyUp={() => navigate("/")}
            >
              <img
                src={require("../../assets/logo.png")}
                className={`h-13 w-96 cursor-pointer'}`}
                data-testid="Header-InjiWeb-Logo"
                alt="Inji Web Logo"
              />
            </div>
          </div>
        </div>
        {props.showLogout && (
          <div>
            <button
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              onClick={() => navigate("/")}
            >
              <svg
                className="mx-1"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 13.1667C4 13.9416 4 14.3291 4.08519 14.647C4.31635 15.5098 4.99022 16.1836 5.85295 16.4148C6.17087 16.5 6.55836 16.5 7.33333 16.5H12.5C13.9001 16.5 14.6002 16.5 15.135 16.2275C15.6054 15.9878 15.9878 15.6054 16.2275 15.135C16.5 14.6002 16.5 13.9001 16.5 12.5V5.5C16.5 4.09987 16.5 3.3998 16.2275 2.86502C15.9878 2.39462 15.6054 2.01217 15.135 1.77248C14.6002 1.5 13.9001 1.5 12.5 1.5H7.33333C6.55836 1.5 6.17087 1.5 5.85295 1.58519C4.99022 1.81635 4.31635 2.49022 4.08518 3.35295C4 3.67087 4 4.05836 4 4.83333M9 5.66667L12.3333 9M12.3333 9L9 12.3333M12.3333 9H1.5"
                  stroke="white"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              &nbsp;&nbsp;Log out
            </button>
          </div>
        )}
        {props.showDownload && (
            <div>
              <button
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                Download your Wallet
              </button>
            </div>
        )}
      </div>
    </header>
  );
};
