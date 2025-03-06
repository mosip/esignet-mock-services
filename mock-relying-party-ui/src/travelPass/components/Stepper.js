import { useEffect, useState } from "react";

export default function Stepper({ uploadStatus, previewStatus, moveBack }) {
    const [uploaded, setUploaded] = useState(true);
    const [previewed, setPreviewed] = useState(false);

    useEffect(() => {
        if (uploadStatus) {
            setUploaded(false);
            setPreviewed(false);
        }
        if (previewStatus) {
            setPreviewed(true);
        }
        if (moveBack) {
            setUploaded(true);
            setPreviewed(false);
        }
    }, [uploadStatus, previewStatus, moveBack]);

    let steps = [
        { id: "verifyTravellerId", title: "Verify Traveller National ID", description: "Lorem ipsum dolor sit amet consectetur", isActive: false, processCompleted: true, },
        { id: "uploadEInvoice", title: "Upload E-Invoice", description: "Lorem ipsum dolor sit amet consectetur dolor sit", isActive: uploaded, processCompleted: !uploaded },
        { id: "previewDetails", title: "Preview Details", description: "Lorem ipsum dolor sit amet consectetur", isActive: (!uploaded && !previewed), processCompleted: previewed },
        { id: "passIssued", title: "Travel Pass Issued", description: "Lorem ipsum dolor sit amet consecteturdolor sit", isActive: previewed, processCompleted: false }
    ];

    return (
        <ol className="flex items-center justify-center px-2">
            {steps.map((eachStep, index) => {
                return (
                    <li key={index} id={eachStep.id} className={`${(index + 1) < steps.length ? 'lg:w-[25%] w-[25%]' : ''} mt-[4%]`}>
                        <div className={`flex w-full items-center after:content-[''] after:w-full after:h-1 ${(index + 1) < steps.length ? (eachStep.processCompleted ? 'after:border-b after:border-[#966af3] after:border-4' : 'after:border-b after:border-[#ededee] after:border-4') : ''} after:inline-block`}>
                            {eachStep.processCompleted
                                ? <img src='images/tick_icon.png' className="md:h-[1.1rem] lg:h-[1.5rem]"/>
                                : (eachStep.isActive ? <img src='images/activeStep_icon.png'  className="md:h-[1.1rem] lg:h-[1.5rem]" /> : <img src='images/ideal_icon.png'  className="md:h-[1.1rem] lg:h-[1.5rem]"/>)
                            }
                        </div>
                        <div className="flex justify-center flex-col absolute lg:w-[400px] md:w-[150px] text-center md:-ml-[75px] lg:-ml-[185px] text-[11px] mt-2">
                            <p className={`font-semibold text-[#6941C6] ${eachStep.isActive ? 'text-[#6941C6] md:text-xs' : 'text-[#344054] md:text-xs'}`}>{eachStep.title}</p>
                            <p className={`${eachStep.isActive ? 'text-[#7F56D9]' : 'text-[#475467]'}`}>{eachStep.description}</p>
                        </div>
                    </li>
                )
            })}
        </ol>
    )
};