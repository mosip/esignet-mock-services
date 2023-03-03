import React from "react";
import relyingPartyService from "../services/relyingPartyService";
import BookAppointment from "../components/BookAppointment";
import Sidenav from "../components/Sidenav";
export default function BookAppointmentPage() {
  
  return (
    <Sidenav relyingPartyService={relyingPartyService} component={React.createElement(BookAppointment)}
    />
  );
}
