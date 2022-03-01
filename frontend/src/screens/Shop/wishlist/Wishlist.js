import React, { useEffect } from 'react'


import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'
import { CLEAR_ERROR, GET_WISHLIST_RESET, GET_WISHLIST_SUCCESS } from '../../../redux/constants/wishlistConstant'
import { wishlistSelector } from '../../../redux/selectors/wishlistSelector'

import { usePagePagination } from '../../../hooks/usePagePagination'

import { panigationProduct } from '../../../utils'

import Banner from '../../../components/Banner/Banner'
import ProductItem from '../../../components/ProductItem/ProductItem'
import Button from '../../../components/Button/Button'
import Loader from '../../../components/Loader/Loader'
import Paginate from '../../../components/Paginate/Paginate'
import MetaData from '../../../components/MetaData/MetaData'
import Layout from '../../../components/layout/Layout'

import * as WishlistAPI from "../../../api/wishlistAPI"


const Wishlist = () => {
    const { wishlist, loading, error } = useSelector(wishlistSelector)

    const dispatch = useDispatch()

    const resultPerPage = 24

    const { currentPage, setCurrentPageNo } = usePagePagination()

    const alert = useAlert()

    useEffect(() => {
        if (error) {
            alert.error(error)

            dispatch({ type: CLEAR_ERROR })
        }
    }, [error, alert, dispatch])

    const deleteWishList = async (productDetailsId) => {
        try {
            const arr = wishlist?.filter(item => item.product._id !== productDetailsId)


            dispatch({ type: GET_WISHLIST_SUCCESS, payload: [...arr] })
            await WishlistAPI.deleteWishlist(productDetailsId)

        } catch (err) {
            alert.error(err.response.data.message)
        }
    }

    const deleteAllWishList = async () => {
        try {
            dispatch({ type: GET_WISHLIST_RESET })
            await WishlistAPI.deleteAllWishlist()
        } catch (err) {
            alert.error(err.response.data.message)
        }
    }

    const listProductsWishlist = panigationProduct(currentPage, resultPerPage, wishlist)?.map(({ product }) => (
        <div key={product._id} style={{ position: 'relative' }}>
            <ProductItem product={product} />
            <button onClick={() => deleteWishList(product._id)} type="button" style={{ position: "absolute", top: "0px", left: "0px", borderRadius: "5px", border: "none" }}>
                <i className="fas fa-times me-0" style={{ fontSize: "14px" }}></i>
            </button>
        </div>
    ))

    let html
    if (!error) {
        if (wishlist?.length === 0) {
            html = <p>Không có sản phẩm trong danh sách yêu thích ♥.</p>
        } else {
            html = <div className="container-grid">
                {listProductsWishlist}
                {
                    wishlist?.length > resultPerPage &&
                    <Paginate currentPage={currentPage} resultPerPage={resultPerPage} setCurrentPageNo={setCurrentPageNo} arr={wishlist?.length} />
                }
            </div>
        }
    }

    return (
        <>
            <MetaData title="Wishlist" />
            {
                loading ? <Loader /> :
                    <Layout>
                        <div className="wishlist">
                            <Banner color="var(--white-color)" title="wishlist" />

                            <div className="wrapper">

                                {
                                    wishlist?.length === 0 ? "" :
                                        <>
                                            <h5 style={{ textTransform: "uppercase", paddingBottom: "15px", borderBottom: "1px solid var(--secondary-color)", color: "var(--text-color)" }}>WISHLIST</h5>
                                            <div className="text-end my-3">
                                                <Button onClick={() => deleteAllWishList()} width="auto" bg="var(--primary-color)"> Xóa tất cả</Button>
                                            </div>
                                        </>
                                }

                                {html}
                            </div>
                        </div>

                    </Layout>
            }
        </>
    )
}

export default Wishlist
