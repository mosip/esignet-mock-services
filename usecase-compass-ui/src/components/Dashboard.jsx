import { useState } from "react";
import Table from "./Table";
import { Link } from "react-router";

const Dashboard = () => {
    const [applicationsList, setApplicationsList] = useState([{ fullName: "Mathew Thompson", nID: "3428234783", can: "234783" }, { fullName: "Mathew Thompson", nID: "3428234783", can: "234783" }, { fullName: "Mathew Thompson", nID: "3428234783", can: "234783" }, { fullName: "Mathew Thompson", nID: "3428234783", can: "234783" }, { fullName: "Mathew Thompson", nID: "3428234783", can: "234783" }, { fullName: "Mathew Thompson", nID: "3428234783", can: "234783" }, { fullName: "Mathew Thompson", nID: "3428234783", can: "234783" }, { fullName: "Mathew Thompson", nID: "3428234783", can: "234783" }, { fullName: "Mathew Thompson", nID: "3428234783", can: "234783" }, { fullName: "Mathew Thompson", nID: "3428234783", can: "234783" }])
    // const [applicationsList, setApplicationsList] = useState([])
    const [selectedRows, setSelectedRows] = useState(0);
    
    return (
        <div className="min-h-[100%] max-h-auto w-full py-8 px-12">
            <div className="h-[120px] shadow px-6 w-full rounded-2xl bg-[#FFFDF6] flex items-center justify-between mb-6">
                <h1 className="text-[24px] text-[#181D27] font-bold">Welcome User</h1>
                <Link to="/newApplication"><button className="text-[#ffffff] bg-[#FF671F] h-[44px] w-[198px] rounded-md cursor-pointer">New Application</button></Link>
            </div>
            <div className="shadow w-full rounded-2xl min-h-[75%] bg-[#FFFDF6]">
                <div className="px-6 py-5 flex justify-between items-center">
                    <h1 className="text-[18px] text-[#031640] font-medium">Recent Applications</h1>
                    {applicationsList && <div className={`flex space-x-8 items-center text-[14px] ${selectedRows ? "text-[#FF671F]" : "text-[#B3B3B3]"}`}>
                        <div className="flex space-x-2 items-center">
                            <button className="cursor-pointer">Clear Selected</button>
                            <button className={`rounded h-[23px] w-[72px] ${selectedRows ? "bg-[#FF671F14]" : "border"}`}>0 Rows</button>
                        </div>
                        <button className="flex items-center w-[131px] cursor-pointer"><img src={selectedRows ? "src/assets/icons/del-orange.svg" : "src/assets/icons/del-gray.svg"} alt="delete" className="mr-2"/>Delete Selected</button>
                    </div>}
                </div>
                <div className="w-full">
                    <hr className="text-[#E3DCC9]" />
                    {applicationsList && <Table applicationsList={applicationsList}/>}
                </div>
            </div>
        </div>
    )
};


export default Dashboard;