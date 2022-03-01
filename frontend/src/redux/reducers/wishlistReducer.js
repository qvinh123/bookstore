import { CLEAR_ERROR, GET_WISHLIST_FAIL, GET_WISHLIST_RESET, GET_WISHLIST_SUCCESS } from "../constants/wishlistConstant";

export const wishlistReducer = (state = { wishlist: [], loading: true }, { type, payload }) => {
    switch (type) {
        case GET_WISHLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                wishlist: payload
            }
        case GET_WISHLIST_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
                wishlist: []
            }
        case GET_WISHLIST_RESET:
            return {
                ...state,
                wishlist: []
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}