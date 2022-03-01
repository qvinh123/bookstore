import React, { useEffect, useState } from 'react'

import * as WishlistAPI from "../../../api/wishlistAPI"

import { useHistory } from 'react-router'
import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'
import { GET_WISHLIST_SUCCESS } from '../../../redux/constants/wishlistConstant'
import { wishlistSelector } from '../../../redux/selectors/wishlistSelector'
import { userSelector } from '../../../redux/selectors/userSelector'

const ProductDetailsWishlist = ({ productDetails }) => {

    const { wishlist } = useSelector(wishlistSelector)
    const { user } = useSelector(userSelector)

    const dispatch = useDispatch()
    const history = useHistory()
    const alert = useAlert()

    const [heart, setHeart] = useState(false)

    useEffect(() => {
        if (wishlist?.length > 0) {
            wishlist?.forEach(item => {
                if (item.product?._id === productDetails?._id) {
                    setHeart(true)
                }
            })
        }
        return () => setHeart(false)
    }, [productDetails?._id, wishlist])

    const addWishlist = async () => {
        try {
            if (user) {
                if (wishlist.length > 0) {
                    dispatch({ type: GET_WISHLIST_SUCCESS, payload: [...wishlist, { product: productDetails }] })
                } else {
                    dispatch({ type: GET_WISHLIST_SUCCESS, payload: [{ product: productDetails }] })
                }
                await WishlistAPI.addWishlist({ product: productDetails?._id })
                setHeart(true)
            } else {
                history.push("/account/login")
            }
        } catch (err) {
            setHeart(false)
            alert.error(err.response.data.message)
        }
    }

    const deleteWishList = async () => {
        try {
            if (user) {
                const arr = wishlist?.filter(item => item.product._id !== productDetails?._id)

                dispatch({ type: GET_WISHLIST_SUCCESS, payload: [...arr] })
                await WishlistAPI.deleteWishlist(productDetails?._id)

                setHeart(false)
            }
        } catch (err) {
            setHeart(true)
            alert.error(err.response.data.message)
        }
    }

    return (
        <div className="btn_wishlist">
            {heart && <button onClick={() => deleteWishList()} id="btn_wishlist_remove">
                <i style={{ color: "var(--primary-color)" }} className="fa fa-heart"></i>
            </button>}

            {!heart && <button onClick={() => addWishlist()} id="btn_wishlist_add">
                <i className="far fa-heart"></i>
            </button>}
        </div>
    )
}

export default ProductDetailsWishlist
