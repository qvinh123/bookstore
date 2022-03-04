import React, { useEffect, useState } from 'react'

import MetaData from '../../../components/MetaData/MetaData'
import Loader from '../../../components/Loader/Loader'
import LayoutAdmin from '../../../components/layout/LayoutAdmin'

import * as OrderAPI from "../../../api/orderAPI"
import * as AuthAPI from "../../../api/authAPI"
import * as ProductAPI from "../../../api/productAPI"

import { Link } from "react-router-dom"

import { useSelector } from 'react-redux'
import { userSelector } from '../../../redux/selectors/userSelector'

import { useAlert } from 'react-alert'

import { formatPrice } from '../../../utils'

const DashboardAdmin = () => {
    const { user } = useSelector(userSelector)

    const alert = useAlert()

    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState()
    const [users, setUsers] = useState()
    const [orders, setOrders] = useState()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            return Promise.all([ProductAPI.getAllProducts(), OrderAPI.getAllOrder(), AuthAPI.getAllUser()])
                .then(values => {
                    setProducts(values[0].data)
                    setOrders(values[1].data)
                    setUsers(values[2].data)
                    setLoading(false)
                }).catch(err => {
                    setLoading(false)
                    alert.error(err.response.data.message)
                })
        }

        if (user) {
            fetchData()
        }

    }, [user, alert])


    return (
        <>
            <MetaData title={'Admin Dashboard'} />
            {
                loading ? <Loader /> :
                    <LayoutAdmin>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h1 className="my-4">Dashboard</h1>
                            <div className="card text-white bg-warning py-2 px-4">
                                <span className="text-center card-font-size">Tổng doanh thu<br /> <b>{orders && formatPrice(orders?.amountPrice)}₫</b>
                                </span>
                            </div>
                        </div>

                        <div className="row pr-4">
                            <div className="col-md-4 col-12 mb-3">
                                <div className="card text-white bg-success h-100">
                                    <div className="card-body">
                                        <span className="text-center card-font-size">Products<br /> <b>{products && products.productsCount}</b></span>
                                    </div>
                                    <Link className="card-footer text-white d-flex align-items-center justify-content-between" to="/admin/products">
                                        <span>View Details</span>
                                        <span >
                                            <i className="fa fa-angle-right"></i>
                                        </span>
                                    </Link>
                                </div>
                            </div>


                            <div className="col-12 col-md-4 mb-3">
                                <div className="card text-white bg-danger h-100">
                                    <div className="card-body">
                                        <span className="text-center card-font-size">Orders<br /> <b>{orders && orders.data.orders.length}</b></span>
                                    </div>
                                    <Link className="card-footer text-white d-flex align-items-center justify-content-between" to="/admin/orders">
                                        <span className="float-left">View Details</span>
                                        <span className="float-right">
                                            <i className="fa fa-angle-right"></i>
                                        </span>
                                    </Link>
                                </div>
                            </div>


                            <div className="col-md-4 col-12 mb-3">
                                <div className="card text-white bg-info h-100">
                                    <div className="card-body">
                                        <span className="text-center card-font-size">Users<br /> <b>{users && users.data.users.length}</b></span>
                                    </div>
                                    <Link className="card-footer text-white d-flex align-items-center justify-content-between" to="/admin/users">
                                        <span className="float-left">View Details</span>
                                        <span className="float-right">
                                            <i className="fa fa-angle-right"></i>
                                        </span>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </LayoutAdmin>
            }
        </>
    )
}

export default DashboardAdmin
