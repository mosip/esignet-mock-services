import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import clientDetails from "../../constants/clientDetails";
import {useExternalScript} from "../../hooks/useExternalScript";
import {useTranslation} from "react-i18next";

export const HomeFeatures = ({i18nKeyPrefix = "login"}) => {
    const navigate = useNavigate();
    const {i18n, t} = useTranslation("translation", {
        keyPrefix: i18nKeyPrefix,
    });
    const signInButtonScript = window._env_.SIGN_IN_BUTTON_PLUGIN_URL;
    const state = useExternalScript(signInButtonScript);

    useEffect(() => {
        renderSignInButton();

        i18n.on("languageChanged", function (lng) {
            renderSignInButton();
        });
    }, [state]);

    const renderSignInButton = () => {
        const oidcConfig = {
            authorizeUri: clientDetails.uibaseUrl + clientDetails.authorizeEndpoint,
            redirect_uri: clientDetails.redirect_uri_userprofile,
            client_id: clientDetails.clientId,
            scope: clientDetails.scopeUserProfile,
            nonce: clientDetails.nonce,
            state: clientDetails.state,
            acr_values: clientDetails.acr_values,
            claims_locales: clientDetails.claims_locales,
            display: clientDetails.display,
            prompt: clientDetails.prompt,
            max_age: clientDetails.max_age,
            ui_locales: i18n.language,
            claims: JSON.parse(decodeURIComponent(clientDetails.userProfileClaims)),
        };

        window.SignInWithEsignetButton?.init({
            oidcConfig: oidcConfig,
            buttonConfig: {
                shape: "soft_edges",
                labelText: t("sign_in_with"),
                width: "100%",
            },
            signInElement: document.getElementById("sign-in-with-esignet"),
        });
    };
    return (
        <div className="my-16 h-full bg-[url('./assets/bg.svg')] bg-repeat">
            <div className="mx-32 px-4 lg:px-8">
                <div className="flex">
                    <div className="mb-8 mt-28 w-2xl w-1/2">
                        <h1 className="font-medium text-gray-900 tracking-tight text-5xl leading-10">
                            Access Government Services <br className="hidden sm:block"/>
                            <span className="my-8">Anytime, Anywhere</span>
                        </h1>
                        <p className="mt-4 text-lg font-light text-gray-500">
                            The official digital portal to access your coMPASS credentials -
                            securely
                            <br className="hidden sm:block"/>
                            download, manage, and access your digital credentials anytime,
                            anywhere.
                        </p>
                        <div className="flex flex-wrap gap-4 font-light py-12 pr-12">
                            <div
                                className="bg-white border border-gray-300 rounded-md py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                                Register your Child's Birth
                            </div>
                            <div
                                className="bg-white border border-gray-300 rounded-md py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                                Utopia Elderly Care Assistance (UECA)
                            </div>
                            <div
                                className="bg-white border border-gray-300 rounded-md py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                                Register for Health Insurance (Utopia Health Fund - UHF)
                            </div>
                            <div
                                className="bg-white border border-gray-300 rounded-md py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                                Student Financial Aid
                            </div>
                            <div
                                className="bg-white border border-gray-300 rounded-md py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                                Apply for Adoption Services and Support
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 mx-2 my-16">
                        <img src={require("../../assets/banner.png")}/>
                    </div>
                </div>
                <div className="bg-white rounded-md border flex h-48 shadow-md">
                    <div className="bg-white py-12 pl-14 pr-0 flex flex-col justify-center w-[40%] ">
                        <div className="border-r-gray-200 border-r pr-14">
                            <p className="text-gray-700 mb-4 font-light text-center text-sm">
                                Conveniently view and track all your government services effortlessly. Login to
                                view all your entitled benefits.
                            </p>
                            {state === "ready" && <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                onClick={() => document.getElementById("sign-in-with-esignet").click()}
                            >
                                Login with comPASS ID
                            </button>}
                            {state === "ready" && <button
                                id="sign-in-with-esignet"
                                className="hidden"
                            >
                            </button>}
                            <div className="mt-2 text-gray-500 text-xs flex justify-center">
                                <svg width="10" height="14" viewBox="0 0 10 14" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1.2 13.9901C0.866664 13.9901 0.583464 13.8733 0.3504 13.6397C0.1168 13.4067 0 13.1235 0 12.7901V6.39014C0 6.0568 0.1168 5.7736 0.3504 5.54054C0.583464 5.30694 0.866664 5.19014 1.2 5.19014H1.6V3.59014C1.6 2.70107 1.9112 1.9456 2.5336 1.32374C3.15546 0.701337 3.91094 0.390137 4.8 0.390137C5.68904 0.390137 6.44456 0.701337 7.0664 1.32374C7.6888 1.9456 8 2.70107 8 3.59014V5.19014H8.4C8.73336 5.19014 9.01656 5.30694 9.2496 5.54054C9.4832 5.7736 9.6 6.0568 9.6 6.39014V12.7901C9.6 13.1235 9.4832 13.4067 9.2496 13.6397C9.01656 13.8733 8.73336 13.9901 8.4 13.9901H1.2ZM4.8 10.7901C5.13336 10.7901 5.41656 10.6733 5.6496 10.4397C5.8832 10.2067 6 9.9235 6 9.59014C6 9.25678 5.8832 8.97358 5.6496 8.74054C5.41656 8.50694 5.13336 8.39014 4.8 8.39014C4.46666 8.39014 4.18346 8.50694 3.9504 8.74054C3.7168 8.97358 3.6 9.25678 3.6 9.59014C3.6 9.9235 3.7168 10.2067 3.9504 10.4397C4.18346 10.6733 4.46666 10.7901 4.8 10.7901ZM2.8 5.19014H6.8V3.59014C6.8 3.0344 6.6056 2.56214 6.2168 2.17334C5.828 1.78454 5.35576 1.59014 4.8 1.59014C4.24426 1.59014 3.772 1.78454 3.3832 2.17334C2.9944 2.56214 2.8 3.0344 2.8 3.59014V5.19014Z"
                                        fill="#484848"/>
                                </svg>
                                <span>&nbsp;&nbsp;Securely login using your eSignet</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start m-auto px-4 py-6">
                        <div className="flex-shrink-0">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                                    fill="#DCFAE6"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M22.7952 9.8534L13.2485 19.0667L10.7152 16.3601C10.2485 15.9201 9.51522 15.8934 8.98188 16.2667C8.46188 16.6534 8.31522 17.3334 8.63522 17.8801L11.6352 22.7601C11.9285 23.2134 12.4352 23.4934 13.0085 23.4934C13.5552 23.4934 14.0752 23.2134 14.3685 22.7601C14.8485 22.1334 24.0085 11.2134 24.0085 11.2134C25.2085 9.98674 23.7552 8.90674 22.7952 9.84007V9.8534Z"
                                    fill="#079455"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-light text-gray-600">All-in-One Access</h3>
                            <p className="text-gray-500 text-sm font-extralight">Find services and benefits in one
                                place</p>
                        </div>
                    </div>
                    <div className="flex items-start m-auto px-4 py-6">
                        <div className="flex-shrink-0">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                                    fill="#DCFAE6"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M22.7952 9.8534L13.2485 19.0667L10.7152 16.3601C10.2485 15.9201 9.51522 15.8934 8.98188 16.2667C8.46188 16.6534 8.31522 17.3334 8.63522 17.8801L11.6352 22.7601C11.9285 23.2134 12.4352 23.4934 13.0085 23.4934C13.5552 23.4934 14.0752 23.2134 14.3685 22.7601C14.8485 22.1334 24.0085 11.2134 24.0085 11.2134C25.2085 9.98674 23.7552 8.90674 22.7952 9.84007V9.8534Z"
                                    fill="#079455"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-light text-gray-600">Quick & Easy</h3>
                            <p className="text-gray-500 text-sm font-extralight">Do more in less time, anytime</p>
                        </div>
                    </div>
                    <div className="flex items-start m-auto px-4 py-6">
                        <div className="flex-shrink-0">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                                    fill="#DCFAE6"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M22.7952 9.8534L13.2485 19.0667L10.7152 16.3601C10.2485 15.9201 9.51522 15.8934 8.98188 16.2667C8.46188 16.6534 8.31522 17.3334 8.63522 17.8801L11.6352 22.7601C11.9285 23.2134 12.4352 23.4934 13.0085 23.4934C13.5552 23.4934 14.0752 23.2134 14.3685 22.7601C14.8485 22.1334 24.0085 11.2134 24.0085 11.2134C25.2085 9.98674 23.7552 8.90674 22.7952 9.84007V9.8534Z"
                                    fill="#079455"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-light text-gray-600">Secure & Personalised</h3>
                            <p className="text-gray-500 text-sm font-extralight">Safe access, tailored to your needs</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white py-20">
                <div className="mx-auto px-4 flex justify-evenly">
                    <div className="flex mb-4 w-auto">
                        <img
                            src={require("../../assets/logo.png")}
                            className={`h-10`}
                            data-testid="Header-InjiWeb-Logo"
                            alt="Inji Web Logo"
                        />
                    </div>
                    <div className="flex flex-col font-light">
                        <a href="#" className="text-gray-700 hover:text-gray-900 mb-2">
                            Home
                        </a>
                        <a href="#" className="text-gray-700 hover:text-gray-900 mb-2">
                            Services
                        </a>
                        <a href="#" className="text-gray-700 hover:text-gray-900 mb-2">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-700 hover:text-gray-900">
                            Register your Grievance
                        </a>
                    </div>

                    <div className="flex flex-col font-light">
                        <a href="#" className="text-gray-700 hover:text-gray-900 mb-2">
                            News and Events
                        </a>
                        <a href="#" className="text-gray-700 hover:text-gray-900 mb-2">
                            About Us
                        </a>
                        <a href="#" className="text-gray-700 hover:text-gray-900">
                            Help and Support
                        </a>
                    </div>

                    <div className="flex ">
                        <div className="flex flex-col items-start">
                            <h4 className="font-semibold text-gray-900 mb-2">Download the app</h4>
                            <a href="#"
                               className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 mb-2 flex items-center">
                                Download for iOS
                            </a>
                            <a href="#"
                               className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 flex items-center">
                                Download for Android
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
