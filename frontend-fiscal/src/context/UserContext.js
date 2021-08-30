import React, { createContext, useEffect, useState } from "react";
import { setAPIAuthToken } from "api/apiClient";
import Spinner from "components/Spinner";

const UserContext = createContext({
  setAuthToken: () => {},
  setDNI: () => {},
  setEmailValidated: () => {},
  setIsLogged: () => {},
  setPhone: () => {},
  logout: () => {},
  token: null,
  isLogged: false,
  email: null,
  emailValidated: false,
  phone: null,
});

export const UserProvider = ({ children }) => {
  const [validated, setValidated] = useState(false);

  const [token, setToken] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  const [dni, setDNI] = useState(null);
  const [phone, setPhone] = useState(null);
  const [emailValidated, setEmailValidated] = useState(false);

  const logout = () => {
    setAuthToken(null);
    setIsLogged(false);
  };

  const setAuthToken = (token) => {
    setAPIAuthToken(token);
    setToken(token);
    localStorage.setItem("fiscal_token", token);
  };

  const getTokenFromLocalStorage = () => {
    const token = localStorage.getItem("fiscal_token");
    if (!token || token === "null") {
      setAuthToken(null);
    } else {
      setIsLogged(true);
      setAuthToken(token);
    }
    setValidated(true);
  };

  useEffect(getTokenFromLocalStorage, []);

  return (
    <UserContext.Provider
      value={{
        setAuthToken,
        setDNI,
        setEmailValidated,
        setIsLogged,
        setPhone,
        logout,
        token,
        isLogged,
        dni,
        emailValidated,
        phone,
      }}
    >
      {validated ? children : <Spinner />}
    </UserContext.Provider>
  );
};

export default UserContext;
