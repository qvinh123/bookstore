import React, { useEffect, useState } from 'react'

import { useAlert } from 'react-alert'

import { Link, useParams } from 'react-router-dom'

import * as OrderAPI from "../../../api/orderAPI"

import { formatPrice } from '../../../utils'

import Loader from '../../../components/Loader/Loader'
import MetaData from '../../../components/MetaData/MetaData'
import Layout from '../../../components/layout/Layout'

const OrderDetails = () => {
    const { id } = useParams()

    const [loading, setLoading] = useState(false)
    const [orderDetails, setOrderDetails] = useState({})

    const alert = useAlert()

    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = orderDetails

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.wards}, ${shippingInfo.district}, ${shippingInfo.province}`

    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false

    useEffect(() => {
        const fetchOrderDetails = async () => {
            setLoading(true)
            try {
                const { data } = await OrderAPI.getOrderDetails(id)

                setOrderDetails(data.order)
                setLoading(false)
            } catch (err) {
                setLoading(false)
                alert.error(err.response.data.message)
            }
        }
        fetchOrderDetails()

    }, [id, alert])

    return (
        <>
            <MetaData title="Chi tiết đơn hàng" />
            {loading ? <Loader /> :
                <Layout>
                    <div className="wrapper">
                        <div className="row d-flex justify-content-between">
                            <div className="col-12 col-lg-8 order-details">
                                <h4 className="mb-4">Thông tin đơn hàng</h4>
                                <p><b>ID:</b> {orderDetails._id}</p>
                                <p><b>Tên:</b> {user && user.name}</p>
                                <p><b>Điện thoại:</b> {shippingInfo && shippingInfo.phone}</p>
                                <p className="mb-4"><b>Địa chỉ:</b> {shippingDetails}</p>
                                <p><b>Tổng tiền:</b> {formatPrice(totalPrice) + "đ"}</p>

                                <hr />

                                <h4 className="my-4">Thanh toán</h4>
                                <p style={{ color: `${isPaid ? "var(--success-color)" : "var(--primary-color)"}`, textTransform: "uppercase" }}><b>{isPaid ? "đã thanh toán" : "chưa thanh toán"}</b></p>


                                <h4 className="my-4">Trạng thái đơn hàng</h4>
                                <p style={{ color: `${orderDetails.orderStatus && String(orderDetails.orderStatus).includes('đã giao') ? "var(--success-color)" : "var(--primary-color)"}`, textTransform: "uppercase" }} ><b>{orderStatus}</b></p>


                                <h4 className="my-4">Chi tiết đơn hàng</h4>

                                <hr />
                                <div className="cart-item my-1">
                                    {
                                        orderItems && orderItems.map(item => (
                                            <div key={item.product} className="row my-5 align-items-center">
                                                <div className="col-4 col-lg-2" >
                                                    <img src={item.image} alt={item.name} width="100%" />
                                                </div>

                                                <div className="col-8 col-lg-10">
                                                    <div className="row">
                                                        <div className="col-lg-6 col-12">
                                                            <Link className="hoverRed" to={`/products/${item.slugName}`}>{item.name}</Link>
                                                        </div>

                                                        <div className="col-12 col-lg-3">
                                                            <p>{item.quantity} (quyển)</p>
                                                        </div>

                                                        <div className="col-12 col-lg-3">
                                                            <p>{formatPrice(item.price) + "đ"}</p>
                                                        </div>

                                                     
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            }
        </>
    )
}

export default OrderDetails
