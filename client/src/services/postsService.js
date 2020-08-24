import { apiUrl } from "../config.json";
import http from "./httpService";

async function getAllPosts() {
  return await http.get(`${apiUrl}/posts`);
}

async function getUserPosts(userId) {
  return await http.get(`${apiUrl}/posts/user-posts/${userId}`);
}

async function getSavedPosts() {
  return await http.get(`${apiUrl}/account/saved-posts`);
}

async function search(q, images) {
  return await http.get(`${apiUrl}/posts/search?q=${q}&images=${images}`);
}
async function createPost(payload) {
  return await http.post(`${apiUrl}/posts`, payload);
}

async function editPost(postId, payload) {
  return await http.put(`${apiUrl}/posts/${postId}`, payload);
}

async function likePost(postId) {
  return await http.patch(`${apiUrl}/posts/${postId}`);
}

async function savePost(payload) {
  return await http.patch(`${apiUrl}/account/save-post`, payload);
}

async function deletePost(postId) {
  return await http.delete(`${apiUrl}/posts/${postId}`);
}

export default {
  getAllPosts,
  getUserPosts,
  getSavedPosts,
  search,
  createPost,
  editPost,
  likePost,
  savePost,
  deletePost,
};
