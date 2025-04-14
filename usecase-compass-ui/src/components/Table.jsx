const Table = ({ applicationsList }) => {


    return (
        <div className="w-full min-h-full">
            <table className="table w-full min-h-full border-collapse">
                {/* head */}
                <thead>
                    <tr className="text-[#6F6E6E] border-b border-gray-300">
                        {applicationsList.length > 0 && (
                            <th className="text-center w-[1%] py-5 px-6">
                                <label>
                                    <input type="checkbox" className="checkbox cursor-pointer h-[18px] w-[18px] align-middle accent-[#FF671F]" />
                                </label>
                            </th>
                        )}
                        <th className="text-left w-[15%] font-medium py-5 px-6">Full Name</th>
                        <th className="text-center w-[25%] font-medium py-5">National ID</th>
                        <th className="text-center w-[25%] font-medium py-5">CAN</th>
                        <th className="text-center w-[25%] font-medium py-5">Action</th>
                    </tr>
                </thead>
                <tbody className="w-full">
                    {applicationsList.length > 0 && applicationsList.map((eachItem, index) => (
                        <tr key={index} className="border-b border-gray-300">
                            <th className="px-6 py-5">
                                <label>
                                    <input type="checkbox" className="checkbox h-[18px] w-[18px] align-middle" />
                                </label>
                            </th>
                            <td className="py-5 text-left">{eachItem.fullName}</td>
                            <td className="py-5 text-center">{eachItem.nID}</td>
                            <td className="py-5 text-center">{eachItem.can}</td>
                            <th className="py-5">
                                <button className="btn btn-ghost btn-xs"><img src="src/assets/icons/del-orange.svg" alt="delete" /></button>
                            </th>
                        </tr>
                    ))}
                    {applicationsList.length <= 0 && (
                        <tr>
                            <td colSpan="100%" className="w-full h-full">
                                <div className="py-13 w-full h-full flex justify-center">
                                    <div className="h-[132px] w-[273px] border border-[#D0D0D0] rounded-2xl">
                                        <div className="flex gap-2">
                                            <span className="h-[8px] w-[32px] bg-[#D0D0D0] rounded-[2px]"></span>
                                            <span className="h-[8px] w-[32px] bg-[#D0D0D0] rounded-[2px]"></span>
                                            <span className="h-[8px] w-[32px] bg-[#D0D0D0] rounded-[2px]"></span>
                                            <span className="h-[8px] w-[32px] bg-[#D0D0D0] rounded-[2px]"></span>
                                            <span className="h-[8px] w-[32px] bg-[#D0D0D0] rounded-[2px]"></span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

    )
};

export default Table;