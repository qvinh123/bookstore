import React, { useEffect, useState } from 'react'

import { useAlert } from 'react-alert'

import { useHistory, useLocation } from 'react-router-dom'

import MetaData from '../../../components/MetaData/MetaData'
import Layout from '../../../components/layout/Layout'
import CheckoutStep from '../../../components/CheckoutStep/CheckoutStep'
import Button from '../../../components/Button/Button'

import * as PaymentAPI from "../../../api/paymentAPI"
import * as OrderAPI from "../../../api/orderAPI"
import * as CartAPI from "../../../api/cartAPI"

import { formatPrice } from "../../../utils"

import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'

import { useDispatch, useSelector } from 'react-redux'
import { cartSelector } from '../../../redux/selectors/cartSelector'
import { clearCartAction } from '../../../redux/actions/cartAction'
import { userSelector } from '../../../redux/selectors/userSelector'

const options = {
    style: {
        base: {
            fontSize: '16px'
        },
        invalid: {
            color: 'red'
        }
    }
}

const Payment = () => {

    const { user } = useSelector(userSelector)
    const { cartItems } = useSelector(cartSelector)
    const shippingInfo = localStorage.getItem(('shippingInfo')) ? JSON.parse(localStorage.getItem(('shippingInfo'))) : ""

    const location = useLocation()
    const alert = useAlert();
    const history = useHistory()
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)

    const order = {
        orderItems: cartItems.map(cart => {
            return {
                name: cart.product.name,
                slugName: cart.product.slugName,
                quantity: cart.quantity,
                image: cart.product.images[0].url,
                price: cart.product.price,
                priceOriginal: cart.product.priceOriginal,
                product: cart.product._id
            }
        }),
        shippingInfo
    }

    const orderInfo = location.state ? location.state.data : ""
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.totalPrice = orderInfo.totalPrice
    }

    const paymentData = {
        amount: orderInfo?.totalPrice
    }

    useEffect(() => {
        if (!shippingInfo || !orderInfo) {
            history.goBack()
        }
    }, [history, shippingInfo, orderInfo])

    useEffect(() => {
        setLoading("")
    }, [])

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await PaymentAPI.processPayment(paymentData)

            const clientSecret = res.data.client_secret;

            if (!stripe || !elements) {
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email
                    }
                }
            });

            if (result.error) {
                setLoading(false)
                alert.error(result.error.message);
            } else {

                // The payment is processed or not
                if (result.paymentIntent.status === 'succeeded') {

                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    }

                    const fetchAPI = async () => {
                        try {
                            await OrderAPI.newOrder(order)
                            await CartAPI.deleteAllCart()
                            dispatch(clearCartAction())

                        } catch (err) {
                            alert.error(err.response.data.message)
                        }
                    }
                    await fetchAPI()
                    setLoading(false)
                    history.push({ pathname: '/orderSuccess', state: { status: true } })

                } else {
                    setLoading(false)
                    alert.error('Có một số vấn đề trong khi xử lý thanh toán. Vui lòng thử lại')
                }
            }

        } catch (error) {
            setLoading(false)
            alert.error(error.message)
        }
    }

    return (
        <>
            <MetaData title={"Thanh toán"} />
            <Layout>
                <div className="wrapper">
                    <CheckoutStep shipping cofirmOrder payment />

                    <div className="row justify-content-center mt-4">
                        <div className="col-12 col-lg-5">
                            <form className="shadow-lg p-lg-5 p-3" onSubmit={submitHandler}>
                                <h1 className="mb-4">Thông tin thẻ</h1>
                                <div className="form-group">
                                    <label htmlFor="card_num_field">Số thẻ</label>
                                    <CardNumberElement
                                        type="text"
                                        id="card_num_field"
                                        className="form-control"
                                        options={options}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="card_exp_field">Thời hạn thẻ</label>
                                    <CardExpiryElement
                                        type="text"
                                        id="card_exp_field"
                                        className="form-control"
                                        options={options}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="card_cvc_field">Thẻ CVC</label>
                                    <CardCvcElement
                                        type="text"
                                        id="card_cvc_field"
                                        className="form-control"
                                        options={options}
                                    />
                                </div>


                                <Button
                                    id="pay_btn"
                                    type="submit"
                                    width="100%"
                                    loading={loading}
                                    disabled={loading}
                                >
                                    Thanh toán {` - ${formatPrice(orderInfo && orderInfo.totalPrice)}₫`}
                                </Button>

                            </form>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Payment
