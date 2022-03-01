import { createStore, combineReducers, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import thunk from "redux-thunk"
import { authReducer } from "./reducers/authReducer"
import { tokenUserReducer } from "./reducers/tokenReducer"
import { wishlistReducer } from "./reducers/wishlistReducer"
import { getCartsReducer } from "./reducers/cartReducer"
import { categoriesReducer } from "./reducers/categoriesReducer"
import { userReducer } from "./reducers/userReducer"

const isLoginFromLocal = localStorage.getItem("isLogin") ? JSON.parse(localStorage.getItem("isLogin")) : false

const initialState = {
    auth: {
        isAuthenticated: isLoginFromLocal,
    }
}

const reducer = combineReducers({
    auth: authReducer,
    carts: getCartsReducer,
    token: tokenUserReducer,
    wishlist: wishlistReducer,
    categories: categoriesReducer,
    user: userReducer
})

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store