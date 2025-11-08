import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

export const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [slots, setSlots] = useState({});
  const [loading, setLoading] = useState(false);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/appointments",
        { headers: { dToken } }
      );

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch appointments"
      );
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to complete appointment"
      );
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel appointments"
      );
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", {
        headers: { dToken },
      });

      if (data.success) {
        setDashData(data.dashData);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel appointments"
      );
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/profile", {
        headers: { dToken },
      });

      if (data.success) {
        setProfileData(data.profileData);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel appointments"
      );
    }
  };

  // Get chat history with users
  const getChatHistory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        backendUrl + "/api/doctor/chat-history",
        { headers: { dToken } }
      );

      if (data.success) {
        setChatHistory(data.conversations || []);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch chat history"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get messages with specific user
  const getUserMessages = async (userId) => {
    try {
      const { data } = await axios.get(
        backendUrl + `/api/doctor/chat/${userId}`,
        { headers: { dToken } }
      );

      if (data.success) {
        return {
          success: true,
          messages: data.messages || [],
          user: data.user || null,
        };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch messages",
      };
    }
  };

  // Send message as doctor
  const sendMessage = async (userId, message) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        backendUrl + "/api/doctor/send-message",
        { userId, message },
        { headers: { dToken } }
      );

      if (data.success) {
        return { success: true, chat: data.chat };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send message",
      };
    } finally {
      setLoading(false);
    }
  };

  // Get doctor slots
  const getDoctorSlots = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/slots", {
        headers: { dToken },
      });

      if (data.success) {
        setSlots(data.slots_booked || {});
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch slots"
      );
    }
  };

  // Update doctor slots
  const updateDoctorSlots = async (slots_booked) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        backendUrl + "/api/doctor/slots",
        { slots_booked },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message || "Slots updated successfully");
        setSlots(slots_booked);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update slots"
      );
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update slots",
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    dToken,
    setDToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    chatHistory,
    getChatHistory,
    getUserMessages,
    sendMessage,
    slots,
    getDoctorSlots,
    updateDoctorSlots,
    loading,
  };
  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};
