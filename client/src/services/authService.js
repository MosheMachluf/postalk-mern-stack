import { apiUrl, tokenKey } from "../config.json";
import http from "./httpService";
import jwtDecode from "jwt-decode";

function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (err) {
    return null;
  }
}

async function register(payload) {
  return await http.post(`${apiUrl}/account/register`, payload);
}

async function login(payload) {
  const { data } = await http.post(`${apiUrl}/account/login`, payload);
  localStorage.setItem(tokenKey, data.token);
}

async function logout() {
  await http.patch(`${apiUrl}/account/logout`);
  localStorage.removeItem(tokenKey);
}

export default { register, login, getCurrentUser, logout };
