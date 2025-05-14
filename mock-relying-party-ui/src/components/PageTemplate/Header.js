import React from "react";
import { useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export const Header = (props) => {
  const navigate = useNavigate();

  const handleMyAccount = () => {
    props.myProfile(true);
  };

  return (
    <header>
      <div
        data-testid="Header-Container"
        className="bg-white flex fixed top-0 left-0 right-0 bg-iw-background py-5 z-10 shadow"
      >
        <div className="container mx-[4.5em] flex justify-between items-center">
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
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <span className="justify-center outline-none hover:cursor-pointer bg-[#F3F8FE] text-[#2868E8] font-semibold pl-4 pr-5 py-2 mr-[4.75em] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center border-[2.5px] w-48 border-[#D3E7FE]">
                My Account
                <img
                  src="images/arrow_down.svg"
                  alt="dropdown_arrow"
                  className="ml-3 relative top-[1px]"
                />
              </span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[220px] bg-white rounded-lg shadow-md will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade p-3 border border-[#BCBCBC] outline-0 relative"
                sideOffset={5}
                align="end"
              >
                <DropdownMenu.Item
                  className="border-b-[1.75px] pt-1 pb-3 hover:cursor-pointer outline-0 hover:text-[#2868E8]"
                  onClick={handleMyAccount}
                >
                  My Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="border-b-[1.75px] py-3 flex text-[#C5363D] hover:cursor-pointer outline-0 hover:text-[#2868E8] icon-wrapper"
                  onClick={() => navigate("/")}
                >
                  <div>
                    <svg
                      className="logout-icon mr-2 relative top-1"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 13.1667C4 13.9416 4 14.3291 4.08519 14.647C4.31635 15.5098 4.99022 16.1836 5.85295 16.4148C6.17087 16.5 6.55836 16.5 7.33333 16.5H12.5C13.9001 16.5 14.6002 16.5 15.135 16.2275C15.6054 15.9878 15.9878 15.6054 16.2275 15.135C16.5 14.6002 16.5 13.9001 16.5 12.5V5.5C16.5 4.09987 16.5 3.3998 16.2275 2.86502C15.9878 2.39462 15.6054 2.01217 15.135 1.77248C14.6002 1.5 13.9001 1.5 12.5 1.5H7.33333C6.55836 1.5 6.17087 1.5 5.85295 1.58519C4.99022 1.81635 4.31635 2.49022 4.08518 3.35295C4 3.67087 4 4.05836 4 4.83333M9 5.66667L12.3333 9M12.3333 9L9 12.3333M12.3333 9H1.5"
                        stroke="#C5363D"
                        stroke-width="1.66667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
        {props.showDownload && (
          <div className="min-h-fit min-w-fit flex">
            <button
              className="bg-[#2868E8] hover:bg-blue-700 text-white px-6 py-3 mr-[4.5em] font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center self-center"
              onClick={() =>
                window.scrollTo({
                  left: 0,
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              }
            >
              Download your Wallet
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
