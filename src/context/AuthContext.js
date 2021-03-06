import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(localStorage.getItem('loggedIn'));
  const [loggedUser, setLoggedUser] = useState(
    localStorage.getItem('username')
  );
  const [loggedID, setLoggedID] = useState(false);
  const [userID, setUserID] = useState('');
  const [faildLogin, setFaildLogin] = useState(false);
  const login = async (username, password) => {
    try {
      const request = await fetch('/api/v1/auth/login', {
        headers: {
          Authorization: `Basic ${window.btoa(username + ':' + password)}`,
        },
        method: 'POST',
      });
      const data = await request.json();
      console.log(data);
      if (request.status === 401) {
        setFaildLogin(true)
        return false;
      }
      if (request.status === 200) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
  console.log(faildLogin);
  const setUserStorage = () => {
    setLoggedUser(localStorage.getItem('username'));
  };
  useEffect(() => {
    const setID = async () => {
      const request = await fetch('/api/v1/auth/userinfo/' + loggedUser);
      const data = await request.json();
      setUserID(data.id);
    };
    setID();
  }, loggedID);
  const register = async (username, email, password) => {
    try {
      const request = await fetch('/api/v1/auth/register', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });
      const data = await request.json();

      if (request.status === 201) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const addIsLogged = () => {
    setIsLogged(true);
    localStorage.setItem('loggedIn', true);
  };

  const removeIsLogged = () => {
    setIsLogged(null);
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
  };

  const logout = async () => {
    const request = await fetch('/api/v1/auth/logout');
    if (request.status === 204) {
      setLoggedUser(null);
      return true;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        isLogged,
        addIsLogged,
        removeIsLogged,
        logout,
        loggedUser,
        setLoggedUser,
        userID,
        setUserID,
        setLoggedID,
        setUserStorage,
        faildLogin,
        setFaildLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
