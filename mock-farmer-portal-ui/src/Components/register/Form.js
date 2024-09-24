import { React, useState, useEffect } from "react";
import addIcon from "../../assets/img/add_7131103.png";
import delectIcon from "../../assets/img/delete_12236949.png";
import polygon from "../../assets/svg/Polygon 1.svg";

function Form({ showPopup, handleLandDetailsAction, selectedAcres }) {
  const [formData, setFormData] = useState({
    name: "Maria Powell",
    phoneNumber: "8763740607",
    email: "",
    dateOfBirth: "1992/04/29",
    gender: "Female",
    state: "",
    district: "",
    villageOrTown: "",
    pinCode: "",
    landDetails: [],
  });

  const statesInIndia = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];
  const districtsOfKarnataka = [
    "Bagalkot",
    "Bangalore Rural",
    "Bangalore Urban",
    "Belagavi",
    "Bellary",
    "Bidar",
    "Chamarajanagar",
    "Chikballapur",
    "Chikkamagaluru",
    "Chitradurga",
    "Dakshina Kannada",
    "Davanagere",
    "Dharwad",
    "Gadag",
    "Hassan",
    "Haveri",
    "Kalaburagi",
    "Kodagu",
    "Kolar",
    "Koppal",
    "Mandya",
    "Mysuru",
    "Raichur",
    "Ramanagara",
    "Shivamogga",
    "Tumakuru",
    "Udupi",
    "Uttara Kannada",
    "Vijayapura",
    "Yadgir",
  ];
  const bangaloreRural = [
    "Devanahalli",
    "Doddaballapur",
    "Hosakote",
    "Nelamangala",
    "Avathi",
    "Sulibele",
    "Nandagudi",
    "Anneshwara",
    "Vemgal",
    "Heggadihalli",
    "Nadugodi",
    "Thavarekere",
    "Aradeshanahalli",
    "Nellikuppa",
    "Gudemaranahalli",
    "Bychapura",
    "Marenahalli",
    "Yentaganahalli",
  ];
  const agriculturalLandOwnership = [
    "Freehold Ownership",
    "Leasehold Ownership",
    "Sharecropping",
    "Tenancy",
    "Collective Ownership",
    "Corporate Farming",
    "Government-Owned Land",
    "Tribal Land Ownership",
    "Joint Ownership",
    "Private Ownership",
    "Cooperative Farming",
    "Customary Land Ownership",
    "Community Land",
    "Inherited Ownership",
    "Contract Farming",
  ];

  // "sub": "341562263269871142444785383464153436",
  // "birthdate": "1992/04/29",
  // "address": {
  //     "locality": "ABC City"
  // },
  // "gender": "Female",
  // "name": "Maria Powell",
  // "phone_number": "8763740607",

  const [landDetails, setLandDetails] = useState({});
  const [landDetailsForm, showLandDetailsForm] = useState(false);

  useEffect(() => {
    setLandDetails({ area: selectedAcres });
  }, [selectedAcres]);

  const handleSubmit = () => {
    showPopup(true);
  };

  const handleLandDetailsForm = () => {
    showLandDetailsForm(true);
    handleLandDetailsAction(true);
  };

  const getFormData = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const getLandDetails = (event) => {
    const { name, value } = event.target;
    setLandDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const addMoreLandDetails = () => {
    if(Object.keys(landDetails).length > 0){
      setFormData((prevState) => ({
        ...prevState,
        landDetails: [...prevState.landDetails, landDetails],
      }));
    };
    setLandDetails({});
    selectedAcres = "";
  };

  const deleteLandData = (index) => {
    let newLandDetails = formData.landDetails;
    newLandDetails.splice(index, 1);
    setFormData((prevState) => ({
      ...prevState,
      landDetails: [...newLandDetails],
    }));
  };

  return (
    <div className="ml-4 h-[760px] bg-[#FCFCFC] shadow-[0_4px_10px_0_#00000014] w-[50%] rounded-xl p-6">
      {!landDetailsForm && (
        <h1 className="font-semibold text-xl text-[#242426]">
          Personal Information
        </h1>
      )}
      {landDetailsForm && (
        <h1 className="font-semibold text-3xl text-[#242426]">Land Details</h1>
      )}
      <p className="text-[#242426]">
        All fields marked with <span className="text-[red]">*</span> are
        mandatory.
      </p>
      <div autocomplete="off">
        {!landDetailsForm && (
          <div>
            <div className="my-4 w-full">
              <label className="text-[#242426]">
                <span className="mb-[10px]">
                  Full name<span className="text-[red]">*</span>
                </span>
              </label>
              <input
                type="text"
                className="mt-1 block border-2 border-[#A2A2A2] w-full rounded-lg h-14 p-2 outline-none"
                placeholder="Write full name"
                name="name"
                onChange={getFormData}
                value={formData.name ? formData.name : ""}
              />
            </div>
            <div className="flex space-x-3 my-4 w-full">
              <div className="w-[48%]">
                <label className="text-[#242426]">
                  Mobile number<span className="text-[red]">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block border-2 border-[#A2A2A2] w-full rounded-lg h-14 p-2 outline-none"
                  placeholder="Write Mobile number"
                  name="phoneNumber"
                  onChange={getFormData}
                  value={formData.phoneNumber ? formData.phoneNumber : ""}
                />
              </div>
              <div className="w-[48%]">
                <label className="text-[#242426]">
                  Email{" "}
                  <span className="text-[#A2A2A2]">
                    {"("}optional{")"}
                  </span>
                </label>
                <input
                  type="text"
                  className="mt-1 block border-2 border-[#A2A2A2] w-full rounded-lg h-14 p-2 outline-none"
                  placeholder="Write Email"
                  name="email"
                  onChange={getFormData}
                  value={formData.email ? formData.email : ""}
                />
              </div>
            </div>

            <div className="flex space-x-3 my-4 w-full">
              <div className="w-[48%]">
                <label className="text-[#242426]">
                  Date of Birth<span className="text-[red]">*</span>
                </label>
                <input
                  className="mt-1 block border-2 border-[#A2A2A2] w-full rounded-lg h-14 p-2 outline-none"
                  placeholder="Select Date of birth"
                  name="dateOfBirth"
                  onChange={getFormData}
                  value={formData.dateOfBirth ? formData.dateOfBirth : ""}
                />
              </div>
              <div className="w-[48%]">
                <label className="text-[#242426]">
                  Gender<span className="text-[red]">*</span>
                </label>
                <select
                  onChange={getFormData}
                  name="gender"
                  className="mt-1 block border-2 border-[#A2A2A2] w-full rounded-lg h-14 p-2 outline-none"
                  value={formData.gender ? formData.gender : ""}
                >
                  <option selected value="" disabled>
                    Select gender
                  </option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>others</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 my-4 w-full">
              <div className="w-[48%]">
                <label className="text-[#242426]">
                  State<span className="text-[red]">*</span>
                </label>
                <select
                  onChange={getFormData}
                  name="state"
                  className="mt-1 block border-2 border-[#A2A2A2] w-full rounded-lg h-14 p-2 outline-none"
                  value={formData.state ? formData.state : ""}
                >
                  <option value="" disabled>
                    Select State
                  </option>
                  {statesInIndia.map((item, i) => (
                    <option key={i}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="w-[48%]">
                <label className="text-[#242426]">
                  District<span className="text-[red]">*</span>
                </label>
                <select
                  onChange={getFormData}
                  name="district"
                  className="mt-1 block border-2 border-[#A2A2A2] w-full rounded-lg h-14 p-2 outline-none"
                >
                  <option selected value="" disabled>
                    Select District
                  </option>
                  {districtsOfKarnataka.map((item, i) => (
                    <option key={i}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-3 my-4 w-full">
              <div className="w-[48%]">
                <label className="text-[#242426]">
                  Village/Town<span className="text-[red]">*</span>
                </label>
                <select
                  onChange={getFormData}
                  name="villageOrTown"
                  className="mt-1 block border-2 border-[#A2A2A2] w-full rounded-lg h-14 p-2 outline-none"
                >
                  <option selected value="" disabled>
                    Select Village/Town
                  </option>
                  {bangaloreRural.map((item, i) => (
                    <option key={i}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="w-[48%]">
                <label className="text-[#242426]">
                  Pin code<span className="text-[red]">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block border-2 border-[#A2A2A2] w-full rounded-lg h-14 p-2 outline-none"
                  placeholder="Select pin code"
                  name="pinCode"
                  onChange={getFormData}
                />
              </div>
            </div>

            <hr className="bg-[#707070] h-[1.5px]" />

            <div className="p-4">
              <div className="flex items-center font-[500] cursor-pointer">
                <input className="h-4 w-4" type="checkbox" />
                &nbsp; &nbsp;
                <span className="text-[#000000] text-[16px]">I agree with</span>
                &nbsp;
                <span className="text-[#007AFF] text-[16px]">Terms of use</span>
              </div>
              <div className="mt-6 flex justify-between">
                <button className="border border-[#ABABAB] rounded w-[158px] h-[58px] bg-transparent text-[#A2A2A2]">
                  Clear form
                </button>
                <div className="flex space-x-2">
                  <button className="border border-[#ABABAB] rounded w-[158px] h-[58px] bg-transparent text-[#A2A2A2]">
                    Cancel
                  </button>
                  <button
                    onClick={handleLandDetailsForm}
                    className="border border-[#ABABAB] rounded w-[158px] h-[58px] bg-[#1EB53A] text-[#ffffff]"
                  >
                    Add Land Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {landDetailsForm && (
          <div>
            <div className="flex space-x-3 my-4 w-full">
              <div className="w-[48%]">
                <label className="text-[#242426]">
                  Land Area
                  <span>
                    {"("}in acres{")"}
                  </span>
                  <span className="text-[red]">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block border-2 border-[#A2A2A2] w-full rounded-lg h-14 p-2 outline-none"
                  placeholder="Write Land Area"
                  name="area"
                  onInput={getLandDetails}
                  value={landDetails.area ? landDetails.area : ""}
                />
              </div>
              <div className="w-[48%]">
                <label className="text-[#242426]">
                  Type of Land Ownership<span className="text-[red]">*</span>
                </label>
                <select
                  onChange={getLandDetails}
                  name="landOwnership"
                  className="mt-1 block border-2 border-[#A2A2A2] w-full rounded-lg h-14 p-2 outline-none"
                >
                  <option selected value="" disabled>
                    Select Type of Land Ownership
                  </option>
                  {agriculturalLandOwnership.map((item, i) => (
                    <option key={i}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-3 my-4 w-full">
              <div className="w-[48%]">
                <label className="text-[#242426]">
                  Primary Crop Type<span className="text-[red]">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block border-2 border-[#A2A2A2] w-full rounded-lg h-14 p-2 outline-none"
                  placeholder="Select crop name"
                  name="primaryCropType"
                  onInput={getLandDetails}
                  value={
                    landDetails.primaryCropType
                      ? landDetails.primaryCropType
                      : ""
                  }
                />
              </div>
              <div className="w-[48%]">
                <label className="text-[#242426]">
                  Secondary Crop Type
                  <span className="text-[#A2A2A2]">
                    {"("}optional{")"}
                  </span>
                </label>
                <input
                  type="text"
                  className="mt-1 block border-2 border-[#A2A2A2] w-full rounded-lg h-14 p-2 outline-none"
                  placeholder="Select crop name"
                  name="secondaryCropType"
                  onInput={getLandDetails}
                  value={
                    landDetails.secondaryCropType
                      ? landDetails.secondaryCropType
                      : ""
                  }
                />
              </div>
            </div>
            <button
              onClick={addMoreLandDetails}
              className="flex space-x-2 items-center"
            >
              <img className="w-4 h-4" src={addIcon} />
              <span className="text-[#52AE32] font-semibold">Add More</span>
            </button>
            {formData.landDetails.length > 0 && (
              <div className="mt-3">
                <h3 className="font-semibold text-[#242426]">Added Land Details</h3>
                {formData.landDetails.map((item, i) => {
                  return (
                    <>
                      <div
                        key={i}
                        className="flex justify-between items-center my-2"
                      >
                        <p>Land {i + 1}</p>
                        <div className="flex items-center space-x-4">
                          <button onClick={() => deleteLandData(i)}>
                            <img
                              className="h-4 w-4 cursor-pointer outline-none"
                              alt=""
                              src={delectIcon}
                            />
                          </button>
                          <img
                            className="cursor-pointer"
                            alt=""
                            src={polygon}
                          />
                        </div>
                      </div>
                      <hr className="border-[#D8D8D8] last-of-type:hidden" />
                    </>
                  );
                })}
              </div>
            )}
            <hr className="bg-[#707070] h-[1.5px]" />
            <div className="mt-6 flex justify-between">
              <button className="border border-[#ABABAB] rounded w-[158px] h-[58px] bg-transparent text-[#A2A2A2]">
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="border border-[#ABABAB] rounded w-[158px] h-[58px] bg-[#1EB53A] text-[#ffffff]"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Form;
