import React, { useState, useEffect } from 'react'

import * as OrderAPI from "../../../api/orderAPI"
import * as CartAPI from "../../../api/cartAPI"

import { useAlert } from 'react-alert';

import { Link, useHistory } from 'react-router-dom';

import { formatPrice } from "../../../utils"

import { usePagePagination } from "../../../hooks/usePagePagination"

import Paginate from "../../../components/Paginate/Paginate"
import Loader from '../../../components/Loader/Loader';
import Button from "../../../components/Button/Button"
import ButtonFilter from "../../../components/ButtonFilter/ButtonFilter"
import MetaData from '../../../components/MetaData/MetaData';
import Layout from '../../../components/layout/Layout';

import { useSelector, useDispatch } from 'react-redux';
import { cartSelector } from '../../../redux/selectors/cartSelector';
import { addCartAction } from '../../../redux/actions/cartAction';


const arrayFilter = [
    {
        id: 1,
        label: "tất cả",
        value: ""
    },
    {
        id: 2,
        label: "đang xử lí",
        value: "đang xử lí"
    },
    {
        id: 3,
        label: "đang giao",
        value: "đang giao"
    },
    {
        id: 4,
        label: "đã giao",
        value: "đã giao"
    }
]

const ListOrders = () => {
    const { cartItems } = useSelector(cartSelector)

    const history = useHistory()
    const dispatch = useDispatch()
    const alert = useAlert()

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)

    const [filterOrder, setFilterOrder] = useState("")

    const { currentPage, setCurrentPageNo, setCurrentPage } = usePagePagination()

    useEffect(() => {
        setCurrentPage(0)
    }, [setCurrentPage, filterOrder])

    useEffect(() => {
        const fetchMyOrders = async () => {
            setLoading(true)
            try {
                const { data } = await OrderAPI.myOrder(currentPage + 1, filterOrder)
                setOrders(data)
                setLoading(false)
            } catch (err) {
                setLoading(false)
                alert.error(err.response.data.message)
            }
        }
        fetchMyOrders()
    }, [alert, filterOrder, currentPage])

    const addToCart = async (orders) => {
        const order = orders.map(x => {
            return {
                _id: x.product,
                slugName: x.slugName,
                name: x.name,
                images: [{ url: x.image }],
                price: x.price,
                quantity: x.quantity
            }
        })

        const not_intersection = order.filter((el) => !cartItems.find(x => el._id === x.product._id))

        const intersection = order.filter((el) => cartItems.find(x => el._id === x.product._id))

        if (cartItems.length > 0) {
            if (intersection.length > 0) {
                cartItems.forEach(element => {
                    intersection.forEach(x => {
                        if (element.product._id === x._id) {
                            element.quantity = x.quantity
                        }
                    })
                })
                const arr = not_intersection.map(x => { return { product: x, quantity: x.quantity } })
                dispatch(addCartAction([...cartItems, ...arr]))
                await CartAPI.addCart({ product: orders })
            } else {
                const arr = order.map(x => { return { product: x, quantity: x.quantity } })
                dispatch(addCartAction([...arr, ...cartItems]))
                await CartAPI.addCart({ product: orders })
            }
        } else {
            const arr = order.map(x => { return { product: x, quantity: x.quantity } })
            dispatch(addCartAction([...arr, ...cartItems]))
            await CartAPI.addCart({ product: orders })
        }
    }

    const renderListOrders = () => orders?.data?.orders?.map(order => {
        return (
            <div key={order._id} className="row align-items-lg-center mb-5">
                <div className="col-lg-10 col-12 p-4" style={{ backgroundColor: "var(--review-color)", border: "1px solid var(--border-review)" }}>
                    <div className="order-status text-end">
                        <svg style={{
                            margin: "0 5px 0 0",
                            verticalAlign: "middle",
                            fontSize: "1rem",
                            stroke: `${order.orderStatus === "đang giao" || order.orderStatus === "đang xử lí" ? "var(--primary-color)" : "var(--success-color)"}`,
                            width: "1rem",
                            height: "1rem"
                        }} enableBackground="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0"><g><line fill="none" strokeLinejoin="round" strokeMiterlimit="10" x1="8.6" x2="4.2" y1="9.8" y2="9.8"></line><circle cx="3" cy="11.2" fill="none" r="2" strokeMiterlimit="10"></circle><circle cx="10" cy="11.2" fill="none" r="2" strokeMiterlimit="10"></circle><line fill="none" strokeMiterlimit="10" x1="10.5" x2="14.4" y1="7.3" y2="7.3"></line><polyline fill="none" points="1.5 9.8 .5 9.8 .5 1.8 10 1.8 10 9.1" strokeLinejoin="round" strokeMiterlimit="10"></polyline><polyline fill="none" points="9.9 3.8 14 3.8 14.5 10.2 11.9 10.2" strokeLinejoin="round" strokeMiterlimit="10"></polyline></g>
                        </svg>
                        <span style={{ color: `${order.orderStatus === "đang giao" || order.orderStatus === "đang xử lí" ? "var(--primary-color)" : "var(--success-color)"}`, textTransform: "uppercase" }}>
                            {order.orderStatus}
                        </span>
                    </div>
                    <div className="mb-3 text-end">
                        <p style={{ fontSize: "12px" }} className="mb-0">Đơn hàng đặt vào lúc:</p>
                        <p style={{ fontSize: "12px" }} className="mb-0">{new Date(order.createdAt).toLocaleDateString()} - {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {new Date(order.createdAt).getTime() > 12 ? "PM" : "AM"}
                        </p>
                    </div>
                    {
                        order.orderItems.map(product => (
                            <div className="row pb-3" key={product._id}>
                                <div className="col-4 col-md-2">
                                    <img className="w-100" src={product.image} alt={product.slugName} />
                                </div>
                                <div className="col-8 col-md-10 py-3">
                                    <div className="row align-items-lg-center">
                                        <div className="order-top">
                                            <div className="order_name">
                                                <Link id="card_item_title" to={`/products/${product.slugName}`}>{product.name}</Link>
                                            </div>

                                            <p className="order_quantity">
                                                x{product.quantity}
                                            </p>

                                            <div className="order-price text-end">
                                                <p style={{ color: "var(--primary-color)", fontWeight: "500" }}>
                                                    <span style={{ color: "var(--secondary-color)", textDecoration: "line-through" }} className="me-2">
                                                        {formatPrice(product.priceOriginal)}₫
                                                    </span>
                                                    {formatPrice(product.price)}₫
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                    <div className="order-middle py-3" style={{ borderTop: "1px solid var(--secondary-color)" }}>
                        <p className="order_sum_price text-end mb-0">
                            <svg className="me-1" width="16" height="17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M15.94 1.664s.492 5.81-1.35 9.548c0 0-.786 1.42-1.948 2.322 0 0-1.644 1.256-4.642 2.561V0s2.892 1.813 7.94 1.664zm-15.88 0C5.107 1.813 8 0 8 0v16.095c-2.998-1.305-4.642-2.56-4.642-2.56-1.162-.903-1.947-2.323-1.947-2.323C-.432 7.474.059 1.664.059 1.664z" fill="var(--primary-color)"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.073 6.905s-1.09-.414-.735-1.293c0 0 .255-.633 1.06-.348l4.84 2.55c.374-2.013.286-4.009.286-4.009-3.514.093-5.527-1.21-5.527-1.21s-2.01 1.306-5.521 1.213c0 0-.06 1.352.127 2.955l5.023 2.59s1.09.42.693 1.213c0 0-.285.572-1.09.28L2.928 8.593c.126.502.285.99.488 1.43 0 0 .456.922 1.233 1.56 0 0 1.264 1.126 3.348 1.941 2.087-.813 3.352-1.963 3.352-1.963.785-.66 1.235-1.556 1.235-1.556a6.99 6.99 0 00.252-.632L8.073 6.905z" fill="#FEFEFE"></path><defs></defs></svg>
                            Tổng số tiền:
                            <span style={{ fontSize: "24px", color: "var(--primary-color)" }}>
                                {
                                    formatPrice(order.totalPrice)
                                }₫
                            </span>
                        </p>
                    </div>

                    <div className="order_button text-end">
                        {
                            order.orderStatus === "đã giao" &&
                            <Button onClick={async () => {
                                await addToCart(order.orderItems)
                                history.push("/cart")
                            }} mr="8px">
                                Mua Lại
                            </Button>
                        }
                        <Button to={`/orders/${order._id}`} bg={`${order.orderStatus === "đã giao" ? 'var(--white-color)' : "var(--primary-color)"}`} color={`${order.orderStatus === "đã giao" ? 'var(--text-color)' : "var(--white-color)"}`} border="1px solid var(--secondary-color)">
                            Chi tiết đơn hàng
                        </Button>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <>
            <MetaData title="Đơn hàng của bạn" />
            {
                loading ? <Loader /> :
                    <Layout>
                        <div className="wrapper">

                            <h3>
                                Đơn hàng của bạn
                            </h3>
                            <div className="order-filter py-3">
                                {
                                    arrayFilter.map((itemFilter, i) => (
                                        <ButtonFilter
                                            handleClick={() => setFilterOrder(itemFilter.value)}
                                            filterValue={filterOrder}
                                            itemFilter={itemFilter.value}
                                            key={i}
                                        >
                                            {itemFilter.label}
                                        </ButtonFilter>
                                    ))
                                }
                            </div>

                            {
                                orders?.data?.orders?.length > 0 ?
                                    renderListOrders() :
                                    <div className="text-center">
                                        <img width="100px" height="100px" src="/images/5fafbb923393b712b96488590b8f781f.png" alt="order-empty" />
                                        <p>Chưa có đơn hàng</p>
                                    </div>
                            }
                            {
                                orders.ordersCount > orders.resultPerPage && <Paginate resultPerPage={orders.resultPerPage} currentPage={currentPage} arr={orders.ordersCount} setCurrentPageNo={setCurrentPageNo} />
                            }
                        </div>
                    </Layout>
            }
        </>
    )
}

export default ListOrders
