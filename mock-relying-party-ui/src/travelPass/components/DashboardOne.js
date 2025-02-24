import { useNavigate } from "react-router-dom";

function DashboardWithoutDetails () {

    return (
        <>
            <div className="text-center mb-10 relative z-5">
                <span className="bg-[rgba(249,245,255,1)] text-[rgba(105,65,198,1)] px-3 py-1 rounded-full text-sm border border-[#E9D7FE]">Text</span>
                <h1 className="text-5xl font-semibold text-[rgba(66,48,125,1)] mt-6">Apply for Digi-Pass</h1>
                <p className="text-[rgba(105,65,198,1)] mt-6 max-w-xl mx-auto">
                    Lorem ipsum dolor sit amet consectetur. Pulvinar non nisi nunc ac nullam nam.
                </p>
            </div>

            <div className="flex gap-6 max-w-6xl relative z-10 mt-8">
                {/* Card 1 */}
                <div className="bg-white shadow-lg rounded-2xl p-8 text-center flex flex-col items-center w-[592px] h-[292px] border border-gray-200">
                    <div className="bg-purple-100 p-4 mb-4 w-16 h-16 flex items-center justify-center rounded-lg">
                        <span className="text-purple-600 text-3xl"></span>
                    </div>
                    <h2 className="text-lg font-semibold text-purple-800">
                        For Users with Digital National ID
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">Online process</p>
                    <div className="border-t border-gray-200 w-full mt-4 pt-4">
                        <button className="bg-[rgba(127,86,217,1)] text-white py-3 px-6 rounded-lg w-full hover:bg-purple-700">
                            Verify National ID
                        </button>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white shadow-lg rounded-2xl p-8 text-center flex flex-col items-center w-[592px] h-[292px] border border-gray-200">
                    <div className="bg-purple-100 p-4 mb-4 w-16 h-16 flex items-center justify-center rounded-lg">
                        <span className="text-purple-600 text-3xl">📄</span>
                    </div>
                    <h2 className="text-lg font-semibold text-purple-800">
                        For Users without Digital ID
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">Upload Documents</p>
                    <div className="border-t border-gray-200 w-full mt-4 pt-4">
                        <button className="bg-[rgba(127,86,217,1)] text-white py-3 px-6 rounded-lg w-full hover:bg-purple-700">
                            Get started
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DashboardWithoutDetails;