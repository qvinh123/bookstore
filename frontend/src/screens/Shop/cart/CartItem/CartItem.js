import React, { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'

import { Link } from 'react-router-dom'

import { formatPrice } from '../../../../utils'

import Quantity from '../../../../components/Quantity/Quantity'

import * as CartAPI from "../../../../api/cartAPI"

import { addCartAction } from '../../../../redux/actions/cartAction'

const CartItem = ({ cart, cartItems }) => {
    const dispatch = useDispatch()
    const [flag, setFlag] = useState(false)

    const decreaseQty = () => {
        if (cart.quantity <= 1) return
        cartItems.forEach(i => {
            if (i.product._id === cart.product._id) {
                cart.quantity -= 1
            }
        })
        dispatch(addCartAction([...cartItems]))
        setFlag(true)
    }

    const increaseQty = () => {
        if (cart.quantity >= cart.product.stock) return
        cartItems.forEach(i => {
            if (i.product._id === cart.product._id) {
                cart.quantity += 1
            }
        })
        dispatch(addCartAction([...cartItems]))
        setFlag(true)
    }


    const removeCartItemHandler = async (cartItems, productId) => {
        cartItems.forEach((cart, i) => {
            if (cart.product._id === productId) {
                cartItems.splice(i, 1)
            }
        })
        dispatch(addCartAction([...cartItems]))
        await CartAPI.deleteCart(productId)
    }

    useEffect(() => {
        const timeId = setTimeout(async () => {
            if (flag) {
                await CartAPI.addCart({ product: cart.product._id, quantity: cart.quantity })
            }
        }, 500)

        return () => {
            clearTimeout(timeId)
        }
    }, [dispatch, cart.product._id, cart.quantity, flag])

    return (
        <tr key={cart.product._id} className="row align-items-lg-center mt-3 px-0 px-lg-2">
            <td className="col-4 col-md-2 col-lg-2">
                <img className="w-100" src={cart.product?.images[0]?.url} alt={cart.product.name} />
            </td>
            <td className="col-8 col-md-10 col-lg-10">
                <div className="row align-items-lg-center">
                    <div className="col-12 col-lg-4 order-lg-0 order-0 mb-3 mb-lg-0">
                        <Link
                            style={{ fontWeight: "500", color: "var(--text-color)", transition: ".3s all" }}
                            className="hoverRed"
                            to={`/products/${cart.product.slugName}`}>
                            {cart.product.name}
                        </Link>
                    </div>

                    <div className="col-9 col-lg-2 order-lg-1 order-2 mb-3 mb-lg-0">
                        <p style={{ fontSize: "1rem", fontWeight: "600" }} className="mb-0">{formatPrice(cart.product.price)}₫</p>
                    </div>

                    <div className="col-12 col-lg-3 order-lg-2 order-1 mb-3 mb-lg-0">
                        <Quantity qty={cart.quantity} decreaseQty={decreaseQty} increaseQty={increaseQty} />
                    </div>

                    <div className="d-none d-lg-block col-lg-2 order-lg-3 order-3">
                        <p style={{ fontSize: "1rem", fontWeight: "600" }} className="mb-0"> {
                            formatPrice(cart.quantity * cart.product.price)
                        }₫</p>
                    </div>

                    <div className="col-3 col-lg-1 order-lg-4 order-4 mb-3 mb-lg-0 text-end">
                        <i style={{ cursor: "pointer", fontSize: "1.2rem", fontWeight: "400" }} onClick={() => removeCartItemHandler(cartItems, cart.product._id)} className="far fa-trash-alt"></i>
                    </div>
                </div>

            </td>
        </tr>
    )
}

export default CartItem
