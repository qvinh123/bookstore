import React, { Fragment, useState } from 'react'

import { Link, useHistory } from 'react-router-dom'

import { useAlert } from "react-alert"

import { formatPrice } from '../../../utils'

import ProductDetailsWishlist from './ProductDetailsWishlist'

import Button from '../../../components/Button/Button'
import Quantity from '../../../components/Quantity/Quantity'
import Ratings from '../../../components/Ratings/Ratings'
import Modal from '../../../components/Modal/Modal'
import ListCart from '../../../components/ListCart/ListCart'

import * as CartAPI from "../../../api/cartAPI"

import { useDispatch, useSelector } from 'react-redux'
import { addCartAction } from '../../../redux/actions/cartAction'
import { cartSelector } from '../../../redux/selectors/cartSelector'
import { userSelector } from '../../../redux/selectors/userSelector'

const ProductDetailsContent = ({ productDetails }) => {
    const { user } = useSelector(userSelector)
    const { cartItems } = useSelector(cartSelector)

    const dispatch = useDispatch()
    const history = useHistory()
    const alert = useAlert()

    const [qty, setQty] = useState(1)
    const [modalAddToCart, setModalAddToCart] = useState()

    const decreaseQtyDetail = () => {
        if (qty <= 1) return
        setQty(qty => qty - 1)
    }

    const increaseQtyDetail = () => {
        if (qty >= productDetails?.stock) return
        setQty(qty => qty + 1)
    }

    const addToCartHandler = async (dataCart) => {
        try {
            await CartAPI.addCart(dataCart)
        } catch (err) {
            alert.error(err.response.data.message)
        }
    }

    const addToCart = async () => {
        if (user) {
            if (cartItems?.length > 0) {
                const itemExist = cartItems?.find(item => item.product._id === productDetails?._id)

                if (itemExist) {
                    cartItems?.forEach(async (item) => {
                        if (item.product._id === productDetails?._id) {
                            if (item.quantity !== qty) {
                                item.quantity = qty
                                dispatch(addCartAction([...cartItems]))

                                await addToCartHandler({ product: productDetails._id, quantity: qty })
                                setModalAddToCart(true)
                            } else {
                                setModalAddToCart(true)
                            }
                        }
                    })
                } else {
                    dispatch(addCartAction([{ product: productDetails, quantity: qty }, ...cartItems]))

                    await addToCartHandler({ product: productDetails._id, quantity: qty })
                    setModalAddToCart(true)
                }
            } else {
                dispatch(addCartAction([{ product: productDetails, quantity: qty }]))
                await addToCartHandler({ product: productDetails._id, quantity: qty })
                setModalAddToCart(true)
            }
        } else {
            history.push("/account/login")
        }
    }

    return (
        <>
            {
                modalAddToCart && cartItems?.length > 0 && <Modal width="60%" to="/shipping" onConfirm={() => setModalAddToCart(false)} title="Ti???n h??nh thanh to??n">
                    <h4 style={{ textTransform: "uppercase" }}>Gi??? h??ng c???a b???n (??ang c?? {cartItems?.length} s???n ph???m)</h4>
                    <hr />
                    <ListCart cartItems={cartItems} />
                </Modal>
            }

            {
                modalAddToCart && cartItems?.length === 0 && <Modal width="60%" onConfirm={() => setModalAddToCart(false)} title="Ti???p t???c mua h??ng">
                    <h4>Gi??? h??ng c???a b???n (??ang c?? {cartItems?.length} s???n ph???m)</h4>
                    <hr />
                    <p>Gi??? h??ng tr???ng</p>
                </Modal>
            }

            <div className="details-content">
                <div className="details-content-head">
                    <h5>{productDetails.name}</h5>
                    <ProductDetailsWishlist productDetails={productDetails} />

                    <div className="d-flex mt-2">
                        <Ratings value={productDetails.rating} color="#fdcc0d" fontSize="12px" />
                        <span>{productDetails.numOfReviews} ????nh gi??</span>
                        <div className="numSold">
                            ???? b??n: {productDetails.quantitySold}
                        </div>
                    </div>
                </div>

                <div className="details-content-middle">
                    <div>
                        <span className="current-price">{formatPrice(productDetails.price)}???</span>
                        {productDetails.tag !== 0 && <span className="original-price">{formatPrice(productDetails.priceOriginal)}???</span>}
                    </div>
                    {
                        productDetails.tag !== 0 &&
                        <div className="sale-percentage">
                            <span>(B???n ???? ti???t ki???m ???????c {formatPrice((productDetails.priceOriginal) - (productDetails.price))}???)</span>
                        </div>
                    }
                </div>

                <div className="details-content-bottom">
                    <div className="row">
                        <div className="col-lg-6">
                            <ul>
                                <li>M??:&nbsp;<strong>{productDetails?._id}</strong></li>
                                {
                                    productDetails?.authors?.length > 0 ?
                                        <li>T??c gi???:&nbsp;
                                            <div className="d-inline-block" style={{ verticalAlign: "top" }}>
                                                {productDetails.authors?.map(author => (
                                                    <Fragment key={author._id}>
                                                        <strong>
                                                            <Link to={`/authors/${author.slugName}`}>{author.name}</Link>
                                                        </strong>
                                                        <br />
                                                    </Fragment>
                                                ))}
                                            </div>
                                        </li> : ""
                                }

                                <li>?????i t?????ng:&nbsp;
                                    <div className="d-inline-block" style={{ verticalAlign: "top" }}>
                                        {productDetails.object?.map(object => (
                                            <Fragment key={object}>
                                                <span>{object}</span>
                                                <br />
                                            </Fragment>
                                        ))}
                                    </div>
                                </li>

                                {
                                    productDetails.framework ?
                                        <li>
                                            Khu??n Kh???:&nbsp;{productDetails.framework} cm
                                        </li> : ""
                                }

                                {
                                    productDetails?.numOfPage ?
                                        <li>
                                            S??? trang:&nbsp;{productDetails.numOfPage}
                                        </li> : ""
                                }

                                {
                                    productDetails?.format ?
                                        <li>
                                            ?????nh d???ng:&nbsp;{productDetails.format}
                                        </li> : ""
                                }

                                {
                                    productDetails?.weight ?
                                        <li>
                                            Tr???ng l?????ng:&nbsp;{productDetails.weight} gram
                                        </li> : ""
                                }

                                {
                                    productDetails.collectionBook ?
                                        <li>
                                            B??? s??ch:&nbsp;
                                            <strong>
                                                <Link to={`/seriesbook/${productDetails.collectionBook.slugName}`}>
                                                    {productDetails?.collectionBook.name}
                                                </Link>
                                            </strong>
                                        </li> : ""
                                }
                            </ul>
                        </div>
                        <div className="col-lg-6">
                            {
                                productDetails.stock === 0 ? "" :
                                    <div className="quantity-addCart">
                                        <p>S??? l?????ng</p>
                                        <Quantity qty={qty} decreaseQty={() => decreaseQtyDetail()} increaseQty={() => increaseQtyDetail()} />
                                    </div>
                            }

                            <div className="product-actions">
                                {
                                    productDetails.stock === 0 ?
                                        <Button type="button" disabled>
                                            T???m h???t h??ng
                                        </Button>
                                        :
                                        <>
                                            <Button width="100%" onClick={() => addToCart()} type="button">
                                                Th??m v??o gi??? h??ng
                                            </Button>
                                            <Button type="button" width="50%">
                                                Mua ngay
                                            </Button>
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetailsContent
