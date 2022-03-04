import axios from "axios";
import http from "./index";

export const updatedProfile = (userData) => http.patch("/api/v1/me/update", userData)

export const updatePassword = (passwordData) => http.patch("/api/v1/update/password", passwordData)

export const forgetPassword = (emailData) => axios.post("/api/v1/password/forget", emailData)

export const newPassword = (token, passwordData) => http.post(`/api/v1/password/reset/${token}`, passwordData)

export const getAllUsers = (page = 1, sort="") => http.get(`/api/v1/admin/users?page=${page}${sort ? `&sort=${sort}` : ""}`)

export const deleteUser = (id) => http.delete(`/api/v1/admin/users/${id}`)
export const updateUser = (id, data) => http.patch(`/api/v1/admin/users/${id}`, data)

export const searchUser = (keyword, page = 1, sort="") => http.get(`/api/v1/admin/search/user?page=${page}${keyword ? `&keyword=${keyword}` : ""}${sort ? `&sort=${sort}` : ""}`)