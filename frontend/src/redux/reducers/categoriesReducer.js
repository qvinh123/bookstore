import { GET_CATEGORIES_FAIL, GET_CATEGORIES_SUCCESS } from "../constants/categoriesConstant";

const initialState = {
    categories: [],
    error: null
}
export const categoriesReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_CATEGORIES_SUCCESS:
            return {
                ...state,
                categories: payload
            }
        case GET_CATEGORIES_FAIL:
            return {
                ...state,
                error: payload
            }
        default:
            return state
    }
}