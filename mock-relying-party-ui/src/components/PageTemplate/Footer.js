import React from "react";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  return (
    <footer
      data-testid="Footer-Container"
      className="bg-white font-extralight fixed bottom-0 left-0 right-0 py-4 transform rotate-180 shadow-sm shadow-iw-shadow bg-iw-footer"
    >
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-end sm:items-center">
        <div className={"flex flex-row items-center me-4"}>
          <p
            data-testid="Footer-Text"
            className="ps-2 text-iw-subText transform rotate-180"
          >
            &nbsp;&nbsp;1800-UTOPIA
          </p>
          <img
            className={"h-4 transform rotate-180"}
            src={require("../../assets/phone.png")}
            alt={"phone logo"}
          />
        </div>
        <div className={"flex flex-row items-center me-4"}>
          <p
            data-testid="Footer-Text"
            className="ps-2 text-iw-subText transform rotate-180"
          >
            &nbsp;&nbsp;support@utopia.gov
          </p>
          <img
            className={"h-4 transform mx-auto rotate-180"}
            src={require("../../assets/mail.png")}
            alt={"mail logo"}
          />
        </div>
        <div className={"flex flex-row items-center me-4"}>
          <p
            data-testid="Footer-Text"
            className="ps-2 text-iw-subText transform rotate-180"
          >
            &nbsp;&nbsp;comPASS services are now available in all regions.
          </p>
          <img
            className={"h-5 transform mx-auto rotate-180"}
            src={require("../../assets/megaphone.png")}
            alt={"megaphone logo"}
          />
        </div>

        <p
          data-testid="Footer-Text"
          className="ps-7 text-iw-subText transform rotate-180"
        >
          ©&nbsp;&nbsp;2025 Republic of Utopia. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
