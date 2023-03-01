import React, { useEffect, useState } from "react";
import relyingPartyService from "../services/relyingPartyService";
import BookAppointment from "../components/BookAppointment";
import { useNavigate } from "react-router";
export default function BookAppointmentPage() {
  const userInfo_keyname = "user_info";
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
    if (localStorage.getItem(userInfo_keyname)) {
      let userInf = JSON.parse(localStorage.getItem(userInfo_keyname));
      let address = getAddress(userInf?.address);
      setUserInfo(userInf);
      setAddress(address);
      setEmailAddress(userInf?.email_verified ?? userInf?.email);
    } else {
      navigateToLogin("session_expired", "Session Expired");
    }
  }, []);

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

  return (
    <BookAppointment
      userInfo={userInfo}
      address={address}
      emailAddress={emailAddress}
      relyingPartyService={relyingPartyService}
    />
  );
}
