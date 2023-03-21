import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import relyingPartyService from "../services/relyingPartyService";
export default function MessagesInfo({
    username,
    i18nKeyPrefix = "sidenav",
}) {
    const get_messages = relyingPartyService.get_messages;
    const { t, i18n } = useTranslation("translation", {
        keyPrefix: i18nKeyPrefix,
    });
    const currentDate = new Date();
    const [messagesInfo, setMessagesInfo] = useState([]);

    useEffect(() => {
        getMessages();
    }, [])

    const getMessages = () => {
        setMessagesInfo(null);
        var messagesInfo = get_messages();
        setMessagesInfo(messagesInfo);
    };
    const messagesCount = messagesInfo.messages?.length

    return (
        <>
            <div className="w-full sm:w-full md:w-30 p-2">
                <p className="text-lg font-medium mb-4">
                    {t("new_messages")} <span className="">({messagesCount})</span>
                </p>
                {messagesInfo?.messages?.map((message, index) => {
                    const pastDate = new Date(
                        currentDate.getTime() - message["days"] * 24 * 60 * 60 * 1000
                    );
                    const formattedDate = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'full' }).format(pastDate);
                    return (
                        <div
                            className=" bg-white overflow-auto border rounded border-gray-200 hover:bg-gray-100 shadow sm:p-4"
                            key={index}
                        >
                            <div className="flex ">
                                <img
                                    className="w-8 h-8 rounded-full shadow-lg"
                                    src="./../images/doctor_logo.png"
                                    alt="Jese Leos image"
                                />

                                <div className="ml-3 mr-3">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {t(message["doctorName"])}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        {i18n.t(formattedDate)}
                                    </p>

                                    <p className="text-sm text-gray-500 truncate max-w-xs whitespace-pre-wrap">
                                        {t("hi")} {username}, {t(message["message"])}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="ml-auto -mx-1.5 -my-1.5  text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
                                    data-dismiss-target="#toast-message-cta"
                                    aria-label="Close"
                                >
                                    <svg
                                        className="h-4 w-4 text-gray-500"
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
                                        <circle cx="12" cy="12" r="1" />{" "}
                                        <circle cx="12" cy="19" r="1" />{" "}
                                        <circle cx="12" cy="5" r="1" />
                                    </svg>{" "}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    )
}