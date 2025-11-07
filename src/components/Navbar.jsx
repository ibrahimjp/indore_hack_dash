import { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";

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
  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b border-gray-700 bg-[#2a2a2a]">
      <div className="flex items-center gap-2 text-xs">
        <img
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt=""
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-300">
          {aToken ? "Admin" : "Doctor"}
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
