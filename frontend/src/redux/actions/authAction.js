import { RESET_USER } from "../constants/userConstant"
import { GET_CART_RESET } from "../constants/cartConstant"
import { GET_WISHLIST_RESET } from "../constants/wishlistConstant"
import { TOKEN_USER_RESET } from "../constants/tokenConstant"
import { CLEAR_ERRORS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS } from "../constants/authContant"

import * as AuthAPI from "../../api/authAPI"

export const registerUser = (user) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_REQUEST })

        const { data } = await AuthAPI.signUp(user)
        dispatch({ type: REGISTER_SUCCESS, payload: data.user })
        localStorage.setItem("isLogin", true)
    } catch (err) {
        dispatch({ type: REGISTER_FAIL, payload: err.response.data.message })
    }
}

export const loginUser = (user) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST })

        const { data } = await AuthAPI.signIn(user)

        dispatch({ type: LOGIN_SUCCESS, payload: data.user })
        localStorage.setItem("isLogin", true)

    } catch (err) {
        dispatch({ type: LOGIN_FAIL, payload: err.response.data.message })
    }
}


export const logoutUser = () => async (dispatch) => {
    try {

        await AuthAPI.logout()

        dispatch({ type: LOGOUT_SUCCESS })
        dispatch({ type: GET_CART_RESET })
        dispatch({ type: TOKEN_USER_RESET })
        dispatch({ type: GET_WISHLIST_RESET })
        dispatch({ type: RESET_USER })

        localStorage.removeItem("isLogin")
    } catch (err) {
        dispatch({ type: LOGOUT_FAIL, payload: err })
    }
}

export const clearErrorUser = () => {
    return { type: CLEAR_ERRORS }
}
