import React from "react";
import HomeImg from "../../assets/Home.png";
import AccountsImg from "../../assets/Accounts.png";
import CardsImg from "../../assets/Cards.png";
import DepositsImg from "../../assets/Deposits.png";
import InvestmentsImg from "../../assets/Investments.png";
import LoansImg from "../../assets/Loans.png";
import PaymentsImg from "../../assets/Payments.png";
import SettingsImg from "../../assets/Settings.png";
const SideCatgNavbar = () =>{

    return(
        <div className="sidecatgbar-wrapper">
            <ul className="sidecatgnavbar-list-wrapper">
                <li>
                    <img src={HomeImg}/>
                    Home
                </li>
                <li>
                    <img src={AccountsImg}/>
                    Accounts
                </li>
                <li>
                    <img src={DepositsImg}/>
                    Deposits
                </li>
                <li>
                    <img src={PaymentsImg}/>
                    Payments
                </li>
                <li>
                    <img src={LoansImg}/>
                    Loan
                </li>
                <li>
                    <img src={CardsImg}/>
                    My Cards
                </li>
                <li>
                    <img src={InvestmentsImg}/>
                    Investments
                </li>
                <li>
                    <img src={SettingsImg}/>
                    Settings
                </li>
            </ul>
        </div>
    )
}

export default SideCatgNavbar;