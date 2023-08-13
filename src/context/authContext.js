import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [renderHome,setRenderHome] = useState(false);

  const login = async (inputs) => {
    const res = await axios.post("https://taskboard-server.vercel.app/api/login", inputs);
    setCurrentUser(res.data);
  };
  const logout = async () => {setCurrentUser(null)};

  useEffect(() => {localStorage.setItem("user", JSON.stringify(currentUser))}, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, renderHome,setRenderHome }}>
      {children}
    </AuthContext.Provider>
  );
};