import axios from "axios"

export const getProvince = () => axios.get("https://provinces.open-api.vn/api/?depth=3")