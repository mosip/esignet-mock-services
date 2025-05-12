import { useState } from "react";
import {Link, useLocation} from "react-router-dom";

const Drawer = () => {
    const [fullDrawer, setFullDrawer] = useState(false);
    const location = useLocation();
    
    return (
        <div className={`${fullDrawer ? "w-[266px]" : "w-[117px]"} drawer py-7 px-3 transition-all duration-300`} style={{ boxShadow: '2px 0 2px rgba(0, 0, 0, 0.1)' }}>
            <div className="drawer-content text-right">
                <img onClick={() => setFullDrawer( (prevState) =>!prevState)} src={fullDrawer ? "/assets/icons/close-sidenav.svg" : "/assets/icons/Group.svg"} className="inline-block absolute mt-7 cursor-pointer -ml-[2px]"/>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full py-4 px-2 text-[14px]">
                    <li><Link to="/home" className={`flex items-center space-x-3 ${location.pathname === '/home' ? "text-[#622F17]" : "text-[#9C9B98]"}`}><img src={location.pathname === '/home' ? "/assets/icons/home.svg" : "/assets/icons/home-gray.svg"} alt="home" className="h-[48px] w-[48px]"/>{fullDrawer && <span className="opacity-0 animate-[fadeIn_0.1s_ease-in-out_.2s_forwards]">Home</span>}</Link></li>
                    <li><Link to="/newApplication" className={`flex items-center space-x-3 mt-5 ${location.pathname === '/newApplication' ? "text-[#622F17]" : "text-[#9C9B98]"}`}><img src={location.pathname === '/newApplication' ? "/assets/icons/newApplication.svg" : "/assets/icons/newApplication-gray.svg" } alt="newApp" className="h-[48px] w-[48px]"/>{fullDrawer && <span className="opacity-0 animate-[fadeIn_0.1s_ease-in-out_.2s_forwards]">New Application</span>}</Link></li>
                </ul>
            </div>
        </div>
    )
};


export default Drawer;