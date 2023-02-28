import React from 'react';
import { Link } from 'react-router-dom';
export default function AppointmentConfirmation({ isOpen, onClose }) {

    return (
        <div
            className={`fixed inset-0 ${isOpen ? 'block' : 'hidden'}`}
        >
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="bg-white rounded-lg p-8">
                    <div className="flex items-center">
                        {/* <img className="h-60 w-full " src='images/BookingConfirmation.jpeg'></img> */}



                        <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white">
                                    
                                    <div className="flex items-start justify-between bg-blue-400 p-2 border-b border-solid border-slate-200 rounded-t">
                                        <h3 className="text-2xl font-semibold">
                                            Appointment Booked Successfully !
                                        </h3>

                                    </div>
                                    
                                    <div className="relative p-2 flex-auto">
                                        <ul>
                                            <li>
                                                <p className="my-2 font-semobold text-lg text-blue-700">
                                                    Name:
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                
                                    <div className="flex items-center justify-end p-2 ">
                                        <Link to="/userprofile">
                                            <button className="bg-blue-500 hover:bg-blue-700 text-white left-0 p-2 m-2 font-bold rounded">
                                                Home
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>




                    </div>

                </div>
            </div>
        </div>
    );
}

