import { GET_CART_FAIL, GET_CART_REQUEST, GET_CART_RESET, GET_CART_SUCCESS } from "../constants/cartConstant"

export const getCartsReducer = (state = { cartItems: [],loading:true }, { type, payload }) => {
    switch (type) {
        case GET_CART_REQUEST:
            return {
                loading: true
            }
        case GET_CART_SUCCESS:
            return {
                ...state,
                loading: false,
                cartItems: payload
            }
        case GET_CART_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
                cartItems: []
            }
        case GET_CART_RESET:
            return {
                cartItems: []
            }
        default:
            return state
    }
}