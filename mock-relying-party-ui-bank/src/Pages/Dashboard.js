import React,{useEffect,useState}  from "react";
import Header from "../Components/Header/Header";
import { useSearchParams } from "react-router-dom";
import clientDetails from "../constants/clientDetails";
import success_icon from "../assets/success_icon.png";
import SideCatgNavbar from "../Components/SideCatgNavbar/SideCatgNavbar";
import NavbarContent from "../Components/NavbarContent/NavbarContent";
import relyingPartyService from "../services/relyingPartyService.js";


const Dashboard = () =>{
    const [modalVisible, setModalVisible] = useState(false);
    const [userdata, setUserdata] = useState({});
    const [address,setAddress] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const { post_fetchUserInfo } = {
        ...relyingPartyService,
    };
    const onProceed = () => {
        setModalVisible(false);
    };
     const onClose = () =>{
        setModalVisible(false);
    }
    useEffect(()=>{
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) {
              return parts.pop().split(';').shift(); 
            }
            return null;
          };
        const xsrfToken = getCookie('XSRF-TOKEN');
        if(xsrfToken){
            let authCode = searchParams.get("code");
              if(authCode){
                getUserDetails(authCode);
              }
        }
    },[])
    const getUserDetails = async (authCode) => {
    
        let client_id = clientDetails.clientId;
        let redirect_uri = clientDetails.redirect_uri_userprofile;
        let grant_type = clientDetails.grant_type;

        var userInfo = await post_fetchUserInfo(
            authCode,
            client_id,
            redirect_uri,
            grant_type
        );
        let address = getAddress(userInfo?.address);
        // console.log("userInfo:",userInfo);
        // console.log("Address",address); 
        setUserdata(userInfo);
        setAddress(address);
        if (Object.keys(userInfo).length > 0) {
            setModalVisible(true);
        }
      };

    const getAddress = (userAddress) => {
        let address = "";
    
        if (userAddress?.formatted) {
          address += userAddress?.formatted + ", ";
        }
    
        if (userAddress?.street_address) {
          address += userAddress?.street_address + ", ";
        }
    
        if (userAddress?.addressLine1) {
          address += userAddress?.addressLine1 + ", ";
        }
    
        if (userAddress?.addressLine2) {
          address += userAddress?.addressLine2 + ", ";
        }
    
        if (userAddress?.addressLine3) {
          address += userAddress?.addressLine3 + ", ";
        }
    
        if (userAddress?.locality) {
          address += userAddress?.locality + ", ";
        }
    
        if (userAddress?.city) {
          address += userAddress?.city + ", ";
        }
    
        if (userAddress?.province) {
          address += userAddress?.province + ", ";
        }
    
        if (userAddress?.region) {
          address += userAddress?.region + ", ";
        }
    
        if (userAddress?.postalCode) {
          address += "(" + userAddress?.postalCode + "), ";
        }
    
        if (userAddress?.country) {
          address += userAddress?.country + ", ";
        }
        return address.substring(0, address.length - 2);
      };
    return(
        <div className="dashboard-wrapper">
            <Header></Header>
            <div className="main-content-wrapper">
                <SideCatgNavbar></SideCatgNavbar>
                <NavbarContent userdata={userdata} address={address}></NavbarContent>
                {modalVisible && userdata?.name && (
                    <Modal onProceed={onProceed} onClose={onClose} userdata={userdata} />
                )}
            </div>
        </div>
    )
}
const Modal = ({ onProceed, onClose, userdata }) => {
    const handleClickOutside = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            onClose();
        }
    };
    
    return (
        <div className="modal-overlay" onClick={handleClickOutside}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={success_icon}></img>
                <h2>Welcome, {userdata?.name}!</h2>
                <p>You're all set! Click 'Proceed' to dive into your seamless banking experience.</p>
                <button onClick={onProceed}>Proceed</button>
            </div>
        </div>
    );
};
export default Dashboard;