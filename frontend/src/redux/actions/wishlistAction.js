import * as WishlistAPI from "../../api/wishlistAPI"
import { GET_WISHLIST_FAIL, GET_WISHLIST_REQUSET, GET_WISHLIST_SUCCESS } from "../constants/wishlistConstant"

export const getWishlist = () => async (dispatch) => {
    try {
        dispatch({ type: GET_WISHLIST_REQUSET })

        const { data } = await WishlistAPI.getWishlist()
        dispatch({ type: GET_WISHLIST_SUCCESS, payload: data.wishlist })

    } catch (err) {
        dispatch({ type: GET_WISHLIST_FAIL, payload: err.response.data.message })
    }
}