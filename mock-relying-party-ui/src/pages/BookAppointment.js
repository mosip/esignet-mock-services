import React from 'react';
import relyingPartyService from '../services/relyingPartyService';
import BookAppointment from '../components/BookAppointment';
export default function BookAppointmentPage() {
  return (
    <BookAppointment
      relyingPartyService={relyingPartyService}
    />);
}

