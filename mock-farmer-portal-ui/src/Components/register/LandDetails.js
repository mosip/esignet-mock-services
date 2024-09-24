import { React, useEffect, useState } from "react";
import landMap from "../../assets/img/landMap.png";
import { AreaSelector } from "@bmunozg/react-image-area";

function LandDetails({ getSelectedAreaAcres }) {
  const [areas, setAreas] = useState([]);

  const onChangeHandler = (areas) => {
    setAreas(areas);

    let newIndex = areas.length -1;
    let heightInMeters = areas[newIndex].height * 0.01;
    let widthInMeters = areas[newIndex].width * 0.01;
    let areaInSquareMeters = heightInMeters * widthInMeters;

    let areaInAcres = areaInSquareMeters / 4046.85642;
    getSelectedAreaAcres(areaInAcres);
    
  };

  return (
    <div>
      <div className="w-[100%] h-[760px]">
        <AreaSelector
          className="h-full"
          areas={areas}
          onChange={onChangeHandler}
        >
          <img src={landMap} alt="my image" className="h-[760px]" />
        </AreaSelector>
      </div>
    </div>
  );
}

export default LandDetails;
