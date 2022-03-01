import { LOAD_USER_FAIL, LOAD_USER_SUCCESS, RESET_USER, } from "../constants/userConstant"

export const userReducer = (state = { user: null }, { type, payload }) => {
    switch (type) {
        case LOAD_USER_SUCCESS:
            return {
                user: payload,
            }

        case LOAD_USER_FAIL:
            return {
                error: payload,
                user: null,
            }

        case RESET_USER:
            return {
                user: null,
            }

        default:
            return state
    }
}



