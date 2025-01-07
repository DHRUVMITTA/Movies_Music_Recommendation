import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage/HomePage';
import SignIn from './Pages/SignIn/SignIn';
import Movies from './Pages/Movies/Movies';
import Music from './Pages/Music/Music';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from './authService';

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = document.cookie.split("; ").find(row => row.startsWith("access_token"))?.split("=")[1];

      if (token) {
        try {
          const response = await authService.verifyToken(token);

          if (response.status === 200) {
            setIsAuthenticated(true);
            if (window && window.location.pathname === "/SignIn") {
              navigate('/HomePage', { replace: true });
            }
          } else {
            setIsAuthenticated(false);
            document.cookie = 'access_token=; Max-Age=0; path=/';
            document.cookie = 'refresh_token=; Max-Age=0; path=/';
            if (window && window.location.pathname !== "/SignIn") {
              navigate('/HomePage', { replace: true });
            }
          }
        } catch (error) {
          console.error('Error:', error);
          setIsAuthenticated(false);
          document.cookie = 'access_token=; Max-Age=0; path=/';
          document.cookie = 'refresh_token=; Max-Age=0; path=/';
          if (window && window.location.pathname !== "/SignIn") {
            navigate('/HomePage', { replace: true });
          }
        }
      } else {
        setIsAuthenticated(false);
        if (window && window.location.pathname !== "/SignIn") {
          navigate('/HomePage', { replace: true });
        }
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div>
      <ToastContainer theme='dark' />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/Movies" element={<Movies />} />
        <Route path="/Music" element={<Music />} />
      </Routes>
    </div>
  );
}

export default App;
