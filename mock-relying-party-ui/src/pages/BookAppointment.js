import React, { useEffect, useState } from "react";
import relyingPartyService from "../services/relyingPartyService";
import BookAppointment from "../components/BookAppointment";
import { useNavigate } from "react-router";
export default function BookAppointmentPage() {
  const userInfo_keyname = "user_info";
  const [userInfo, setUserInfo] = useState(null);
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
      setUserInfo(userInf);
    } else {
      navigateToLogin("session_expired", "Session Expired");
    }
  }, []);
  return (
    <BookAppointment
      userInfo={userInfo}
      relyingPartyService={relyingPartyService}
    />
  );
}