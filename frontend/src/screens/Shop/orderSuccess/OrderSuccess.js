import React, { useEffect } from 'react'

import { Link, useHistory, useLocation } from 'react-router-dom'

import MetaData from "../../../components/MetaData/MetaData"
import Layout from "../../../components/layout/Layout"

const OrderSuccess = () => {
    const location = useLocation()
    const history = useHistory()

    const status = location.state ? location.state.status : false

    useEffect(() => {
        if (status === false) {
            history.goBack()
        }
    }, [status, history])

    useEffect(() => {
        localStorage.removeItem(('shippingInfo'))
    }, [])

    return (
        <>
            <MetaData title={'Hoàn tất đơn hàng'} />
            <Layout>

                <div className="row justify-content-center">
                    <div className="col-10 col-lg-6 mt-5 text-center">
                        <img className="my-5 img-fluid d-block mx-auto" src="/images/istockphoto-930403408-170667a.jpg" alt="Order Success"/>

                        <h2>Đơn hàng của bạn đã được đặt thành công</h2>

                        <Link style={{ color: "var(--primary-color)" }} to="/order/me">Đi tới các đơn hàng <i style={{ fontSize: '14px' }} className="fas fa-arrow-right"></i></Link>
                    </div>

                </div>
            </Layout>
        </>
    )
}

export default OrderSuccess
