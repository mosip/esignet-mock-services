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
                labelText: 'Add Drivers',
                width: "100%"
            },
            signInElement: document.getElementById("sign-in-with-esignet"),
        });
    }

    return (
        <div className='flex justify-center bg-[#F9F5FF] font-inter h-full'>
            <div className='flex flex-col absolute mt-[1.1rem] sm:gap-y-5 md:gap-y-7 2xl:gap-y-7 w-full items-center'>
                <div className='flex bg-white w-[60%] sm:h-[290px] md:h-[360px] 2xl:h-[550px] justify-between border items-center px-[7%] rounded-xl shadow-sm'>
                    <img src='images/apply_truck_pass_icon.png' className='sm:h-[160px] md:h-[250px] 2xl:h-[450px] mt-[1rem]' />
                    <div className='flex flex-col'>
                        <div className='flex flex-col justify-evenly sm:h-[6rem] md:h-[10rem] 2xl:h-[21rem] sm:w-[9.5rem] md:w-[17rem] 2xl:w-[31rem] text-[#514A6A]'>
                            <h2 className='font-[600] sm:text-[1rem] md:text-[1.7rem] 2xl:text-[3rem] text-[#42307D]'>
                                Apply For TruckPass
                            </h2>
                            <h4 className=' sm:text-[0.5rem] md:text-[0.8rem] 2xl:text-[1.65rem] font-[450] text-[#514A6A]'>
                                The TruckPass Portal enables company representatives to apply for truck passes to enable cross border travel for drivers
                            </h4>
                        </div>
                        <div className='flex items-center gap-x-2 mt-[5%]'>
                            <div id="sign-in-with-esignet" className='w-full items-center'></div>
                            {/* <img src={'images/info_icon.png'} className='md:h-4 2xl:h-8 cursor-pointer' /> */}
                        </div>
                    </div>
                </div>
                <div className='flex justify-between bg-[#42307D] w-[60%] sm:h-[100px] md:h-[130px] 2xl:h-[190px] border items-center px-[4%] rounded-xl shadow-sm'>
                    <div className='w-[16%] text-white'>
                        <h1 className='sm:text-[1rem] md:text-[1.7rem] 2xl:text-[2.9rem] font-bold'>1000+</h1>
                        <p className='text-[0.38rem] md:text-xs 2xl:text-xl'>TruckPasses issued monthly</p>
                    </div>
                    <div className='w-[22%] text-white'>
                        <h1 className='sm:text-[1rem] md:text-[1.7rem] 2xl:text-[2.9rem] font-bold'>40%</h1>
                        <p className='text-[0.38rem]  md:text-xs 2xl:text-xl'>Reduction in waiting time with instant digital verification</p>
                    </div>
                    <div className='w-[22%] text-white'>
                        <h1 className='sm:text-[1rem] md:text-[1.7rem] 2xl:text-[2.9rem] font-bold'>50+</h1>
                        <p className='text-[0.38rem]  md:text-xs 2xl:text-xl'>Border checkpoints integrated for seamless approvals.</p>
                    </div>
                </div>
            </div>
            <img src='images/background_pattern.png' className='sm:h-[450px] md:h-[580px] 2xl:h-[900px] w-full' />
        </div>
    )
}

export default ApplyForTruckPass;