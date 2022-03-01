import http from "./index.js"

export const addCart = (dataCart) => http.post("/api/v1/newCart", dataCart)

export const getCart = () => http.get("/api/v1/carts")

export const deleteCart = (productId) => http.delete(`/api/v1/carts/${productId}`)

export const deleteAllCart = () => http.delete(`/api/v1/deleteAllCart`)