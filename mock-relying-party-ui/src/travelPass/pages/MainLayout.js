import Navbar from "../shared/Navbar";


function MainLayout({ children }) {
  return (
    <div className="h-full w-full">
      <Navbar />
      {children}
    </div>
  );
}

export default MainLayout;