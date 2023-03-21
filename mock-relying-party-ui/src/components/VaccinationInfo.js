import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import relyingPartyService from "../services/relyingPartyService";
export default function VaccinationInfo({
    i18nKeyPrefix = "sidenav",
}) {
    const get_vaccinationinfo = relyingPartyService.get_vaccinationinfo;
    const { t, i18n } = useTranslation("translation", {
        keyPrefix: i18nKeyPrefix,
    });
    const currentDate = new Date();
    const [vaccineInfo, setVaccineInfo] = useState([]);

    useEffect(() => {
        getVaccinationInfo();
    }, [])

    const getVaccinationInfo = () => {
        setVaccineInfo(null);
        var vaccineInfo = get_vaccinationinfo();
        setVaccineInfo(vaccineInfo);
    };

    return (
        <>
            <div className="w-full grid grid-cols-3 rounded bg-white border border-gray-200 shadow sm:p-4 m-1">
                <div>
                    <p className=" text-lg font-medium ">{t("vaccinations")}</p>
                </div>
                <div className="col-end-5">
                    <a
                        href="#"
                        className=" text-sm text-gray-500 truncate hover:underline"
                    >
                        {t("vaccinations_history")}
                    </a>
                </div>
            </div>
            <div className="w-full overflow-x-auto">
                <table className="p-4 w-full table-auto whitespace-pre-wrap shadow-lg text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-white">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                <p>{t("vaccination_details")}</p>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t("date")}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t("vaccination_center")}
                            </th>

                            <th scope="col" className="px-6 py-3">
                                {t("total_cost")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {vaccineInfo?.vaccinations?.map((item, idx) => {
                            const pastDate = new Date(
                                currentDate.getTime() -
                                item["days"] * 24 * 60 * 60 * 1000
                            );
                            return (
                                <tr className="bg-white border-b" key={idx}>
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        <p className="text-xs">{t(item["vaccinationName"])}</p>
                                    </th>
                                    <td className="px-6 py-4">
                                        <p>{pastDate.toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p>{t(item["vaccinationCenter"])}</p>
                                    </td>
                                    <th className="px-6 py-4">
                                        <p>{item["totalCost"]}</p>
                                    </th>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}