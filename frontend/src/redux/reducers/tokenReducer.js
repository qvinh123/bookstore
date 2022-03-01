import { TOKEN_USER_FAIL, TOKEN_USER_RESET, TOKEN_USER_SUCCESS } from "../constants/tokenConstant"

export const tokenUserReducer = (state = { token: null }, { type, payload }) => {
    switch (type) {
        case TOKEN_USER_SUCCESS:
            return {
                token: payload
            }

        case TOKEN_USER_FAIL:
            return {
                token: null,
                error: payload
            }

        case TOKEN_USER_RESET:
            return {
                token: null,
            }

        default:
            return state
    }
}