import { LOAD_USER_FAIL, LOAD_USER_SUCCESS } from "../constants/userConstant"
import * as AuthAPI from "../../api/authAPI"

export const loadUser = () => async (dispatch) => {
    try {
        const { data } = await AuthAPI.loadUser()

        dispatch({ type: LOAD_USER_SUCCESS, payload: data.user })

    } catch (err) {
        dispatch({ type: LOAD_USER_FAIL, payload: err })
    }
}