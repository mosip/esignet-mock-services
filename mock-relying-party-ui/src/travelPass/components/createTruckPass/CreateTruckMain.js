import React, { useEffect, useRef, useState } from "react";
import Stepper from "../Stepper";
import { useNavigate, useSearchParams } from "react-router-dom";
import clientDetails from "../../../constants/clientDetails";
import relyingPartyService from "../../../services/relyingPartyService";
import Error from "../../../common/Errors";
import UploadEinvoicePage from "./UploadEinvoicePage";
import PreviewDetails from "./PreviewDetails";
import CongratulationsPopup from "./CongratulationsPopup";

function CreateTruckMain() {
    const [dataLoaded, setDataLoaded] = useState(true);
    const [showSuccesMsg, setShowSuccesMsg] = useState(false);
    const successMsgRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState({ errorCode: "", errorMsg: "" });
    const [showUploadSection, setShowUploadSection] = useState(false);
    const [showPrevDetails, setShowPrevDetails] = useState(false);
    const [showCongratulation, setShowCongratulation] = useState(false);
    const [revert, setRevert] = useState(false);

    const SuccessMsg = () => {
        return (
            <div className={`flex justify-between items-center lg:px-[7rem] md:px-[2rem] bg-[#57A04B] lg:h-[2.5rem] md:h-[1.8rem] w-full shadow-sm absolute`}>
                <p className="md:text-xs lg:text-sm text-white font-semibold">
                    Your details have been successfully fetched from the national ID using
                    eSignet
                </p>
                <img
                    src="images/close_icon.png"
                    alt="closeIcon"
                    className="cursor-pointer md:h-[0.6rem] lg:[1rem]"
                    onClick={closeSuccessTag}
                />
            </div>
        );
    };

    const personalDetails = {
        "sub": "w4bQCdfMNkR73MDaqlm0-BjhrXIh9iktJLKPxxwkQV4",
        "birthdate": "1987/11/25",
        "address": {
            "locality": "yuanwee",
            "street_address": "Slung",
            "country": "Cmattey",
            "region": "yuanwee",
            "postal_code": "45009"
        },
        "gender": "Male",
        "name": "Siddharth K Mansour",
        "phone_number": "+919427357934",
        "email": "siddhartha.km@gmail.com",
    };

    const identifications = {
        "documentType": "National ID",
        "uin": '7383637702'
    };

    const inVoiceDetails = {
        "inVoiceNumber": "Myemail@gmail.com",
        "invoiceDate": "16/02/2025",
        "expoterName": "XYZ Exporter ",
        "importerName": "ABC Importer",
        "truckNumber": "XYZ 123 A 78",
        "checkPostNumber": "Post Number 01",
        "depatureDate": "17/02/2025",
        "returnDate": "18/02/2025",
        "originCountry": "India",
        "destinationCountry": "Bhutan",
        "axle_size": "10KB"
    };

    const { post_fetchUserInfo } = {
        ...relyingPartyService,
    };

    const navigateToLogin = (errorCode, errorDescription) => {
        let params = "?";
        if (errorDescription) {
            params = params + "error_description=" + errorDescription + "&";
        }

        //REQUIRED
        params = params + "error=" + errorCode;

        navigate(process.env.PUBLIC_URL + "/" + params, { replace: true });
    };

    useEffect(() => {
        const getSearchParams = async () => {
            let authCode = searchParams.get("code");
            let errorCode = searchParams.get("error");
            let error_desc = searchParams.get("error_description");

            if (errorCode) {
                // navigateToLogin(errorCode, error_desc);
                // return;
            }

            if (authCode) {
                getUserDetails(authCode);
            } else {
                setError({
                    errorCode: "authCode_missing",
                });
                // setStatus(states.ERROR);
                return;
            }
        };
        setShowUploadSection(true);
        getSearchParams();
        setTimeout(() => {
            setShowSuccesMsg(false);
        }, 6000);
    }, []);

    const getUserDetails = async (authCode) => {
        setError(null);
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
            )
            setUserInfo(userInfo);

            { userInfo && setShowSuccesMsg(true) }
        } catch (errormsg) {
            setError({ errorCode: "", errorMsg: errormsg.message });
        }
    };

    const closeSuccessTag = () => {
        setShowSuccesMsg(false);
    };

    const goBackBtn = () => {
        navigate('/applyForTruckPass');
    };

    const moveBackToUpload = () => {
        setShowUploadSection(true);
        setShowPrevDetails(false);
        setRevert(true);
    };

    const onSubmit = () => {
        setShowUploadSection(false);
        setShowPrevDetails(false);
        setShowCongratulation(true);
    };


    return (
        <div className="flex flex-col bg-[#F9F5FF] w-full h-full font-inter">
            {showSuccesMsg && <SuccessMsg />}
            <div className="flex flex-col gap-y-[1.5rem] md:mx-[1.5rem] md:my-[1.8rem] lg:mx-[4.71rem] lg:my-[2rem]">
                <div className="bg-white lg:h-[9.5rem] md:h-[8rem] border border-[#E4E7EC] rounded-lg shadow-sm">
                    <Stepper uploadStatus={showPrevDetails} previewStatus={showCongratulation} moveBack={revert} />
                </div>
                {showUploadSection && !showPrevDetails &&
                    <UploadEinvoicePage
                        userInfo={personalDetails}
                        inVoiceDetails={inVoiceDetails}
                        goBack={goBackBtn}
                        setShowPrevDetails={setShowPrevDetails}
                        setRevert={setRevert}
                    />
                }
                {showPrevDetails &&
                    <PreviewDetails
                        personalDetails={personalDetails}
                        identifications={identifications}
                        eInvoiceDetails={inVoiceDetails}
                        goBack={moveBackToUpload}
                        submitBtn={onSubmit}
                    />
                }
                {showCongratulation && !showPrevDetails && !showUploadSection &&
                    <CongratulationsPopup />
                }
            </div>
        </div>
    );
}

export default CreateTruckMain;
