import { useState } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [mode, setMode] = useState("Login"); // "Login" or "Signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Signup fields for doctor
  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [degree, setDegree] = useState("");
  const [experience, setExperience] = useState("");
  const [about, setAbout] = useState("");
  const [fees, setFees] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Check if backend URL is configured
    if (!backendUrl) {
      toast.error("Backend URL is not configured. Please check your environment variables.");
      console.error("Backend URL is missing. Set VITE_BACKEND_URL in your .env file.");
      return;
    }

    // Debug: Log the backend URL being used
    console.log("Attempting to connect to backend at:", backendUrl);

    try {
      if (mode === "Signup" && state === "Doctor") {
        // Doctor signup
        const addressObj = {
          street: address,
          city: city,
          state: stateName,
          pincode: pincode,
        };

        const { data } = await axios.post(backendUrl + "/api/doctor/signup", {
          name,
          email,
          password,
          speciality,
          degree,
          experience,
          about,
          fees,
          address: JSON.stringify(addressObj),
        });

        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          toast.success("Doctor account created successfully");
          // Redirect to doctor dashboard
          navigate("/doctor/dashboard");
        }
      } else if (state === "Admin") {
        // Admin login (no signup for admin)
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Admin logged in successfully");
          navigate("/admin/dashboard");
        }
      } else {
        // Doctor login
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          toast.success("Doctor logged in successfully");
          navigate("/doctor/dashboard");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      
      // Handle network errors specifically
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        toast.error(
          `Network Error: Cannot connect to backend at ${backendUrl}. Please ensure the backend server is running.`
        );
        console.error("Backend URL:", backendUrl);
        console.error("Full error:", error);
      } else if (error.response) {
        // Server responded with error status
        const errorMessage = error.response?.data?.message || "Invalid credentials";
        toast.error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        toast.error(
          `No response from server. Please check if the backend is running at ${backendUrl}`
        );
      } else {
        // Something else happened
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-100 rounded-xl text-[#5E5E5E] text-sm shadow-lg max-h-[90vh] overflow-y-auto">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> {mode}
        </p>
        
        {/* Signup fields for Doctor */}
        {mode === "Signup" && state === "Doctor" && (
          <>
            <div className="w-full">
              <p>Name</p>
              <input
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <p>Speciality</p>
              <input
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <p>Degree</p>
              <input
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <p>Experience (years)</p>
              <input
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <p>About</p>
              <textarea
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                onChange={(e) => setAbout(e.target.value)}
                value={about}
                rows="3"
                required
              />
            </div>
            <div className="w-full">
              <p>Consultation Fees (₹)</p>
              <input
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                type="number"
                required
              />
            </div>
            <div className="w-full">
              <p>Address</p>
              <input
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                type="text"
                placeholder="Street address"
                required
              />
            </div>
            <div className="w-full">
              <p>City</p>
              <input
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                onChange={(e) => setCity(e.target.value)}
                value={city}
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <p>State</p>
              <input
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                onChange={(e) => setStateName(e.target.value)}
                value={stateName}
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <p>Pincode</p>
              <input
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                onChange={(e) => setPincode(e.target.value)}
                value={pincode}
                type="text"
                required
              />
            </div>
          </>
        )}

        {/* Common fields */}
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            required
          />
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base cursor-pointer">
          {mode === "Signup" ? "Sign Up" : "Login"}
        </button>
        
        {/* Toggle between Login and Signup */}
        {state === "Doctor" && (
          <p className="text-xs text-gray-500 mt-2">
            {mode === "Login" ? (
              <>
                Don't have an account?{" "}
                <span
                  className="text-primary underline cursor-pointer"
                  onClick={() => setMode("Signup")}
                >
                  Sign up here
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  className="text-primary underline cursor-pointer"
                  onClick={() => setMode("Login")}
                >
                  Login here
                </span>
              </>
            )}
          </p>
        )}

        {/* Toggle between Admin and Doctor */}
        {state === "Admin" ? (
          <p className="text-xs text-gray-500 mt-2">
            Are you a Doctor?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => {
                setState("Doctor");
                setMode("Login");
              }}
            >
              Click here
            </span>
          </p>
        ) : (
          <p className="text-xs text-gray-500 mt-2">
            Are you an Admin?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => {
                setState("Admin");
                setMode("Login");
              }}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
