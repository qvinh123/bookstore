import * as AuthAPI from "../../api/authAPI"
import { LOGOUT_SUCCESS } from "../constants/authContant"
import { TOKEN_USER_FAIL, TOKEN_USER_SUCCESS } from "../constants/tokenConstant"
import { loadUser } from "./userAction"

export const getTokenUser = (history) => async (dispatch) => {
    try {
        const { data } = await AuthAPI.token()

        dispatch({ type: TOKEN_USER_SUCCESS, payload: data.token })

        dispatch(loadUser())

    } catch (err) {
        dispatch({ type: TOKEN_USER_FAIL, payload: err.response.data.message })
        dispatch({ type: LOGOUT_SUCCESS })

        localStorage.removeItem("isLogin")

        history.push("/account/login")
    }
}

export const addTokenUser = (token) => {
    return { type: TOKEN_USER_SUCCESS, payload: token }
}