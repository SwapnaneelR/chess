import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BE_URL = import.meta.env.VITE_BE_HTTP || "http://localhost:8080";

import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
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
        navigate("/");
      } else {
        toast.error("something went wrong!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "login fail");
    }
  }
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
    } catch (err) {
      toast.error(err.response?.data?.message || "register fail");
    }
  }

  async function logout() {
    try {
      // try to clear cookie on server if a logout route exists
      await axios.post(`${BE_URL}/api/logout`, {}, { withCredentials: true }).catch(() => {});
    } catch (err) {
      console.log(err)
    } 
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("chess_user");
    navigate("/login");
  }
  async function getprofile(){
    try{
      const response = await axios.get(`${BE_URL}/api/me`, { withCredentials: true });
      if(response && response.status === 200){
        // backend returns { user }
        setIsLoggedIn(true);
        setUser(response.data.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    }
    catch(err){ 
      // silently ignore/clear auth state on error
      console.log("getprofile error:", err?.response?.data || err.message);
      setIsLoggedIn(false);
      setUser(null);
    }
  } const [loading, setLoading] = useState(true);

  useEffect(() => {
    getprofile().finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  const value = { isLoggedIn, user, login, register, logout ,getprofile};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
