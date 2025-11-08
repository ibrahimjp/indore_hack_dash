import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";

const adminNavLinks = [
  { to: "/admin/dashboard", icon: assets.home_icon, label: "Dashboard" },
  {
    to: "/admin/all-appointments",
    icon: assets.appointment_icon,
    label: "All Appointments",
  },
  { to: "/admin/add-doctor", icon: assets.add_icon, label: "Add Doctor" },
  { to: "/admin/doctors-list", icon: assets.home_icon, label: "Doctor List" },
];

const doctorNavLinks = [
  { to: "/doctor/dashboard", icon: assets.home_icon, label: "Dashboard" },
  {
    to: "/doctor/appointments",
    icon: assets.appointment_icon,
    label: "My Appointments",
  },
  { to: "/doctor/messages", icon: assets.people_icon, label: "Messages" },
  { to: "/doctor/slots", icon: assets.appointment_icon, label: "Slots" },
  { to: "/doctor/profile", icon: assets.people_icon, label: "Profile" },
];

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  
  // For doctor view, show different sidebar
  if (dToken && !aToken) {
    return (
      <div className="min-h-screen bg-[#000000] border-r border-[#064928]/30 w-64">
        <ul className="text-gray-300 mt-6">
          {doctorNavLinks.map(({ to, icon, label }) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-4 px-6 cursor-pointer transition-all ${
                  isActive 
                    ? "bg-[#064928] text-white border-r-4 border-[#064928]" 
                    : "hover:bg-[#064928]/10 text-gray-300 hover:text-white"
                }`
              }
              key={to}
              to={to}
            >
              <img src={icon} alt={label} className="w-5 h-5" />
              <p className="font-medium">{label}</p>
            </NavLink>
          ))}
        </ul>
      </div>
    );
  }
  
  // Admin view (keep original)
  return (
    <div className="min-h-screen bg-[#2a2a2a] border-r border-gray-700">
      {aToken && (
        <ul className="text-gray-300 mt-5">
          {adminNavLinks.map(({ to, icon, label }) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-60 lg:min-w-72 cursor-pointer transition-colors ${
                  isActive 
                    ? "bg-[#3a3a3a] border-r-4 border-primary text-white" 
                    : "hover:bg-[#333333] text-gray-300"
                }`
              }
              key={to}
              to={to}
            >
              <img src={icon} alt={label} />
              <p className="hidden md:block">{label}</p>
            </NavLink>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
