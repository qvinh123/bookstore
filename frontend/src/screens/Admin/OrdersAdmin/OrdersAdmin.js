import React, { useState, useEffect } from 'react';

import { useAlert } from 'react-alert';

import { Link } from 'react-router-dom';

import MetaData from '../../../components/MetaData/MetaData';
import Paginate from '../../../components/Paginate/Paginate';
import ButtonFilter from '../../../components/ButtonFilter/ButtonFilter';
import LayoutAdmin from '../../../components/layout/LayoutAdmin';
import Loader from '../../../components/Loader/Loader';
import SelectSort from '../../../components/SelectSort/SelectSort';

import * as OrderAPI from "../../../api/orderAPI"

import { formatPrice } from '../../../utils';

import { usePagePagination } from '../../../hooks/usePagePagination';

const listSort = [
    {
        id: 2,
        name: "Giá giảm dần",
        value: "-totalPrice"
    },
    {
        id: 3,
        name: "Giá tăng dần",
        value: "totalPrice"
    },
    {
        id: 4,
        name: "Mới nhất",
        value: "-createdAt"
    },
    {
        id: 5,
        name: "Cũ nhất",
        value: "createdAt"
    }
]

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

const OrdersAdmin = () => {

    const alert = useAlert()

    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState([])

    const [isChange, setIsChange] = useState(false)

    const { currentPage, setCurrentPageNo, setCurrentPage } = usePagePagination()

    const [valueSearch, setValueSearch] = useState("")
    const [sort, setSort] = useState("-createdAt")
    const [orderStatus, setOrderStatus] = useState("")

    useEffect(() => {
        setCurrentPage(0)
    }, [valueSearch, setCurrentPage])

    useEffect(() => {
        if (valueSearch) {
            const fetchOrderSearch = async () => {
                setLoading(true)
                try {
                    const { data } = await OrderAPI.getOrderSearch(currentPage + 1, valueSearch, orderStatus, sort)
                    setOrders(data)
                    setLoading(false)
                } catch (err) {
                    setLoading(false)
                    alert.error(err.response.data.message)
                }
            }
            const timeout = setTimeout(() => {
                fetchOrderSearch()
            }, 500)

            return () => clearTimeout(timeout)
        } else {
            const fetchOrders = async () => {
                setLoading(true)
                try {
                    const { data } = await OrderAPI.getAllOrder(currentPage + 1, orderStatus, sort)
                    setOrders(data)
                    setLoading(false)
                } catch (err) {
                    setLoading(false)
                    alert.error(err.response.data.message)
                }
            }
            fetchOrders()
        }
    }, [alert, valueSearch, currentPage, isChange, sort, orderStatus])

    const deleteOrder = async (id) => {
        setLoading(true)
        try {
            await OrderAPI.deleteOrder(id)
            setLoading(false)
            setIsChange(!isChange)
        } catch (err) {
            setLoading(false)
            alert.error(err.response.data.message)
        }
    }

    const renderOrders = () => {
        return orders?.data?.orders?.map((order) => {
            return (
                <tr className="row" key={order._id}>
                    <td className="col-3 py-4">{order._id}</td>
                    <td className="col-6 py-4">{order.orderItems.map(order => (
                        <div key={order.product} className="row mb-3">
                            <div className="col-4 col-lg-2" >
                                <img src={order.image} alt={order.name} width="70px" />
                            </div>

                            <div className="col-8 col-lg-5">
                                <Link to={`/products/${order.slugName}`}>{order.name}</Link>
                            </div>


                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                <p>{formatPrice(order.price) + "đ"}</p>
                            </div>

                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                <p>{order.quantity} (quyển)</p>
                            </div>
                        </div>
                    ))}</td>
                    <td className="col-1 py-4">{formatPrice(order.totalPrice)}₫</td>
                    <td className="col-1 py-4">
                        {
                            order.orderStatus && String(order.orderStatus).includes('đã giao')
                                ? <p style={{ color: 'var(--success-color)' }}>{order.orderStatus}</p>
                                : <p style={{ color: 'var(--primary-color)' }}>{order.orderStatus}</p>
                        }
                    </td>
                    <td className="col-1 py-4">
                        <Link to={`/admin/orders/${order._id}`} className="py-1 px-2">
                            <i className="fa fa-edit me-0" style={{ fontSize: "16px" }}></i>
                        </Link>
                        <button className="btn py-1 px-2" onClick={() => { deleteOrder(order._id) }}>
                            <i className="fa fa-trash me-0" style={{ fontSize: "16px" }}></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    return (
        <>
            <MetaData title="Tất cả đơn hàng - Admin" />
            {
                loading ? <Loader /> :
                    <LayoutAdmin>
                        <h1 className="my-4">Tất cả đơn hàng ({orders.ordersCount})</h1>
                        <div className="d-flex justify-content-between">
                            <div className='inputAdmin-search'>
                                <input
                                    onChange={(e) => setValueSearch(e.target.value)}
                                    placeholder='Tìm kiếm mã đơn hàng...'
                                    value={valueSearch}
                                    spellCheck={false}
                                />
                                <span className='input-highlight'>
                                    {valueSearch.replace(/ /g, "\u00a0")}
                                </span>
                            </div>

                            <div className="col-md-6 col-12 text-lg-end">
                                <SelectSort value={sort} sorts={listSort} handle={(e) => {
                                    setSort(e.target.value)
                                    setCurrentPage(0)
                                }} 
                                />
                            </div>
                        </div>
                        <div className="order-filter py-3">
                            {
                                arrayFilter.map((itemFilter, i) => (
                                    <ButtonFilter
                                        handleClick={() => {
                                            setOrderStatus(itemFilter.value)
                                            setCurrentPage(0)
                                        }}
                                        filterValue={orderStatus}
                                        itemFilter={itemFilter.value}
                                        key={i}
                                    >
                                        {itemFilter.label}
                                    </ButtonFilter>
                                ))
                            }
                        </div>
                        <div className="table_admin">
                            {
                                orders?.data?.orders?.length === 0 ?
                                    <div className="text-center">
                                        <img width="100px" height="100px" src="/images/5fafbb923393b712b96488590b8f781f.png" alt="order-empty" />
                                        <p>Chưa có đơn hàng</p>
                                    </div> :
                                    <>
                                        <table className="table table-striped table-hover">
                                            <thead>
                                                <tr className="row">
                                                    <th className="col-3">ID</th>
                                                    <th className="col-6">Sản phẩm</th>
                                                    <th className="col-1">Giá</th>
                                                    <th className="col-1">Trạng thái</th>
                                                    <th className="col-1"></th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {renderOrders()}
                                            </tbody>
                                        </table>

                                        {orders.ordersCount > orders.resultPerPage && <Paginate resultPerPage={orders.resultPerPage} currentPage={currentPage} arr={orders.ordersCount} setCurrentPageNo={setCurrentPageNo} />}
                                    </>
                            }
                        </div>
                    </LayoutAdmin>
            }
        </>
    )
};

export default OrdersAdmin;
