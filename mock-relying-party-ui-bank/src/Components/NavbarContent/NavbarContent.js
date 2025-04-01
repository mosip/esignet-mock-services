import React,{useState} from "react";
import search_logo from "../../assets/Search.png";
import mic_logo from "../../assets/Mic.png";
import arrowdrop_img from "../../assets/arrowdrop.png";
import RM_logo from "../../assets/RM_logo.png";
import Transaction_logo from "../../assets/Transaction_logo.png";
import arrow_pagination from "../../assets/arrow_pagination.png";
import user_logo from "../../assets/UserIcon.png";
import { useNavigate } from "react-router-dom";

const NavbarContent = ({userdata,address}) =>{

    const getCurrentDate=()=> {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    const getCurrentTime=()=>{
        const date = new Date();
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'IST',
        };
        let time = date.toLocaleTimeString('en-GB', options);
        time = time.toUpperCase();
        return time;
    }

    const formatDate=(dateString)=>{
        if (!dateString) return ''; 
        const [year, month, day] = dateString?.split("/"); 
        return `${day}/${month}/${year}`; 
    }
    const navigate = useNavigate();
    const formattedDate = userdata?.birthdate ? formatDate(userdata.birthdate) : '';
    const [currentDate] = useState(getCurrentDate());
    const [currentTime] = useState(getCurrentTime());

    const [isOpen, setIsOpen] = useState(false);
    const data = [
        { description: "Netflix Subscription", transactionId: "#125487", date: "28 Mar, 12.30 AM", amount: "-₹649" },
        { description: "Salary", transactionId: "#125486", date: "26 Mar, 02.30 AM", amount: "₹1,25,000" },
        { description: "Mobile Recharge", transactionId: "#125489", date: "25 Mar, 12.30 PM", amount: "-₹449" },
      ];
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
    const onLogOut =() =>{
        navigate("/");
    }
    return(
        <div className="navBarContent-wrapper">
            <div className="topcontent-wrapper">
                <div className="input-search-wrapper">
                    <img className="search-logo" src={search_logo}></img>
                    <input id="global-search" type="text" placeholder="Search here..."/>
                    <img className="mic-logo" src={mic_logo}></img>
                </div>
                <div className="user-details-wrapper">
                    <div className="user-details">
                        <img className="user-logo" src={userdata?.picture?.length > 0 ? userdata.picture : user_logo}></img>
                        <label>{userdata?.name?.length > 0 ? userdata.name:"Username"}</label>
                        <img src={arrowdrop_img} onClick={toggleDropdown}></img>
                        {isOpen && (
                            <div className="dropdown-content">
                            <ul>
                                <li>E-mail: {userdata.email}</li>
                                <li>DOB: {formattedDate}</li>
                                <li>Gender: {userdata.gender}</li>
                                <li>Mobile: {userdata.phone_number}</li>
                                {address?.length > 0 ? <li><span>Address:</span><span>{address}</span></li> :" "}
                                <li onClick={onLogOut}>Logout</li>
                            </ul>
                            </div>
                        )}
                    </div>
                    <div className="user-activity">
                        <p>Last logged in: {currentTime} , {currentDate}</p>
                    </div>
                </div>
            </div>
            <p className="user-welcome">Hi, {userdata.name}, Welcome!</p>
            <p className="content-title">My Accounts</p>
            <div className="bank-details">
                <div className="account-cards">
                    <div className="card-wrapper active">
                        <div className="account-details">
                            <p className="card-title">Account Balance (Account 1)</p>
                            <p className="account-number">353740927428374928</p>
                            <p className="account-balance">Balance</p>
                            <p className="account-value">₹1,21,756</p>
                        </div>
                        <p className="statement-link">View Statement &gt;</p>
                    </div>
                    <div className="card-wrapper non-active">
                        <p className="card-title">Account Balance (Account 2)</p>
                        <p className="account-number">23484723479233472782</p>
                        <p className="account-balance">Balance</p>
                        <p className="account-value">₹25,390</p>
                        <p className="statement-link">View Statement &gt;</p>
                    </div>
                </div>
                <div className="bank-rm">
                    <p className="title">Relationship Manager</p>
                    <img src={RM_logo}></img>
                    <button>Know Your RM</button>
                </div>
            </div>
            <div className="transactions-wrapper">
                <p className="title">Recent Transactions</p>
                <ul className="list-wrapper">
                    <li className="list-item">All Transactions</li>
                    <li className="list-item">Income</li>
                    <li className="list-item">Expense</li>
                </ul>
                <table >
                    <thead>
                        <tr>
                        <th >Description</th>
                        <th >Transaction ID</th>
                        <th >Date</th>
                        <th >Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                        <tr key={index}>
                            <td style={{ padding: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <img src={Transaction_logo} alt="Item" />
                            {item.description}
                            </td>
                            <td >{item.transactionId}</td>
                            <td >{item.date}</td>
                            <td className="trans-amount">{item.amount}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination-img-wrap">
                <ul>
                    <li><img src={arrow_pagination}></img></li>
                    <li>Previous</li>
                    <li className="active">1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>Next</li>
                    <li><img src={arrow_pagination}></img></li>
                </ul>
            </div>
            </div>
    )
}

export default NavbarContent;