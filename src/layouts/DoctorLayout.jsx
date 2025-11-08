import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import DoctorMessages from "../pages/doctor/DoctorMessages";
import DoctorSlots from "../pages/doctor/DoctorSlots";
import DoctorProfile from "../pages/doctor/DoctorProfile";
import NotAuthorized from "../pages/auth/NotAuthorized";

const DoctorLayout = () => (
  <div className="bg-[#000000] min-h-screen">
    <Navbar />
    <div className="flex items-start">
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="messages" element={<DoctorMessages />} />
          <Route path="slots" element={<DoctorSlots />} />
          <Route path="profile" element={<DoctorProfile />} />
          
          <Route path="*" element={<NotAuthorized />} />
        </Routes>
      </div>
    </div>
  </div>
);

export default DoctorLayout;
