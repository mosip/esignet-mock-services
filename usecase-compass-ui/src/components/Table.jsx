import { useState } from "react";
import Shimmer from "../utils/Shimmer";
import { useEffect } from "react";
import AlertDialog from "../utils/AlertDialog";


const Table = ({ applicationsList, selectApplication, selectedItems, deleteApplication }) => {
    const [selectedAllDel, setClickedAllDel] = useState(false);
    const [showDeleteConfMsg, setShowDeleteConfMsg] = useState(false);
    const [selectedDelId, setSelectedDelId] = useState("");

    const deleteConfMsg = {title:"Delete Confirmation!", message:"Are you sure you want to delete this record?", messageTwo:"This action can’t be undone."};

    useEffect(() =>{
        console.log(applicationsList.length)
        console.log(selectedItems)
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
                        <th className="text-left w-[19%] font-medium py-5 pl-6 break-all"><p className="flex items-center">{applicationsList.length > 0 && <img onClick={selectedAllDelBtn} src={`/assets/icons/${selectedAllDel ? 'checkbox-active' : 'checkbox'}.svg`} alt="checkbox" className="h-[18px] w-[18px] align-middle cursor-pointer"/>}<span className="pl-4">National ID</span></p></th>
                        <th className="text-left w-[19%] font-medium py-5 break-all">First Name</th>
                        <th className="text-left w-[13%] font-medium py-5 break-all">Last Name</th>
                        <th className="text-left w-[16%] font-medium py-5 break-all">Issued Date</th>
                        <th className="text-left w-[13%] font-medium py-5 break-all">CAN</th>
                        <th className="text-left w-[16%] font-medium py-5 break-all">Action</th>
                    </tr>
                </thead>
                <tbody className="w-full text-[#031640]">
                    {applicationsList.length > 0 && applicationsList.map((eachItem, index) => (
                        <tr key={index} className="border-b border-[#E3DCC9]">
                            <td className="py-5 text-left w-[19%] pl-6 break-all"><p className="flex items-center"><img onClick={() => selectApplication(eachItem.userInfoId)} src={`/assets/icons/${selectedItems.includes(eachItem.userInfoId) ? 'checkbox-active' : 'checkbox'}.svg`} alt="checkbox" className="h-[18px] w-[18px] align-middle cursor-pointer"/><span className="pl-4">{eachItem.nationalUid}</span></p></td>
                            <td className="py-5 text-left w-[19%] break-all pr-1">{eachItem.firstNamePrimary}</td>
                            <td className="py-5 text-left w-[13%] break-all pr-1">{eachItem.lastNameSecondary}</td>
                            <td className="py-5 text-left w-[16%] break-all pr-1">{new Date(eachItem.issuanceDate).toLocaleDateString('en-GB').replaceAll('/', '-')}</td>
                            <td className="py-5 text-left w-[13%] break-all pr-1">{eachItem.cardAccessNumber}</td>
                            <th className="py-5 text-left w-[16%]">
                                <button onClick={() => {setShowDeleteConfMsg(true);setSelectedDelId(eachItem.userInfoId) }} className="btn btn-ghost btn-xs cursor-pointer"><img src="/assets/icons/del-orange.svg" alt="delete" /></button>
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
