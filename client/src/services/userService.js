import { apiUrl } from "../config.json";
import http from "./httpService";

async function details(userId) {
  return await http.get(`${apiUrl}/account/profile/${userId}`);
}

async function editProfile(payload) {
  return await http.put(`${apiUrl}/account/profile`, payload);
}

async function changeAvatar(userId, payload) {
  return await http.patch(
    `${apiUrl}/account/profile/avatar/${userId}`,
    payload
  );
}

async function deleteAccount() {
  return await http.delete(`${apiUrl}/account`);
}

export default { details, editProfile, changeAvatar, deleteAccount };
