import TravelPassHomePage from "./TravelPassHomePage";

function Dashboard() {
  return (
    <div className="h-[37rem] flex flex-col items-center py-8 relative overflow-hidden bg-[rgba(249,245,255,1)]">
      <div>
        <div className="absolute top-[65%] left-[-6%] w-[24%] min-[1800px]:w-[40%] h-24 bg-[rgba(233,215,254,1)] transform -rotate-10"></div>
        <div className="absolute top-[75%] left-[-5%] w-[24%] min-[1800px]:w-[40%] h-14 bg-[rgba(214,187,251,1)] transform -rotate-10"></div>
      </div>

      <div>
        <div className="absolute top-[35%] left-[54%] w-[56%] h-24 bg-[rgba(214,187,251,1)] transform -rotate-10"></div>
        <div className="absolute top-[45%] left-[54%] w-[56%] h-14 bg-[rgba(233,215,254,1)] transform -rotate-10"></div>
      </div>
     
      <div className="absolute top-[76%] left-[-10%] w-[120%] h-[50%] bg-white transform -rotate-10 z-0"></div>

      <TravelPassHomePage />
    </div>
  );
}

export default Dashboard;