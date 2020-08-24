import { apiUrl } from "../config.json";
import http from "./httpService";

async function getPostComments(postId) {
  return await http.get(`${apiUrl}/comments/${postId}`);
}

async function createComment(postId, payload) {
  return await http.post(`${apiUrl}/comments/${postId}`, payload);
}

async function editComment(postId, commentId, payload) {
  return await http.patch(`${apiUrl}/comments/${postId}/${commentId}`, payload);
}

async function deleteComment(postId, commentId) {
  return await http.delete(`${apiUrl}/comments/${postId}/${commentId}`);
}

export default { getPostComments, createComment, editComment, deleteComment };
