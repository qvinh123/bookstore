import * as CategoriesAPI from "../../api/categoriesAPI"
import { GET_CATEGORIES_FAIL, GET_CATEGORIES_SUCCESS } from "../constants/categoriesConstant"

export const getCategories = () => async dispatch => {
    try {
        const { data } = await CategoriesAPI.getAllCategories()

        dispatch({ type: GET_CATEGORIES_SUCCESS, payload: data.data.categories })
    } catch (err) {
        dispatch({ type: GET_CATEGORIES_FAIL, payload: err.response.data.message })
    }
}