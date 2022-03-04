import axios from "axios"
import http from "./index"

export const getAllAuthors = (page = 1, sort="") => axios.get(`/api/v1/authors?page=${page}${sort ? `&sort=${sort}` : ""}`)

export const newAuthor = (data) => http.post(`/api/v1/admin/author/new`, data)

export const deleteAuthor = (id) => http.delete(`/api/v1/admin/authors/${id}`)

export const updateAuthor = (id, data) => http.patch(`/api/v1/admin/authors/${id}`, data)

export const searchAuthor = (name, page = 1, sort="") => axios.get(`/api/v1/authors/search?page=${page}${name ? `&keyword=${name}` : ""}${sort ? `&sort=${sort}` : ""}`)

export const getProductsOfAuthorDetail = (slugAuthor, page = 1, sort="") => axios.get(`/api/v1/authors/${slugAuthor}?page=${page}${sort ? `&sort=${sort}` : ""}`)