import axios from "axios"
import http from "./index"

export const uploadBanner = (data) => http.post(`/api/v1/product/banner/upload`, data)

export const getBanners = () => axios.get(`/api/v1/banners`)

export const getBannerDetails = (id) => axios.get(`/api/v1/products/banners/${id}`)