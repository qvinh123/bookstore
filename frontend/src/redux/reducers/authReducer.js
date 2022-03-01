import { CLEAR_ERRORS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS } from "../constants/authContant"

export const authReducer = (state = { isAuthenticated: false }, { type, payload }) => {
    switch (type) {
        case LOGIN_REQUEST:
        case REGISTER_REQUEST:
            return {
                loading: true,
                isAuthenticated: false,
            }
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
            }

        case LOGOUT_SUCCESS:
            return {
                loading: false,
                isAuthenticated: false,
            }

        case LOGOUT_FAIL:
            return {
                ...state,
                error: payload
            }

        case LOGIN_FAIL:
        case REGISTER_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                error: payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}



