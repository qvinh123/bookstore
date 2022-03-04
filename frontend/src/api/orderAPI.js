import http from "./index"

export const newOrder = (data) => http.post("/api/v1/order/new", data)

export const myOrder = (page = 1, orderStatus) => http.get(`/api/v1/order/me?page=${page}${orderStatus ? `&orderStatus=${orderStatus}` : ""}`)

export const getOrderDetails = (idOrder) => http.get(`/api/v1/orders/${idOrder}`)

export const deleteOrder = (id) => http.delete(`/api/v1/admin/orders/${id}`)
export const updateOrder = (idOrder, data) => http.patch(`/api/v1/admin/orders/${idOrder}`, data)

export const getAllOrder = (page = 1, orderStatus, sort="") => http.get(`/api/v1/admin/orders?page=${page}${sort ? `&sort=${sort}` : ""}${orderStatus ? `&orderStatus=${orderStatus}` : ""}`)

export const getOrderSearch = (page = 1, id, orderStatus, sort="") => http.get(`/api/v1/admin/orders/search?page=${page}${id ? `&keyword=${id}` : ""}${orderStatus ? `&orderStatus=${orderStatus}` : ""}${sort ? `&sort=${sort}` : ""}`)