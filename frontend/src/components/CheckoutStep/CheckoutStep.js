import React from 'react'
import { Link } from 'react-router-dom'

const CheckoutStep = ({ shipping, cofirmOrder, payment }) => {
    return (
        <ul className="progressbar">
            {
                shipping ?
                    <Link to="/shipping">
                        {
                            cofirmOrder ?
                                <li className="step-complete"><i className="fas fa-check"></i></li> :
                                <li className="step-active">Thông tin đơn hàng</li>
                        }
                    </Link> :
                    <Link to="#!">
                        <li>Thông tin đơn hàng</li>
                    </Link>
            }

            {
                cofirmOrder ?
                    <Link to="/cofirmOrder">
                        {
                            payment ?
                                <li className="step-complete"><i className="fas fa-check"></i></li> :
                                <li className="step-active">Xác nhận đơn hàng</li>
                        }
                    </Link> :
                    <Link to="#!">
                        <li>Xác nhận đơn hàng</li>
                    </Link>
            }

            {
                payment ?
                    <Link to="/payment">
                        <li className="step-active">Thanh toán</li>
                    </Link> :
                    <Link to="#!">
                        <li>Thanh toán</li>
                    </Link>
            }


        </ul>
    )
}

export default CheckoutStep
