
import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const states = {
    LOADING: "LOADING",
    LOADED: "LOADED",
    ERROR: "ERROR",
    AUTHENTICATING: "AUTHENTICATING",
};

export default function UserProfile() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [status, setStatus] = useState(states.LOADING);

    //Handle Login API Integration here
    const getUserDetails = async (authCode) => {
        setError(null);
        setUserInfo(null);

        try {
            /**
             * Replace with your backend endpoint to fetch user info
             * This endpoint should handle the auth code and return user details
             * We assume the backend is running on localhost:8888
             * Adjust the endpoint URL as per your backend configuration
             */
            const endpoint = 'http://localhost:8888/delegate/fetchUserInfo?code=' + authCode;
            const response = await axios.get(endpoint, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            var userInfo = response.data;

            setUserInfo(userInfo);
            setStatus(states.LOADED);
        } catch (errormsg) {
            setError({ errorCode: "", errorMsg: errormsg.message });
            setStatus(states.ERROR);
        }
    };

    useEffect(() => {
        const getQueryParams = async () => {
            let authCode = searchParams.get("code");
            let errorCode = searchParams.get("error");
            let error_desc = searchParams.get("error_description");

            if (errorCode) {
                return;
            }

            if (authCode) {
                getUserDetails(authCode);
            } else {
                setError({
                    errorCode: "authCode_missing",
                });
                setStatus(states.ERROR);
                return;
            }
        };
        getQueryParams();
    }, []);

    return <div>
        <div className='header'>Welcome {userInfo?.name}</div>
        {status === states.LOADING && <div>Loading Please Wait...</div>}
        {status === states.LOADED && (

            <div>
                <div className="card">
                    <img src={userInfo?.picture} alt="John" style={{ width: "100%" }} />
                    <div className='color-black mt-5 mb-10'>{userInfo?.email}</div>
                    <div className="color-black mb-10">
                        DoB: <span className="title color-black">{userInfo?.birthdate}</span>
                    </div>
                    <div className='color-black mb-10'>
                        Ph: <span className='color-black'>{userInfo?.phone_number}</span>
                    </div>
                </div>
            </div>

        )}
        {status === states.ERROR && <div>Oops there is some error.Please try after some time</div>}
    </div>
}

