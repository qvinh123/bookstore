import axios from "axios"
import http from "./index"

export const getAllProducts = (page = 1, price = "", rating = "", object = "", sort = "") => axios.get(`/api/v1/products?page=${page}${price ? `&price[gte]=${price[0]}&price[lte]=${price[1]}` : ""}${rating ? `&rating[lte]=${rating}` : ""}${object ? object.map(o => `&object=${o}`).join('') : ""}${sort ? `&sort=${sort}` : ""}`)

export const getDetailsProduct = (slugName) => axios.get(`/api/v1/products/${slugName}`)

export const getProductSearch = (keyword, page = 1, sort = "") => axios.get(`/api/v1/product/search?keyword=${keyword}&page=${page}${sort ? `&sort=${sort}` : ""}`)

export const updateProductDetail = (id, data) => http.patch(`/api/v1/admin/product/${id}`, data)

export const deleteProduct = (id) => http.delete(`/api/v1/admin/product/${id}`)

export const newProduct = (data) => http.post(`/api/v1/admin/product/new`, data)

export const getAllComments = (slug, page = 1, rating = "") => axios.get(`/api/v1/product/reviews/${slug}?page=${page}${rating ? rating : ""}`)