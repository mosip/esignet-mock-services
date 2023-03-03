import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";

export default function ProfileUI({
  relyingPartyService,
  i18nKeyPrefix = "profileui",
}) {
  const get_currentMedications = relyingPartyService.get_currentMedications;
  const get_nextAppointment = relyingPartyService.get_nextAppointment;
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: i18nKeyPrefix,
  });

  const currentDate = new Date();
  //Date with 10 days ahead from current date
  const futureDate = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000);

  const [medicationInfo, setMedicationInfo] = useState([]);
  const [appointmentInfo, setappointmentInfo] = useState([]);


  useEffect(() => {
    getCurrentMedication();
    getAppointment();
  }, []);

  //Getting Medication from json
  const getCurrentMedication = () => {
    setMedicationInfo(null);
    var medicationInfo = get_currentMedications();
    setMedicationInfo(medicationInfo)
  };

  //Next Appointment details
  const getAppointment = () => {
    setappointmentInfo(null);
    var appointmentInfo = get_nextAppointment();
    setappointmentInfo(appointmentInfo);
  };

  let el = (
    <>
      <div className="p-1 ">
        <div className="flex">
          <div className="flex flex-wrap w-full sm:w-30 md:w-30 p-1">
            <div className="w-full sm:w-1/2 md:w-30 p-1 ">
              <p className="text-lg font-medium mb-4">Current Medication</p>

              <div className="bg-white border border-gray-200 rounded   shadow sm:p-4">
                <div className="flow-root">
                  <ul role="list" className="divide-y divide-gray-200">
                    {medicationInfo?.medications?.map((data, index) => (
                      <li className="py-3 sm:py-1" key={index}>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0 ">
                            <p className="text-xs font-medium text-gray-900 truncate whitespace-pre-wrap inline-flex">
                              <svg
                                className="h-5 w-5 text-gray-500"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                {" "}
                                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                                <path d="M4.5 12.5l8 -8a4.94 4.94 0 0 1 7 7l-8 8a4.94 4.94 0 0 1 -7 -7" />{" "}
                                <path d="M8.5 8.5l7 7" />
                              </svg>
                              {data["tabletName"]}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {data["dailyDosage"]}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}

                    <li>
                      <div className="flex items-center justify-between my-1 ">
                        <a
                          href="#"
                          className="text-sm text-gray-500 truncate hover:underline "
                        >
                          See all interactions
                        </a>
                        <a
                          href="#"
                          className="text-sm text-gray-500 truncate hover:underline inline-flex"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 -2 24 24"
                            fill="none"
                            stroke="#000000"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="arcs"
                          >
                            <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38" />
                          </svg>
                          Request refill
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-1/2 md:w-30 p-1">
              <p className="text-lg font-medium mb-4">Next Appointment</p>
              <div className="bg-white border border-gray-200 rounded shadow sm:p-4">
                <div className="flow-root">
                  <ul role="list" className="divide-y divide-gray-200">
                    {appointmentInfo?.appointment?.map((data, index) => (
                      <li className="py-3 sm:py-1" key={index}>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0 my-1">
                            <p className=" font-medium text-lg text-gray-900 truncate whitespace-pre-wrap">
                              {futureDate.toDateString()}
                            </p>
                            <p className="text-xs text-gray-500 truncate inline-flex whitespace-pre-wrap">
                              <svg
                                className="h-4 w-4 text-gray-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                {" "}
                                <circle cx="12" cy="12" r="10" />{" "}
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              {data["time"]}
                            </p>

                            <div className="text-xs text-gray-500 truncate whitespace-pre-wrap inline-flex">
                              <svg
                                className="h-4 w-4 text-gray-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                {" "}
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />{" "}
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              {data["location"]}
                            </div>

                            <div className="py-2">
                              <div className="flex">
                                <img
                                  className="w-8 h-8 rounded-full shadow-lg"
                                  src="./../images/doctor_logo.png"
                                  alt="Jese Leos image"
                                />
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900 truncate whitespace-pre-wrap">
                                    {data["doctorName"]}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {data["department"]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                    <li>
                      <div className="flex items-center justify-center  border-t border-gray-300">
                        <a
                          href="#"
                          className="text-sm text-blue-600 hover:underline truncate my-0.5"
                        >
                          Manage Appointment
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  return el;
}
