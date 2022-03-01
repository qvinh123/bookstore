import React, { useEffect, useState } from 'react';

import { Link, useParams } from 'react-router-dom';

import { useAlert } from 'react-alert';

import MetaData from '../../../components/MetaData/MetaData';
import LayoutAdmin from '../../../components/layout/LayoutAdmin';
import Loader from '../../../components/Loader/Loader';
import Button from '../../../components/Button/Button';

import * as OrderAPI from "../../../api/orderAPI"

import { formatPrice } from '../../../utils';

const arr = [
    {
        id: 1,
        label: "Đang xử lí",
        value: "đang xử lí"
    },
    {
        id: 2,
        label: "Đang giao",
        value: "đang giao"
    },
    {
        id: 3,
        label: "Đã giao",
        value: "đã giao"
    },
]

const OrderAdminDetails = () => {
    const { id } = useParams()
    const alert = useAlert()

    const [orderDetails, setOrderDetails] = useState({})
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState("")

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const { data } = await OrderAPI.getOrderDetails(id)

                setLoading(false)
                setOrderDetails(data.order)
            } catch (err) {
                setLoading(false)
                alert.error(err.response.data.message)
            }
        }
        fetchOrderDetails()

    }, [id, alert])

    const updatestatus = async () => {
        try {
            await OrderAPI.updateOrder(id, { orderStatus: status })
            alert.success("Cập nhật thành công")
        } catch (err) {
            alert.error(err.response.data.message)
        }
    }


    const { shippingInfo, orderItems, paymentInfo, user, totalPrice } = orderDetails

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.wards}, ${shippingInfo.district}, ${shippingInfo.province}`

    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false

    return (
        <>
            <MetaData title="Chi tiết đơn hàng - Admin" />
            {
                loading ? <Loader /> :
                    <LayoutAdmin>
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
                                    <p style={{ color: `${orderDetails.orderStatus && String(orderDetails.orderStatus).includes('đã giao') ? "var(--success-color)" : "var(--primary-color)"}`, textTransform: "uppercase" }} ><b>{orderDetails.orderStatus}</b></p>

                                    {
                                        orderDetails.orderStatus === "đã giao" ? "" :
                                            <div className="form-group d-flex align-items-baseline">
                                                <select
                                                    className="form-select me-4"
                                                    name='status'
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                    style={{ width: "auto" }}
                                                >
                                                    <option>Thay đổi trạng thái</option>
                                                    {
                                                        arr.filter(item => item.value !== orderDetails.orderStatus).map(item => (
                                                            <option key={item.value} value={item.value}>{item.label}</option>
                                                        ))
                                                    }
                                                </select>

                                                <Button onClick={updatestatus}>Cập nhật</Button>
                                            </div>
                                    }
                                    <h4 className="my-4">Chi tiết đơn hàng</h4>

                                    <hr />
                                    <div className="cart-item my-1">
                                        {
                                            orderItems && orderItems.map(item => (
                                                <div key={item.product} className="row my-5 align-items-center">
                                                    <div className="col-4 col-lg-2" >
                                                        <img src={item.image} alt={item.name} width="100%" />
                                                    </div>

                                                    <div className="col-8 col-lg-5">
                                                        <Link to={`/products/${item.slugName}`}>{item.name}</Link>
                                                    </div>


                                                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                        <p>{formatPrice(item.price) + "đ"}</p>
                                                    </div>

                                                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                        <p>{item.quantity} (quyển)</p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <hr />
                                </div>
                            </div>
                        </div>
                    </LayoutAdmin>
            }
        </>
    )
};

export default OrderAdminDetails;
