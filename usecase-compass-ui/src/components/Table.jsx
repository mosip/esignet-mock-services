import { useState } from "react";
import Shimmer from "../utils/Shimmer";
import { useEffect } from "react";
import AlertDialog from "../utils/AlertDialog";
import ToolTip from "../utils/Tooltip";


const Table = ({ applicationsList, selectApplication, selectedItems, deleteApplication }) => {
    const [selectedAllDel, setClickedAllDel] = useState(false);
    const [showDeleteConfMsg, setShowDeleteConfMsg] = useState(false);
    const [selectedDelId, setSelectedDelId] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);

    const deleteConfMsg = {title:"Delete Confirmation!", message:"Are you sure you want to delete this record?", messageTwo:"This action can’t be undone."};

    useEffect(() =>{
        if(applicationsList.length === selectedItems.length && applicationsList.length > 0){
            setClickedAllDel(true);
        }else{
            setClickedAllDel(false);
        }

        return () =>{
            setSelectedDelId("");
        }
    }, [selectedItems]);

    const selectedAllDelBtn = () =>{
        selectApplication("selectAll");
    };

    const deleteSingleItem = async () =>{
        deleteApplication(selectedDelId)
        setShowDeleteConfMsg(false);
    };



    return (
        <div className="w-full min-h-full">
            <table className="table w-full min-h-full border-collapse text-[16px]">
                {/* head */}
                <thead>
                    <tr className="text-[#6F6E6E] border-b border-[#E3DCC9]">
                        <th className="text-left w-[17%] font-medium py-5 pl-6 break-all"><p className="flex items-center">{applicationsList.length > 0 && <img onClick={selectedAllDelBtn} src={`/assets/icons/${selectedAllDel ? 'checkbox-active' : 'checkbox'}.svg`} alt="checkbox" className="h-[18px] w-[18px] align-middle cursor-pointer" />}<span className="pl-4 mr-2">National ID</span><img onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} className="cursor-pointer" alt="info" src="/assets/icons/info.svg" />
                            {showTooltip && <ToolTip text={"Select checkboxes to delete preferred applications."} />}
                        </p>
                        </th>
                        <th className="text-left w-[17%] font-medium py-5 break-all">First Name</th>
                        <th className="text-left w-[17%] font-medium py-5 break-all">Last Name</th>
                        <th className="text-left w-[17%] font-medium py-5 break-all">Issued Date</th>
                        <th className="text-left w-[15%] font-medium py-5 break-all">CAN</th>
                        <th className="text-right w-[10%] font-medium py-5 pr-17 break-all max-[1300px]:pr-7 max-[1300px]:w-[12%]">Action</th>
                    </tr>
                </thead>
                <tbody className="w-full text-[#031640]">
                    {applicationsList.length > 0 && applicationsList.map((eachItem, index) => (
                        <tr key={index} className="border-b border-[#E3DCC9]">
                            <td className="py-5 text-left w-[17%] pl-6 break-all"><p className="flex items-center"><img onClick={() => selectApplication(eachItem.userInfoId)} src={`/assets/icons/${selectedItems.includes(eachItem.userInfoId) ? 'checkbox-active' : 'checkbox'}.svg`} alt="checkbox" className="h-[18px] w-[18px] align-middle cursor-pointer"/><span className="pl-4">{eachItem.nationalUid}</span></p></td>
                            <td className="py-5 text-left w-[17%] break-all pr-1">{eachItem.firstNamePrimary}</td>
                            <td className="py-5 text-left w-[17%] break-all pr-1">{eachItem.lastNameSecondary}</td>
                            <td className="py-5 text-left w-[17%] break-all pr-1">{new Date(eachItem.issuanceDate).toLocaleDateString('en-GB').replaceAll('/', '-')}</td>
                            <td className="py-5 text-left w-[15%] break-all pr-1">{eachItem.cardAccessNumber}</td>
                            <th className="py-5 text-right w-[10%] pr-18 max-[1300px]:pr-8 max-[1300px]:w-[12%]">
                                <button onClick={() => {setShowDeleteConfMsg(true); setSelectedDelId(eachItem.userInfoId) }} className="btn btn-ghost btn-xs cursor-pointer"><img src="/assets/icons/del-orange.svg" alt="delete" /></button>
                            </th>
                        </tr>
                    ))}
                    {applicationsList.length <= 0 && (
                        <tr>
                            <td colSpan="100%" className="w-full h-full">
                                <Shimmer/>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {showDeleteConfMsg && <AlertDialog data={deleteConfMsg} confirmMsg={deleteSingleItem} closePopup={() => setShowDeleteConfMsg(false)}/>}
        </div>

    )
};

export default Table;
