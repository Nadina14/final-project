import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const UserContext = createContext();

axios.defaults.withCredentials = true;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logIn = async (username, password) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8800/api/auth/login", { username, password });
      localStorage.setItem("user", JSON.stringify(response.data)); 
      localStorage.setItem("token", response.data.token); 
      setUser(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  const signUp = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8800/api/auth/register", { username, email, password });
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, logIn, signUp, logOut, error, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
