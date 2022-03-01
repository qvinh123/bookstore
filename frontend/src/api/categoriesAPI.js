import axios from "axios"
import http from "./index"

export const getAllCategories = () => axios.get("/api/v1/categories")

export const updateCategory = (id, data) => http.patch(`/api/v1/admin/categories/${id}`, data)

export const newCategory = (data) => http.post(`/api/v1/admin/category/new`, data)

export const getProductsOfCategoryDetail = (slugCategory, page = 1, price, rating, object, sort) => axios.get(`/api/v1/categories/${slugCategory}?page=${page}${rating ? `&rating[lte]=${rating}` : ""}${object ? object.map(o => `&object=${o}`).join('') : ""}${sort && `&sort=${sort}`}${price && `&price[gte]=${price[0]}&price[lte]=${price[1]}`}`)


