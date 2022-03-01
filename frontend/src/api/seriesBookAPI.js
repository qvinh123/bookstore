import http from "./index"

export const getAllCollectionBook = (page = 1, sort) => http.get(`/api/v1/collectionBook?page=${page}${sort ? `&sort=${sort}` : ""}`)

export const newCollectionBook = (data) => http.post("/api/v1/admin/collectionBook/new", data)

export const deleteCollectionBook = (id) => http.delete(`/api/v1/admin/collectionBook/${id}`)

export const updateCollectionBook = (id, data) => http.patch(`/api/v1/admin/collectionBook/${id}`, data)

export const searchCollectionBook = (keyword, page = 1, sort) => http.get(`/api/v1/collectionBooks/search?page=${page}${keyword ? `&keyword=${keyword}` : ""}${sort ? `&sort=${sort}` : ""}`)

export const getProductsOfCollectionBookDetail = (slugCollectionBook, page = 1, sort) => http.get(`/api/v1/collectionBook/${slugCollectionBook}?page=${page}${sort && `&sort=${sort}`}`)