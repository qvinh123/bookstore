import React, { useEffect } from 'react'

import { useSelector } from "react-redux"
import { cartSelector } from '../../../redux/selectors/cartSelector'
import { userSelector } from '../../../redux/selectors/userSelector'

import { Link, useHistory } from 'react-router-dom'

import { formatPrice } from "../../../utils"

import Layout from '../../../components/layout/Layout'
import MetaData from '../../../components/MetaData/MetaData'
import CheckoutStep from '../../../components/CheckoutStep/CheckoutStep'
import Button from '../../../components/Button/Button'

const CofimOrder = () => {
    const { cartItems } = useSelector(cartSelector)
    const { user } = useSelector(userSelector)

    const history = useHistory()

    const shippingInfo = localStorage.getItem(('shippingInfo')) ? JSON.parse(localStorage.getItem(('shippingInfo'))) : ""

    // Calculate Order Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    const shippingPrice = 30000
    const totalPrice = itemsPrice + shippingPrice

    useEffect(() => {
        if (!shippingInfo) {
            history.goBack()
        }
    }, [shippingInfo, history])

    const processToPayment = () => {
        const data = {
            itemsPrice,
            shippingPrice,
            totalPrice
        }
        history.push({
            pathname: '/payment',
            state: {
                data
            }
        })
    }

    return (
        <>
            <MetaData title={"Xác nhận đơn hàng"} />
            <Layout>
                <div className="wrapper">
                    <CheckoutStep shipping cofirmOrder />

                    <div className="row d-flex justify-content-between mt-4 align-items-center">
                        <div className="col-12 col-lg-8 mt-5 order-confirm">

                            <h3 className="mb-3">Thông tin giao hàng</h3>
                            <p><b>Tên:</b> {user && user.name}</p>
                            <p><b>Điện thoại:</b> {shippingInfo.phone}</p>
                            <p className="mb-4"><b>Địa chỉ:</b> {`${shippingInfo.address}, ${shippingInfo.wards}, ${shippingInfo.district}, ${shippingInfo.province}`}</p>
                            <hr />
                            <h4 className="my-4">Giỏ hàng của bạn</h4>

                            {
                                cartItems?.map(item => (
                                    <div className="cart-item my-1" key={item.product._id}>
                                        <div className="row my-3">
                                            <div className="col-4 col-lg-2">
                                                <img src={item.product.images[0].url} alt={item.product.slugName} height="100%" width="100%" />
                                            </div>

                                            <div className="col-8 col-lg-10">
                                                <div className="row">
                                                    <div className="col-12 col-lg-6">
                                                        <Link id="card_item_title" to={`/products/${item.product.slugName}`}>{item.product.name}</Link>
                                                    </div>
                                                    <div className="col-12 col-lg-3 fw-bold">
                                                        <p>{item.quantity} x {formatPrice(item.product.price)}₫</p>
                                                    </div>

                                                    <div className="col-12 col-lg-3">
                                                        <p><b>{formatPrice(item.quantity * item.product.price)}₫</b></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        <div className="col-12 col-lg-3 my-4">
                            <div id="order_summary" className="shadow-lg p-4">
                                <h4>Tổng tiền</h4>
                                <hr />
                                <p>Thành tiền:  <span className="order-summary-values">{formatPrice(itemsPrice)}₫</span></p>
                                <p>Phí ship: <span className="order-summary-values">{formatPrice(shippingPrice)}₫</span></p>

                                <hr />

                                <p>Tổng cộng: <span className="order-summary-values">{formatPrice(totalPrice)}₫</span></p>

                                <Button type="button" width="100%" onClick={processToPayment}>Tiến hành thanh toán</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default CofimOrder
