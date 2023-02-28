import React from "react";
import relyingPartyService from "../services/relyingPartyService";
import BookAppointment from "../components/BookAppointment";
import { useLocation } from "react-router-dom";
import { Error } from "../common/Errors";
import { Buffer } from "buffer";
export default function BookAppointmentPage() {
  const location = useLocation();
  let decodeUserInfo = Buffer.from(location.hash ?? "", "base64")?.toString();
  let parsedUserInfo = null;
  try {
    parsedUserInfo = JSON.parse(decodeUserInfo);
  } catch (error) {
    return (
      <div className="flex justify-center items-center min-h-[340px] flex shadow-lg rounded bg-[#F8F8F8]">
        <div className="w-96 px-5">
          <Error errorCode={"parsing_error_msg"} />
        </div>
      </div>
    );
  }
  return (
    <BookAppointment
      userInfo={parsedUserInfo}
      relyingPartyService={relyingPartyService}
    />
  );
}