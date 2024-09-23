import { React, useEffect, useState } from "react";
// import OlMap from "../Components/register/Map";
import Form from "../Components/register/Form";
import TopNavbar from "../Components/landing/Nav/TopNavbar";
import Modal from "../Components/modal/Modal";
import successIcon from "./../assets/svg/success_message_icon.svg";
import LandDetails from "../Components/register/LandDetails";
import agricultureImg from "../assets/img/agriculture.jpg";

function RegisterForm(props) {
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [openPopup, showPopup] = useState(false);
  const [landDetailsForm, showlandDetailsForm] = useState(false);
  const [seletedMapLand, getSeletedMapLand] = useState("");

  const getSelectedAreaAcres = (val) => {
    getSeletedMapLand(Math.round(val * 10000).toFixed(2));
    console.log(seletedMapLand);
  };

  const getPopupAction = (val) => {
    showPopup(val);
  };

  const handleLandDetailsAction = (val) => {
    showlandDetailsForm(val);
  };

  const currentCoordinates = [position.longitude, position.latitude];

  return (
    <>
      <TopNavbar hideTabs={true} />
      <div className="mt-[90px]">
        <div className="p-6 shadow-[0px_0px_60px_30px_#00000008] m-[0px_40px_15px_40px] rounded-[20px]">
          <h1 className="text-center text-[#284F1C] font-semibold text-[30px]">
            Farmer Registration Form
          </h1>
          <div className="flex mt-2">
            <>
              {!landDetailsForm && (
                // <OlMap
                //   mapProvider="GMAPS" // or 'GMAPS' 'OSM'
                //   currentCoordinates={currentCoordinates}
                // />
                <div className="w-[60%]">
                  <img className="rounded-xl h-full w-full" alt="" src={agricultureImg} />
                </div>
              )}
              {landDetailsForm && (
                <div className="w-[60%]">
                  <LandDetails getSelectedAreaAcres={getSelectedAreaAcres} />
                </div>
              )}
            </>
            <Form
              showPopup={getPopupAction}
              handleLandDetailsAction={handleLandDetailsAction}
              selectedAcres={seletedMapLand}
            />
          </div>
        </div>
      </div>
      <Modal open={openPopup}>
        <div className="text-center w-[668px] h-[450px] flex flex-col items-center justify-center space-y-5 px-[120px]">
          <img alt="" src={successIcon} />
          <h2>Thank you for registering!</h2>
          <p>
            Your application has been successfully submitted. You will receive
            further communication regarding your Farmer ID shortly.
          </p>
          <button
            onClick={() => showPopup(false)}
            type="submit"
            className="border border-[#ABABAB] rounded w-[158px] h-[58px] bg-[#1EB53A] text-[#ffffff]"
          >
            Home
          </button>
        </div>
      </Modal>
    </>
  );
}

export default RegisterForm;
