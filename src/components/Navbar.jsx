import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const logoutHandler = () => {
    // Admin logout
    setAToken("");
    localStorage.removeItem("aToken");

    // Doctor logout
    setDToken("");
    localStorage.removeItem("dToken");
  };

  // For doctor view, show different navbar
  if (dToken && !aToken) {
    return (
      <div className="flex justify-between items-center px-6 sm:px-10 py-4 border-b border-[#064928]/30 bg-[#000000]">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#064928]">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = "http://localhost:5173/"}
            className="bg-[#064928] text-white text-sm px-6 py-2 rounded-lg hover:bg-[#064928]/90 transition-all font-medium"
          >
            Home
          </button>
          <button
            onClick={logoutHandler}
            className="cursor-pointer bg-[#064928] text-white text-sm px-6 py-2 rounded-lg hover:bg-[#064928]/90 transition-all font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Admin view (keep original)
  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b border-gray-700 bg-[#2a2a2a]">
      <div className="flex items-center gap-2 text-xs">
        <img
          className="w-36 sm:w-40 cursor-pointer"
          src={assets?.admin_logo || ""}
          alt=""
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-300">
          Admin
        </p>
      </div>
      <button
        onClick={logoutHandler}
        className="cursor-pointer bg-primary text-white text-sm px-10 py-2 rounded-full hover:opacity-90 transition-opacity"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
