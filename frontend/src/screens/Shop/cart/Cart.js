import React, { useEffect } from 'react'

import { useAlert } from 'react-alert'

import { useSelector } from 'react-redux'
import { cartSelector } from "../../../redux/selectors/cartSelector"

import { Link } from 'react-router-dom'

import { formatPrice } from "../../../utils"

import Loader from "../../../components/Loader/Loader"
import MetaData from '../../../components/MetaData/MetaData'
import Layout from '../../../components/layout/Layout'
import ListCart from '../../../components/ListCart/ListCart'

const Cart = () => {
    const { cartItems, loading, error } = useSelector(cartSelector)

    const alert = useAlert()

    useEffect(() => {
        if (error) {
            alert.error(error)
        }
    }, [error, alert])

    let html = <Loader />

    if (!loading) {
        html = <>
            <MetaData title="Giỏ hàng của bạn" />
            <Layout>
                <div className="wrapper">
                    {
                        cartItems?.length === 0 ?

                            <h2 className="mt-4">Giỏ hàng trống</h2> :

                            <div className="row d-flex justify-content-between mt-3">
                                <div className="col-12 col-lg-8">
                                    <h4 style={{ textTransform: "uppercase" }} className="mt-2">Giỏ hàng: {cartItems?.length} sản phẩm</h4>
                                    <ListCart cartItems={cartItems}/>
                                </div>

                                <div className="col-12 col-lg-3 my-4">
                                    <div id="order_summary" className="shadow-lg p-3">
                                        <h4>Tổng đơn hàng</h4>
                                        <hr style={{ backgroundColor: "var(--text-color)" }} />
                                        <p>Tổng số lượng:  <span className="order-summary-values">
                                            {cartItems?.reduce((acc, cur) => (
                                                acc + cur.quantity
                                            ), 0)}</span></p>
                                        <p>Tổng giá tiền: <span className="order-summary-values">{
                                            formatPrice(cartItems?.reduce((acc, cur) => (
                                                acc + (cur.quantity * cur.product.price)
                                            ), 0))
                                        }₫</span></p>
                                        <Link to="/shipping" id="checkout_btn" className="btn btn-primary w-100">Thanh toán</Link>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </Layout>
        </>
    }

    return (
        <>
            {html}
        </>
    )
}

export default Cart
