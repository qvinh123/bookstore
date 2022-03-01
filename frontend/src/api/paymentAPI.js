import http from "./index"

export const processPayment = (data) => http.post("/api/v1/payment/process",data)