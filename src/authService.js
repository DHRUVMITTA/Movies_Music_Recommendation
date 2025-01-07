import axios from "axios";
import * as JWT  from "jwt-decode";

const API_URL = "http://127.0.0.1:5000/auth";

const register = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/register`, { username, email, password });
  
  // Store tokens as cookies
  document.cookie = `access_token=${response.data.tokens.access}; path=/`;
  document.cookie = `refresh_token=${response.data.tokens.refresh}; path=/`;
  
  setAuthState();
  return response.data;
};

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
  
  // Store tokens as cookies
  document.cookie = `access_token=${response.data.tokens.access}; path=/`;
  document.cookie = `refresh_token=${response.data.tokens.refresh}; path=/`;

  setAuthState();
  return response.data;
};

const logout = async () => {
  await axios.get(`${API_URL}/logout`, { withCredentials: true });
  
  // Clear cookies
  document.cookie = 'access_token=; Max-Age=0; path=/';
  document.cookie = 'refresh_token=; Max-Age=0; path=/';
  clearAuthState();
};

const refreshAccessToken = async () => {
  const response = await axios.get(`${API_URL}/refresh`, { withCredentials: true });
  document.cookie = `access_token=${response.data.access_token}; path=/`;
  return response.data.access_token;
};

const getCurrentUser = () => {
  try {
    const token = document.cookie.split("; ").find((row) => row.startsWith("access_token"))?.split("=")[1];
    return JWT.jwtDecode(token);
  } catch (error) {
    return null;
  }
};

const setAuthState = () => {
  const user = getCurrentUser();
  if (user) {
    authStateChangedCallback(user);
  }
};

const clearAuthState = () => {
  authStateChangedCallback(null);
};

const verifyToken = async (token) => {
  const response = await axios.post(`${API_URL}/verify`, { token }, { withCredentials: true });
  return response;
};

let authStateChangedCallback = () => {};

export const onAuthStateChanged = (callback) => {
  authStateChangedCallback = callback;
  setAuthState();
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  refreshAccessToken,
  verifyToken,
};
export default authService;
