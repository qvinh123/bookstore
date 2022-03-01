import * as AuthAPI from "./authAPI"
// import jwt_decode from "jwt-decode";
import { addTokenUser } from "../redux/actions/tokenAction";
import store from "../redux/store"
import axios from "axios";

const axiosJWT = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
})

// axiosJWT.interceptors.request.use(
//     async (config) => {
//         const currentDate = new Date();
//         const { token } = store.getState().token

//         if (token) {
//             const decodedToken = jwt_decode(token)
//             if (decodedToken.exp * 1000 < currentDate.getTime()) {
//                 const { data } = await AuthAPI.refreshToken()
//                 if (data) {
//                     config.headers["authorization"] = "Bearer " + data.token
//                     store.dispatch(addTokenUser(data.token))
//                 } else {
//                     localStorage.removeItem("isLogin")
//                     window.location.href = "/account/login"
//                 }
//             }
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// )

axiosJWT.interceptors.request.use((config) => {
    const { token } = store.getState().token;
    config.headers['authorization'] = "Bearer " + token;
    return config;
});

async function refresh_token() {
    // console.log('Refreshing access token')
    try {
        const { data } = await AuthAPI.refreshToken()
        return data.token
    } catch (err) {
        throw err
    }
}

axiosJWT.interceptors.response.use((response) => {
    return response
}, async (error) => {
    const config = error.config;
    if (error.response && error.response.status === 401 && !config._retry) {
        config._retry = true;
        try {
            const res = await refresh_token()

            config.headers["authorization"] = "Bearer " + res
            store.dispatch(addTokenUser(res))

            return axiosJWT(config);
        }
        catch (err) {
            return Promise.reject(err)
        }
    }
    localStorage.removeItem("isLogin")
    return Promise.reject(error)
});

export default axiosJWT