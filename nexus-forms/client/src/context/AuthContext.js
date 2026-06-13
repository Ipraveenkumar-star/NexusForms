import { createContext, useContext, useState, useEffect } from 'react';

const Ctx = createContext();

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nf_user');
    if (saved) setUser(JSON.parse(saved));
    setReady(true);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('nf_token', token);
    localStorage.setItem('nf_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nf_token');
    localStorage.removeItem('nf_user');
  };

  return <Ctx.Provider value={{ user, login, logout, ready }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
