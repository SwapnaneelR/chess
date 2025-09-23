import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
const BE_URL = "http://localhost:8080";

const useAuth = () => {
  const navigate = useNavigate();
  //  a login function that sends a POST request to the backend
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  async function login(username, password) {
    try {
      const response = await axios.post(
        `${BE_URL}/api/login`,
        { username, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        toast.success("Login Successful");
      } else {
        toast.error("something went wrong");
      }
    } catch (err){
      toast.error(err.response?.data?.message || "login fail");
    }
  }
  // a register function that sends a POST request to the backend
  async function register(username, password) {
    try {
      const response = await axios.post(
        `${BE_URL}/api/register`,
        { username, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUser(response.data.user);
        navigate("/login");
        toast.success("Registration Successful");
        return;
      }
      toast.error("something went wrong");
    } catch (err){
      toast.error(err.response?.data?.message || "register fail");
    }
  }
  return { isLoggedIn, user, login, register };
};
// export all the functions and the user state
export default useAuth;
