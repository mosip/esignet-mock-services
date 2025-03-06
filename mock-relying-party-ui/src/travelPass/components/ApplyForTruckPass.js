import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clientDetails from '../../constants/clientDetails';
import { useExternalScript } from "../../hooks/useExternalScript";


function ApplyForTruckPass() {
    const navigate = useNavigate();
    const signInButtonScript = window._env_.SIGN_IN_BUTTON_PLUGIN_URL;
    const state = useExternalScript(signInButtonScript);

    useEffect(() => {
        renderSignInButton();
    }, [state])

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
            ui_locales: 'en',
            claims: JSON.parse(decodeURIComponent(clientDetails.userProfileClaims)),
        };

        window.SignInWithEsignetButton?.init({
            oidcConfig: oidcConfig,
            buttonConfig: {
                shape: "soft_edges",
                labelText: 'Sign In with eSignet',
                width: "100%"
            },
            signInElement: document.getElementById("sign-in-with-esignet"),
        });
    }

    return (
        <div className='flex justify-center bg-[#F9F5FF] font-inter'>
            <div className='flex flex-col absolute mt-[1.1rem] gap-y-3'>
                <h2 className='font-semibold text-[2rem] text-[#42307D] place-self-center'>
                    Apply For TruckPass
                </h2>
                <img scr='images/left_band_2.png' />
                <div className='flex bg-white h-[29.6rem] w-[58.5rem] justify-around border items-center px-[1.8rem] mb-[1rem] rounded-xl shadow'>
                    <img src='images/apply_truck_pass_icon.png' className='h-[65%] w-[39%] mt-[1rem]' />
                    <div className='flex-col flex justify-between w-[21rem] h-[21rem] text-[#514A6A]'>
                        <h4 className='text-md font-base'>The Travel Pass Portal enables company representatives to apply for travel passes to cross borders</h4>
                        <p className='text-sm font-base'>Follow this simple process:</p>
                        <ol className='place-self-start space-y-3'>
                            <li className='flex gap-x-1 text-xs font-normal text-[#514A6A]'>
                                <p className='border-[0.1rem] border-[#7F56D9] rounded-[2rem] w-[1.1rem] h-[1.1rem] px-[0.24rem] text-[#7F56D9]'>1</p>
                   s             <p className='text-md font-base'>Enter Traveller/Driver National ID</p>
                            </li>
                            <li className='flex gap-x-1 text-xs font-normal text-[#514A6A]'>
                                <p className='border-[0.1rem] border-[#7F56D9] rounded-[2rem] w-[1.1rem] h-[1.1rem] px-[0.24rem] text-[#7F56D9]'>2</p>
                                <p className='text-md font-base'>Verify National ID</p>
                            </li>
                            <li className='flex gap-x-1 text-xs font-normal text-[#514A6A]'>
                                <p className='border-[0.1rem] border-[#7F56D9] rounded-[2rem] w-[1.1rem] h-[1.1rem] px-[0.24rem] text-[#7F56D9]'>3</p>
                                <p className='text-md font-base'>Upload E-Invoice</p>
                            </li>
                            <li className='flex gap-x-1 text-xs font-normal text-[#514A6A]'>
                                <p className='border-[0.1rem] border-[#7F56D9] rounded-[2rem] w-[1.1rem] h-[1.1rem] px-[0.24rem] text-[#7F56D9]'>4</p>
                                <p className='text-md font-base'>Travel Pass VC available for download from Inji Wallet</p>
                            </li>
                        </ol>
                        {/* <button className={`bg-purple-600 hover:bg-[#7F56D9] cursor-pointer w-[20rem] text-xs text-white py-2 mt-3 shadow-sm rounded-md`} onClick={fetchDetails}>
                            Enter Traveller National ID
                        </button> */}
                        <div id="sign-in-with-esignet" className="w-full"></div>
                    </div>
                </div>
            </div>
            <img src='images/background_pattern.png' className='h-[38rem] w-full' />
        </div>
    )
}

export default ApplyForTruckPass;