import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BE_URL = "http://localhost:8080";

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
        toast.error("something went wrong");
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

  const value = { isLoggedIn, user, login, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
