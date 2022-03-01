import * as CartAPI from "../../api/cartAPI"
import { GET_CART_FAIL, GET_CART_RESET, GET_CART_SUCCESS } from "../constants/cartConstant"

export const getCartAction = () => async (dispatch) => {

    try {
        const { data } = await CartAPI.getCart()

        dispatch({ type: GET_CART_SUCCESS, payload: data.carts })
    } catch (err) {
        dispatch({ type: GET_CART_FAIL, payload: err.response.data.message })
    }
}

export const addCartAction = (carts) => {
    return { type: GET_CART_SUCCESS, payload: [...carts] }
}

export const clearCartAction = () => {
    return { type: GET_CART_RESET }
} 