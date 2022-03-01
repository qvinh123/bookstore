import axios from "axios"
import http from "./index"

export const signUp = (user) => axios.post("/api/v1/register", user)

export const signIn = (user) => axios.post("/api/v1/login", user)

export const logout = () => http.get("/api/v1/logout")

export const token = () => http.get("/api/v1/me/token")

export const refreshToken = () => axios.get("/api/v1/refreshToken")

export const loadUser = () => http.get("/api/v1/me")

export const getStripe = () => http.get("/api/v1/stripeapi")

export const getAllUser = () => http.get(`/api/v1/admin/users`)