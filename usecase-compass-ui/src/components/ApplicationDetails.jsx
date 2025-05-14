import { Link } from "react-router";
import { useNavigate } from 'react-router-dom';
import {changeData} from '../utils/appUtils'

const ApplicationDetails = ({ setShowApplicationDetails, applicationDetails }) => {
    const navigate = useNavigate();

    const editData = () => {
        navigate('/editApplication');
        localStorage.setItem("editFormData", JSON.stringify(applicationDetails));
    };

    return (
        <div className="w-full">
            <div className="flex space-x-3 mb-2">
                <Link to="/home"><img src="/assets/icons/back.svg" alt="back" className="cursor-pointer mt-1" /></Link>
                <div><h1 className="text-[#162E63] text-[21px]">Application Details</h1> <span onClick={setShowApplicationDetails} className="text-[#FF671F] text-[14px] cursor-pointer">Home</span></div>
            </div>
            <div className="py-6 bg-[#fdfaf2] rounded-xl shadow-md">
                <div className="flex justify-between items-center pb-3 px-6">
                    <h3 className="text-[#14397E] text-[18px] font-medium">
                        National ID: <span>{applicationDetails.nationalUid}</span>
                    </h3>
                    <button onClick={editData} className="cursor-pointer border-2 border-[#FF671F] font-bold text-[#FF671F] text-md rounded-md flex items-center justify-center gap-3 w-[119px] h-[44px]">
                        <img src="assets/icons/edit.svg" alt="edit" /> Edit
                    </button>
                </div>
                <hr className="text-[#D7D8E1]" />
                {/* Profile Section */}
                <div className="flex items-start gap-12 p-6">
                    <img
                        src={applicationDetails.faceImageColor} // Replace with actual photo path
                        alt="Profile"
                        className="w-[101px] h-[129px] rounded object-cover border-1 border-[#707070]"
                    />
                    <div className="space-y-1">
                        <div>
                            <span className="text-[#FF671F] text-[17px] block">First Name</span>
                            <span className="text-[#14397E] text-[19px] font-medium">
                                {applicationDetails.firstNamePrimary}
                            </span>
                        </div>
                        <div>
                            <span className="text-[#FF671F] text-[17px] block">Last Name</span>
                            <span className="text-[#14397E] text-[19px] font-medium">
                                {applicationDetails.lastNameSecondary}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div>
                            <span className="text-[#FF671F] text-[17px] block">First Name (Latin)</span>
                            <span className="text-[#14397E] text-[19px] font-medium">
                                {applicationDetails.firstNamePrimaryLatin}
                            </span>
                        </div>
                        <div>
                            <span className="text-[#FF671F] text-[17px] block">Last Name (Latin)</span>
                            <span className="text-[#14397E] text-[19px] font-medium">
                                {applicationDetails.lastNameSecondaryLatin}
                            </span>
                        </div>
                    </div>
                </div>
                <hr className="text-[#D7D8E1] mx-6" />
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-4 py-6 px-10 w-[60%]">
                    <div>
                        <span className="text-[#FF671F] text-[17px] block">Date of Birth</span>
                        <span className="text-[#14397E] text-[19px] font-medium">{changeData(applicationDetails.dateOfBirth)}</span>
                    </div>
                    <div>
                        <span className="text-[#FF671F] text-[17px] block">Gender</span>
                        <span className="text-[#14397E] text-[19px] font-medium">{applicationDetails.gender}</span>
                    </div>
                    <div>
                        <span className="text-[#FF671F] text-[17px] block">National ID</span>
                        <span className="text-[#14397E] text-[19px] font-medium">{applicationDetails.nationalUid}</span>
                    </div>
                    <div>
                        <span className="text-[#FF671F] text-[17px] block">Nationality</span>
                        <span className="text-[#14397E] text-[19px] font-medium">{applicationDetails.nationality}</span>
                    </div>
                    <div>
                        <span className="text-[#FF671F] text-[17px] block">Birth Country</span>
                        <span className="text-[#14397E] text-[19px] font-medium">{applicationDetails.birthCountry}</span>
                    </div>
                    <div>
                        <span className="text-[#FF671F] text-[17px] block">Email</span>
                        <span className="text-[#14397E] text-[19px] font-medium">{applicationDetails.email}</span>
                    </div>
                    <div>
                        <span className="text-[#FF671F] text-[17px] block">CAN (Card Access Number)</span>
                        <span className="text-[#14397E] text-[19px] font-medium">{applicationDetails.cardAccessNumber}</span>
                    </div>
                </div>
                <hr className="text-[#D7D8E1]" />

                {/* Footer Button */}
                <div className="flex justify-end px-6 pt-6">
                    <button onClick={setShowApplicationDetails} className="cursor-pointer border-2 border-[#FF671F] text-[#FF671F] text-md px-6 py-2 rounded-md hover:bg-[#fff5eb] w-[325px] h-[60px] font-bold">
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetails;