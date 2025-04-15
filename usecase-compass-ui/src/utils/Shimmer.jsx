const Shimmer = () => {
    return (
        <div className="py-13 w-full h-full flex justify-center">
            <div className="h-[132px] w-[273px] border border-[#D0D0D0] rounded-2xl p-6 flex justify-between flex-col">
                <div className="flex justify-between">
                    <span className="h-[8px] w-[32px] bg-[#D0D0D0] rounded-[2px]"></span>
                    <span className="h-[8px] w-[32px] bg-[#D0D0D0] rounded-[2px]"></span>
                    <span className="h-[8px] w-[32px] bg-[#D0D0D0] rounded-[2px]"></span>
                    <span className="h-[8px] w-[32px] bg-[#D0D0D0] rounded-[2px]"></span>
                    <span className="h-[8px] w-[32px] bg-[#D0D0D0] rounded-[2px]"></span>
                </div>
                <div className="flex flex-col gap-3">
                    <span className="bg-[#E6E6E6] h-[8px] w-full rounded"></span>
                    <div className="flex justify-between gap-5">
                        <span className="h-[8px] w-[80%] bg-[#E6E6E6] rounded"></span>
                        <span className="h-[8px] w-[20%] bg-[#E6E6E6] rounded-[2px]"></span>
                    </div>
                    <div className="flex justify-between gap-5">
                        <span className="h-[8px] w-[60%] bg-[#E6E6E6] rounded"></span>
                        <span className="h-[8px] w-[40%] bg-[#E6E6E6] rounded-[2px]"></span>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Shimmer;