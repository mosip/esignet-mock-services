export default function Stepper() {
    let steps = [{ id:"upload", title: "Upload File", description: "Please provide your name and email", isActive: true, processCompleted: false },
    { id:"review", title: "Application is Under Review", description: "A few details about your company", isActive: false, processCompleted: false },
    { id:"approve", title: "Approved", description: "Start collaborating with your team", isActive: false, processCompleted: false }];

    const handleActiveTab = (e) => {

    };
    
    return (
        <ol className="flex items-center justify-center w-full">
            {steps.map((eachStep, index) => {
                return (
                    <li key={index} id={eachStep.id} className={`${(index +1) < steps.length ? 'w-[400px]' : ''}`}>
                        <div className={`flex w-full items-center after:content-[''] after:w-full after:h-1 ${(index +1) < steps.length ? 'after:border-b after:border-[#F9FAFB] after:border-4' : ''} after:inline-block`}>
                            <span className={`flex items-center justify-center w-8 h-8 rounded-full border-3 shrink-0 ${eachStep.isActive ? 'border-[#7F56D9]' : 'border-[#F9FAFB]'}`}>
                                <span className={`flex items-center justify-center w-[22px] h-[22px] rounded-full  text-lg font-semibold ${eachStep.isActive ? 'bg-[#7F56D9]' : 'bg-[#ffffff]'}`}>
                                    <span className={`flex items-center justify-center w-[8px] h-[8px] rounded-full  text-lg font-semibold ${eachStep.isActive ? 'bg-[#ffffff]' :'bg-[#F9FAFB]'}`}></span>
                                </span>
                            </span>
                        </div>
                        <div className="flex justify-center flex-col absolute w-[400px] text-center -ml-[185px] text-sm mt-2">
                            <p className={`font-semibold text-[#6941C6] ${eachStep.isActive ? 'text-[#6941C6]' : 'text-[#344054]'}`}>{eachStep.title}</p>
                            <p className={`${eachStep.isActive ? 'text-[#7F56D9]' : 'text-[#475467]'}`}>{eachStep.description}</p>
                        </div>
                    </li>
                )
            })}
        </ol>
    )
};