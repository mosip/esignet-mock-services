import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import clientDetails from "../constants/clientDetails";
import relyingPartyService from "../services/relyingPartyService";
export default function Header({
    i18nKeyPrefix = "sidenav",
}) {
    const userInfo_keyname = "user_info";
    const post_fetchUserInfo = relyingPartyService.post_fetchUserInfo;
    const { t, i18n } = useTranslation("translation", {
        keyPrefix: i18nKeyPrefix,
    });
    const [isOpen, setIsOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [userInfo, setUserInfo] = useState(null);
    const [address, setAddress] = useState(null);
    const [emailAddress, setEmailAddress] = useState(null);
    const navigate = useNavigate();

    const navigateToLogin = (errorCode, errorDescription) => {
        let params = "?";
        if (errorDescription) {
            params = params + "error_description=" + errorDescription + "&";
        }

        //REQUIRED
        params = params + "error=" + errorCode;
        navigate("/" + params, { replace: true });
    };

    useEffect(() => {
        const getSearchParams = async () => {
            let authCode = searchParams.get("code");
            let errorCode = searchParams.get("error");
            let error_desc = searchParams.get("error_description");
            if (errorCode) {
                navigateToLogin(errorCode, error_desc);
                return;
            }
            getUserDetails(authCode);
        };
        getSearchParams();
    }, []);

    const getUserDetails = async (authCode) => {
        setUserInfo(null);
        try {
            let client_id = clientDetails.clientId;
            let redirect_uri = clientDetails.redirect_uri_userprofile;
            let grant_type = clientDetails.grant_type;
            var userInfo = await post_fetchUserInfo(
                authCode,
                client_id,
                redirect_uri,
                grant_type
            );
            let address = getAddress(userInfo?.address);
            setAddress(address);
            setUserInfo(userInfo);
            setEmailAddress(userInfo?.email_verified ?? userInfo?.email);
            localStorage.setItem(userInfo_keyname, JSON.stringify(userInfo));
        } catch (errormsg) {
            //Load from local storage
            if (localStorage.getItem(userInfo_keyname)) {
                let userInf = JSON.parse(localStorage.getItem(userInfo_keyname));
                let address = getAddress(userInf?.address);
                setAddress(address);
                setEmailAddress(userInf?.email_verified ?? userInf?.email);
                setUserInfo(userInf);
            } else {
                navigateToLogin("session_expired", "Session Expired");
            }
        }
    };

    const getAddress = (userAddress) => {
        let address = "";

        if (userAddress?.formatted) {
            address += userAddress?.formatted + ", ";
        }

        if (userAddress?.street_address) {
            address += userAddress?.street_address + ", ";
        }

        if (userAddress?.addressLine1) {
            address += userAddress?.addressLine1 + ", ";
        }

        if (userAddress?.addressLine2) {
            address += userAddress?.addressLine2 + ", ";
        }

        if (userAddress?.addressLine3) {
            address += userAddress?.addressLine3 + ", ";
        }

        if (userAddress?.locality) {
            address += userAddress?.locality + ", ";
        }

        if (userAddress?.city) {
            address += userAddress?.city + ", ";
        }

        if (userAddress?.province) {
            address += userAddress?.province + ", ";
        }

        if (userAddress?.region) {
            address += userAddress?.region + ", ";
        }

        if (userAddress?.postalCode) {
            address += "(" + userAddress?.postalCode + "), ";
        }

        if (userAddress?.country) {
            address += userAddress?.country + ", ";
        }

        //returning after removing last ", " characters
        return address.substring(0, address.length - 2);
    };

    let el = (
        <>
            <div className="flex flex-wrap justify-between items-center px-4 md:px-6 py-2.5">
                <a className="flex-1 items-center truncate">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap">
                        {t("welcome")}, {userInfo?.name}
                    </span>
                    <p className="text-sm text-gray-500 truncate bg-gray-50 font-sans">
                        {t("message_notification")}
                    </p>
                </a>

                <div className="flex items-center">
                    <div className="relative">
                        <div className="flex">
                            <img
                                alt={"profile_picture"}
                                className="h-12 w-12 ml-3 mr-3"
                                src={
                                    userInfo?.picture
                                        ? userInfo.picture
                                        : "User-Profile-Icon.png"
                                }
                            />
                            <div className="flex my-3 max-w-xs">
                                <p className="text-gray-500 truncate bg-gray-50" title={userInfo?.name}>
                                    {userInfo?.name}
                                </p>
                            </div>
                            <button
                                className="flex items-center px-4 py-2  text-sm leading-5 font-medium rounded-md text-gray-700 bg-transparent hover:text-gray-500  active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <svg
                                    className="h-5 w-5 ml-1 text-black"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    {" "}
                                    <path stroke="none" d="M0 0h24v24H0z" />{" "}
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>
                        </div>
                        {isOpen && (
                            <div className="origin-top-left absolute ltr:right-0 rtl:left-0 max-w-xs shadow-lg">
                                <div className="flex flex-col px-1 py-1 rounded-md bg-white shadow-xs mt-2">
                                    <a className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" title={emailAddress}>
                                        {t("email")}:&nbsp;
                                        <span className="truncate">
                                            {emailAddress?.split("@")[0]}
                                        </span>
                                        @
                                        <span className="truncate">
                                            {emailAddress?.split("@")[1]}
                                        </span>
                                    </a>
                                    <a className="px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">
                                        {t("dob")}: {userInfo?.birthdate}
                                    </a>
                                    <a className="px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">
                                        {t("gender")}: {userInfo?.gender}
                                    </a>
                                    <a className="px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">
                                        {t("mobile_no")}: {userInfo?.phone_number}
                                    </a>
                                    <a className="px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">
                                        {t("address")}: {address}
                                    </a>
                                    <button
                                        className="w-full ltr:text-left rtl:text-right block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                                        onClick={(e) => {
                                            localStorage.removeItem(userInfo_keyname);
                                            navigateToLogin("logged_out", "User Logout");
                                        }}
                                    >
                                        {t("sign_out")}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
    return el;
}
