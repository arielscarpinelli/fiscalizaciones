import React, { createContext, useEffect, useState } from "react";
import Spinner from "components/Spinner";

import { checkToken } from "api/modules/users.api";

const UserContext = createContext({
  setAuth: () => {},
  setIsLogged: () => {},
  saveUserData: () => {},
  logout: () => {},
  token: null,
  isLogged: false,
  userData: null,
});

export const UserProvider = ({ children }) => {
  const [validated, setValidated] = useState(false);

  const [userData, setUserData] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  const logout = () => {
    setAuth(null);
    setIsLogged(false);
    setUserData(null);
  };

  const setAuth = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(user));
    setUserData(user);
  };

  const getTokenFromLocalStorage = () => {
    const token = localStorage.getItem("token");
    const data = localStorage.getItem("userData");
    if (!token || token === "null") {
      setAuth(null, null);
      setIsLogged(false);
    } else {
      setIsLogged(true);
      const user = JSON.parse(data);
      setAuth(token, user);
      tokenStillValid();
    }
    setValidated(true);
  };

  const tokenStillValid = async () => {
    await checkToken();
  };

  useEffect(getTokenFromLocalStorage, []);

  return (
    <UserContext.Provider
      value={{
        setAuth,
        setIsLogged,
        logout,
        isLogged,
        userData,
      }}
    >
      {validated ? children : <Spinner />}
    </UserContext.Provider>
  );
};

export function getUserPartido(userData) {
  return (userData.role === "OPERATOR" ||  userData.role === "ADMIN")
      && userData.partido;
}

export default UserContext;
